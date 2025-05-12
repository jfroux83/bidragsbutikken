<?php

namespace App\Http\Controllers;

use App\Jobs\UserPasswordResetJob;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\OrganizationVendor;
use App\Models\PostalCode;
use App\Models\User;
use App\Models\Vendor;
use App\Services\UserRegistrationService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use Inertia\ResponseFactory;

class AdminOrganizationController extends Controller
{
    protected UserRegistrationService $userRegistrationService;

    public function __construct(UserRegistrationService $userRegistrationService)
    {
        $this->userRegistrationService = $userRegistrationService;
    }

    public function index(): Response|ResponseFactory
    {
        try {
            $organizations = Organization::with(['vendor:id,name'])
                ->orderBy('name')
                ->get()
                ->map(fn ($org) => [
                    'id' => $org->id,
                    'status' => (bool) $org->status,
                    'name' => $org->name,
                    'registrationNumber' => $org->registration_number,
                    'address1' => $org->address_1,
                    'address2' => $org->address_2,
                    'city' => $org->city,
                    'postalCode' => $org->postal_code,
                    'telephone' => $org->telephone,
                    'email' => $org->email,
                    'vendor_id' => $org->vendor_id,
                    'vendor_name' => $org->vendor?->name,
                ]);

            return inertia('Admin/Organization/Index', [
                'organizations' => $organizations,
            ]);

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(AdminOrganizationController::class . '::index(): ' . $e->getMessage());
            return inertia('Admin/Organization/Index', [
                'organizations' => [],
            ]);
        }
    }

    public function create(): Response|ResponseFactory
    {
        return inertia('Admin/Organization/Create', [
            'postalCodes' => $this->getPostalCodes(),
            'vendors' => $this->getVendors(),
        ]);
    }

    public function store(): RedirectResponse
    {
        $validate = request()->validate([
            'status' => ['required'],
            'name' => ['required'],
            'registrationNumber' => [],
            'address1' => [],
            'address2' => [],
            'city' => [],
            'postalCode' => [],
            'telephone' => [],
            'email' => ['required', 'email'],
            'vendor_id' => ['nullable'],
        ]);

        try {
            // Check if email already exists in users table before creating organization
            if (User::where('email', $validate['email'])->exists()) {
                return redirect()
                    ->back()
                    ->withInput()
                    ->with('error', 'A user with this email address already exists.');
            }

            $organization = Organization::create([
                'status' => $validate['status'],
                'name' => $validate['name'],
                'registration_number' => $validate['registrationNumber'],
                'address_1' => $validate['address1'],
                'address_2' => $validate['address2'],
                'city' => $validate['city'],
                'postal_code' => $validate['postalCode'],
                'telephone' => $validate['telephone'],
                'email' => $validate['email'],
                'vendor_id' => $validate['vendor_id']
            ]);

            $registration = $this->userRegistrationService->userRegistration('organization', $organization->id, $validate['email']);

            if (!$registration) {
                // Delete the created organization since user registration failed
                $organization->delete();

                return redirect()
                    ->route('admin.organization.index')
                    ->with('error', 'Registration failed: Email address is already in use.');
            }

            return redirect()
                ->route('admin.organization.index')
                ->with('success', 'Organization created successfully.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(AdminOrganizationController::class . '::create(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again later.');
        }
    }

    public function edit(Organization $organization): Response|ResponseFactory
    {
        return inertia('Admin/Organization/Container', [
            'organization' => [
                'id' => $organization->id,
                'status' => (bool) $organization->status,
                'name' => $organization->name,
                'registrationNumber' => $organization->registration_number,
                'address1' => $organization->address_1,
                'address2' => $organization->address_2,
                'city' => $organization->city,
                'postalCode' => $organization->postal_code,
                'telephone' => $organization->telephone,
                'email' => $organization->email,
                'logo' => $organization->logo,
                'vendor_id' => $organization->vendor_id
            ],
            'postalCodes' => $this->getPostalCodes(),
            'vendors' => $this->getVendors(),
        ]);
    }

    public function update(Organization $organization): RedirectResponse
    {
        $validate = request()->validate([
            'status' => ['required'],
            'name' => ['required'],
            'registrationNumber' => ['nullable'],
            'address1' => ['nullable'],
            'address2' => ['nullable'],
            'city' => ['nullable'],
            'postalCode' => ['nullable'],
            'telephone' => ['nullable'],
            'email' => ['nullable'],
            'vendor_id' => ['nullable'],
        ]);

        try {
            $organization->update([
                'status' => $validate['status'],
                'name' => $validate['name'],
                'registration_number' => $validate['registrationNumber'],
                'address_1' => $validate['address1'],
                'address_2' => $validate['address2'],
                'city' => $validate['city'],
                'postal_code' => $validate['postalCode'],
                'telephone' => $validate['telephone'],
                'email' => $validate['email'],
                'vendor_id' => $validate['vendor_id']
            ]);

            $user_id = OrganizationUser::where('organization_id', $organization->id)->first()->user_id;
            $user = User::where('id', $user_id)->first();
            $user->update(['email' => $validate['email']]);

            return redirect()
                ->route('admin.organization.index')
                ->with('success', 'Organization updated successfully.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(AdminOrganizationController::class . '::update(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again later.');
        }
    }

    public function destroy(Organization $organization): RedirectResponse
    {
        try {
            $organization->delete();

            return redirect()
                ->route('admin.organization.index')
                ->with('success', 'Organization deleted successfully.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(AdminOrganizationController::class . '::destroy(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->with('error', 'Something went wrong. Please try again later.');
        }
    }

    /**
     * Organization Users
     */
    public function users(Organization $organization): JsonResponse
    {
        return response()->json([
            'message' => 'success',
            'users' => $this->getOrganizationUsers($organization->id),
        ]);
    }

    public function destroyUser(): JsonResponse
    {
        $validate = request()->validate([
            'organizationId' => ['required'],
            'userId' => ['required'],
        ]);

        try {
            OrganizationUser::where('user_id', $validate['userId'])->delete();
            User::find($validate['userId'])->delete();

            return response()->json([
                'message' => 'success',
                'users' => $this->getOrganizationUsers($validate['organizationId']),
            ]);

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(AdminOrganizationController::class . '::destroyUser(): ' . $e->getMessage());
            return response()->json([
                'message' => 'error',
            ]);
        }
    }

    public function passwordReset(): JsonResponse
    {
        $validate = request()->validate([
            'userId' => ['required'],
        ]);

        try {
            $user = User::find($validate['userId']);
            $temporaryPassword = $this->userRegistrationService->generateTempPassword();
            $user->password = $temporaryPassword;
            $user->save();

            dispatch(new UserPasswordResetJob($user, $temporaryPassword));

            return response()->json([
                'message' => 'success',
            ]);

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(AdminOrganizationController::class . '::resetPassword(): ' . $e->getMessage());
            return response()->json([
                'message' => 'error',
            ]);
        }
    }

    /**
     * Organization Vendors
     */
    public function vendors(Organization $organization): JsonResponse
    {
        try {
            $vendors = Vendor::where('status', true)
                ->orderBy('name')
                ->get()
                ->map(fn ($vendor) => [
                    'id' => $vendor->id,
                    'title' => $vendor->name,
                ]);

            $vendorIds = OrganizationVendor::where('organization_id', $organization->id)
                ->get()
                ->pluck('vendor_id')
                ->toArray();

            $organizationVendors = Vendor::whereIn('id', $vendorIds)
                ->orderBy('name')
                ->get()
                ->map(fn ($vendor) => [
                    'id' => $vendor->id,
                    'title' => $vendor->name,
                ]);

            // Filter out assigned vendors to get the not_assigned set
            $notAssigned = $vendors->reject(function ($vendor) use ($vendorIds) {
                return in_array($vendor['id'], $vendorIds);
            })->values();

            $sections = [
                [
                    'id' => 1,
                    'key' => 'not_assigned',
                    'title' => 'Not Assigned',
                    'cards' => $notAssigned,
                ],
                [
                    'id' => 2,
                    'key' => 'assigned',
                    'title' => 'Assigned',
                    'cards' => $organizationVendors,
                ]
            ];

            return response()->json([
                'message' => 'success',
                'dataset' => $sections,
            ]);

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(AdminOrganizationController::class . '::vendors(): ' . $e->getMessage());
            return response()->json([
                'message' => 'error',
            ]);
        }
    }

    public function vendorSave(): JsonResponse
    {
        $validate = request()->validate([
            'organizationId' => ['required'],
            'vendorId' => ['required'],
        ]);

        try {
            $record = OrganizationVendor::where('organization_id', $validate['organizationId'])
                ->where('vendor_id', $validate['vendorId'])
                ->first();

            if (!$record) {
                OrganizationVendor::create([
                    'organization_id' => $validate['organizationId'],
                    'vendor_id' => $validate['vendorId'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $record->delete();
            }

            return response()->json([
                'message' => 'success',
            ]);

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(AdminOrganizationController::class . '::vendorSave(): ' . $e->getMessage());
            return response()->json([
                'message' => 'error',
            ]);
        }
    }


    /**
     * Helper methods
     */
    private function getPostalCodes()
    {
        return PostalCode::where('status', 1)
            ->orderBy('postal_code')
            ->get()
            ->map(fn ($postalCode) => [
                'label' => $postalCode->postal_code . ', ' . $postalCode->city,
                'value' => (string) $postalCode->postal_code,
            ]);
    }

    private function getVendors()
    {
        return Vendor::where('status', true)
            ->orderBy('name')
            ->get()
            ->map(fn ($vendor) => [
                'label' => $vendor->name,
                'value' => $vendor->id,
            ]);
    }

    private function getOrganizationUsers($organizationId)
    {
        $orgUsers = OrganizationUser::where('organization_id', $organizationId)
            ->get()
            ->pluck('user_id')
            ->toArray();

        return User::whereIn('id', $orgUsers)
            ->orderBy('name')
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'status' => (bool) $user->status,
                'name' => $user->name,
                'email' => $user->email,
                'locale' => $user->locale,
            ]);
    }
}

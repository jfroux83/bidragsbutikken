<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\PostalCode;
use App\Models\User;
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
            $organizations = Organization::orderBy('name')
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
        ]);

        try {
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
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $registration = $this->userRegistrationService->userRegistration('organization', $organization->id, $validate['email']);

            if (!$registration) {
                return redirect()
                    ->route('admin.organization.index')
                    ->with('error', 'Organization was successfully created but the user registration failed. Please investigate the logs');
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
                'logo' => $organization->logo
            ],
            'postalCodes' => $this->getPostalCodes(),
        ]);
    }

    public function update(Organization $organization): RedirectResponse
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
            'email' => [],
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
                'updated_at' => now(),
            ]);

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

    public function passwordReset(User $user): JsonResponse
    {
        try {
            $temporaryPassword = $this->userRegistrationService->generateTempPassword();
            $user->password = $temporaryPassword;
            $user->save();

            // dispatch(new SendUserPasswordEmailJob($user, $temporaryPassword));

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

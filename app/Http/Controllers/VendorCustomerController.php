<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\PostalCode;
use App\Services\UserRegistrationService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use Inertia\ResponseFactory;

class VendorCustomerController extends Controller
{
    protected UserRegistrationService $userRegistrationService;

    public function __construct(UserRegistrationService $userRegistrationService)
    {
        $this->userRegistrationService = $userRegistrationService;
    }

    public function index(): Response|ResponseFactory
    {
        $vendorId = session('vendor_id');

        $customers = Customer::whereHas('vendors', function ($query) use ($vendorId) {
            $query->where('vendor_id', $vendorId);
        })
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn ($customer) => [
                'id' => $customer->id,
                'status' => (bool) $customer->status,
                'firstName' => $customer->first_name,
                'lastName' => $customer->last_name,
                'city' => $customer->city,
                'postalCode' => $customer->postal_code,
                'telephone' => $customer->telephone,
                'email' => $customer->email,
            ]);

        return inertia('Vendor/Customer/Index', [
            'customers' => $customers,
        ]);
    }

    public function create(): Response|ResponseFactory
    {
        return inertia('Vendor/Customer/Create', [
            'postalCodes' => $this->getPostalCodes(),
        ]);
    }

    public function store(): RedirectResponse
    {
        $validate = request()->validate([
            'lastName' => ['required'],
            'firstName' => ['required'],
            'email' => ['required'],
            'telephone' => ['nullable'],
            'city' => ['nullable'],
            'postalCode' => ['nullable'],
        ]);

        try {
            $customer = Customer::create([
                'first_name' => $validate['firstName'],
                'last_name' => $validate['lastName'],
                'email' => $validate['email'],
                'telephone' => $validate['telephone'],
                'city' => $validate['city'],
                'postal_code' => $validate['postalCode'],
            ]);

            $customer->vendors()->attach(session('vendor_id'));

            $registration = $this->userRegistrationService->userRegistration('customer', $customer->id, $validate['email']);

            if (!$registration) {
                return redirect()
                    ->route('organization.customer.index')
                    ->with('error', 'Customer was successfully created but the user registration failed. Please investigate the logs');
            }

            return redirect()
                ->route('vendor.customer.index')
                ->with('success', 'Successfully registered customer.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(VendorCustomerController::class . '::store(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Failed to register customer.');
        }
    }

    public function edit(Customer $customer): Response|ResponseFactory
    {
        return inertia('Vendor/Customer/Container', [
            'customer' => [
                'id' => $customer->id,
                'status' => (bool) $customer->status,
                'firstName' => $customer->first_name,
                'lastName' => $customer->last_name,
                'email' => $customer->email,
                'telephone' => $customer->telephone,
                'street1' => $customer->street_1,
                'street2' => $customer->street_2,
                'city' => $customer->city,
                'postalCode' => $customer->postal_code,
                'referredBy' => $customer->referred_by
            ],
            'postalCodes' => $this->getPostalCodes(),
        ]);
    }

    public function update(Customer $customer): RedirectResponse
    {
        $validate = request()->validate([
            'firstName' => ['required'],
            'lastName' => ['required'],
            'email' => ['required'],
            'telephone' => ['nullable'],
            'city' => ['nullable'],
            'postalCode' => ['nullable'],
            'street1' => ['nullable'],
            'street2' => ['nullable'],
            'status' => ['required'],
            'referredBy' => ['nullable'],
        ]);

        try {
            $customer->update([
                'status' => $validate['status'],
                'first_name' => $validate['firstName'],
                'last_name' => $validate['lastName'],
                'email' => $validate['email'],
                'telephone' => $validate['telephone'],
                'street_1' => $validate['street1'],
                'street_2' => $validate['street2'],
                'city' => $validate['city'],
                'postal_code' => $validate['postalCode'],
                'referredBy' => $validate['referredBy'],
            ]);

            return redirect()
                ->route('vendor.customer.index')
                ->with('success', 'Successfully updated customer.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(VendorCustomerController::class . '::update(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Failed to update customer.');
        }
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        try {
            $customer->delete();

            return redirect()
                ->route('vendor.customer.index')
                ->with('success', 'Successfully deleted customer.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(VendorCustomerController::class . '::destroy(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->with('error', 'Failed to delete customer.');
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
}

<?php

namespace App\Http\Controllers;

use App\Models\PostalCode;
use App\Models\Vendor;
use App\Services\UserRegistrationService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use Inertia\ResponseFactory;

class AdminVendorController extends Controller
{
    protected UserRegistrationService $userRegistrationService;

    public function __construct(UserRegistrationService $userRegistrationService)
    {
        $this->userRegistrationService = $userRegistrationService;
    }

    public function index(): Response|ResponseFactory
    {
        $vendors = Vendor::orderBy('name')
            ->get()
            ->map(fn ($vendor) => [
                'id' => $vendor->id,
                'status' => (bool) $vendor->status,
                'name' => $vendor->name,
                'address1' => $vendor->address_1,
                'address2' => $vendor->address_2,
                'city' => $vendor->city,
                'postalCode' => $vendor->postal_code,
                'telephone' => $vendor->telephone,
                'email' => $vendor->email,
            ]);

        return inertia('Admin/Vendor/Index', [
            'vendors' => $vendors,
        ]);
    }

    public function create(): Response|ResponseFactory
    {
        return inertia('Admin/Vendor/Create', [
            'postalCodes' => $this->getPostalCodes(),
        ]);
    }

    public function store(): RedirectResponse
    {
        $validate = request()->validate([
            'status' => ['required'],
            'name' => ['required'],
            'address1' => [],
            'address2' => [],
            'city' => [],
            'postalCode' => [],
            'telephone' => [],
            'email' => ['required', 'email'],
            'receiveOrdersEmail' => ['required'],
            'freeShippingAmount' => ['required', 'numeric'],
            'adminFee' => ['required', 'numeric'],
            'paymentFee' => ['required', 'numeric'],
            'systemFee' => ['required', 'numeric'],
            'contributionFee' => ['required', 'numeric'],
            'bonusFee' => ['required', 'numeric'],
            'maxDeliveryDistance' => ['required', 'numeric'],
        ]);

        try {
            $vendor = Vendor::create([
                'status' => $validate['status'],
                'name' => $validate['name'],
                'address_1' => $validate['address1'],
                'address_2' => $validate['address2'],
                'city' => $validate['city'],
                'postal_code' => $validate['postalCode'],
                'telephone' => $validate['telephone'],
                'email' => $validate['email'],
                'receive_orders_email' => $validate['receiveOrdersEmail'],
                'free_shipping_amount' => $validate['freeShippingAmount'],
                'admin_fee' => $validate['adminFee'],
                'payment_fee' => $validate['paymentFee'],
                'system_fee' => $validate['systemFee'],
                'contribution_fee' => $validate['contributionFee'],
                'bonus_fee' => $validate['bonusFee'],
                'max_delivery_distance' => $validate['maxDeliveryDistance'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $registration = $this->userRegistrationService->userRegistration('vendor', $vendor->id, $validate['email']);

            if (!$registration) {
                return redirect()
                    ->route('admin.vendor.index')
                    ->with('error', 'Vendor was successfully created but the user registration failed. Please investigate the logs.');
            }

            return redirect()
                ->route('admin.vendor.index')
                ->with('success', 'Vendor created successfully.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(AdminVendorController::class . '::store(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again later.');
        }
    }

    public function edit(Vendor $vendor): Response|ResponseFactory
    {
        return inertia('Admin/Vendor/Edit', [
            'vendor' => [
                'id' => $vendor->id,
                'status' => (bool) $vendor->status,
                'name' => $vendor->name,
                'address1' => $vendor->address_1,
                'address2' => $vendor->address_2,
                'city' => $vendor->city,
                'postalCode' => $vendor->postal_code,
                'telephone' => $vendor->telephone,
                'email' => $vendor->email,
                'receiveOrdersEmail' => $vendor->receive_orders_email,
                'freeShippingAmount' => $vendor->free_shipping_amount,
                'adminFee' => $vendor->admin_fee,
                'paymentFee' => $vendor->payment_fee,
                'systemFee' => $vendor->system_fee,
                'contributionFee' => $vendor->contribution_fee,
                'bonusFee' => $vendor->bonus_fee,
                'maxDeliveryDistance' => $vendor->max_delivery_distance
            ],
            'postalCodes' => $this->getPostalCodes(),
        ]);
    }

    public function update(Vendor $vendor) {}

    public function destroy(Vendor $vendor) {}

    /**
     * Vendor Users
     */
    public function users(Vendor $vendor) {}

    public function destroyUser() {}

    public function passwordReset() {}

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

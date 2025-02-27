<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Inertia\Response;
use Inertia\ResponseFactory;

class VendorCustomerController extends Controller
{
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

    public function create() {}

    public function store() {}

    public function edit() {}

    public function update() {}

    public function destroy() {}
}

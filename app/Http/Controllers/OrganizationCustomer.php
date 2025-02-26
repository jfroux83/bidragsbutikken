<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * @method static where(string $string, mixed $organizationId)
 */
class OrganizationCustomer extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $organizationId = session('organization_id');

        $customers = Customer::whereHas('organizations', function ($query) use ($organizationId) {
                $query->where('organization_id', $organizationId);
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

        return inertia('Organization/Customer/Index', [
            'customers' => $customers,
        ]);
    }

    public function create() {}

    public function store() {}

    public function edit() {}

    public function update() {}

    public function destroy() {}
}

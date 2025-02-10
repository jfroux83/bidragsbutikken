<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use Inertia\ResponseFactory;

class AdminOrganizationController extends Controller
{
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

    public function create() {}

    public function store() {}

    public function edit(Organization $organization) {}

    public function update(Organization $organization) {}

    public function destroy(Organization $organization) {}
}

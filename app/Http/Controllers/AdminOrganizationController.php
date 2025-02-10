<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Exception;
use Illuminate\Http\RedirectResponse;
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

    public function create(): Response|ResponseFactory
    {
        return inertia('Admin/Organization/Create');
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
            'email' => [],
        ]);

        try {
            Organization::create([
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
            ]
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

    public function destroy(Organization $organization) {}
}

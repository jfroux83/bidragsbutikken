<?php

namespace Database\Seeders;

use App\Models\Profile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Profile::create([
            'name' => 'admin',
            'display_name' => 'System Administrator',
            'description' => 'Has full access to system settings and user management',
        ]);

        Profile::create([
            'name' => 'organization',
            'display_name' => 'Organization',
            'description' => 'Can manage customers within their organization',
        ]);

        Profile::create([
            'name' => 'vendor',
            'display_name' => 'Vendor',
            'description' => 'Can manage customers within their vendor community',
        ]);

        Profile::create([
            'name' => 'customer',
            'display_name' => 'Customer',
            'description' => 'Can manage their own profile, subscriptions and purchases',
        ]);
    }
}

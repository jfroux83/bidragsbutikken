<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@bidragsbutikken.no',
            'password' => 'G%53ymfy6w2j',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}

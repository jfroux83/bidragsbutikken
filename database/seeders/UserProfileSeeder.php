<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::connection('mysql')
            ->table('user_profiles')
            ->insert([
                'user_id' => 1,
                'profile_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
    }
}

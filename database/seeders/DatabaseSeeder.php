<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // Tambahkan Hash untuk mengenkripsi password

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Contoh Pengguna Admin (Role: admin)
        User::firstOrCreate(
            ['email' => 'admin@danusanx.com'],
            [
                'name' => 'Admin Danusan',
                // Pastikan password dienkripsi
                'password' => Hash::make('password123'), 
                'email_verified_at' => now(),
                'role' => 'admin', // ROLE DITAMBAHKAN
            ]
        );

        // 2. Contoh Pengguna Penjual (Role: penjual)
        User::firstOrCreate(
            ['email' => 'seller@danusanx.com'],
            [
                'name' => 'Penjual Utama',
                // Pastikan password dienkripsi
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'role' => 'penjual', // ROLE DITAMBAHKAN
            ]
        );
        
    }
}
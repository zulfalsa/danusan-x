<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    /**
     * Menangani permintaan registrasi pengguna Staff (Admin/Penjual).
     * Endpoint: POST /api/register
     */
    public function register(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            // VALIDASI EKSPLISIT UNTUK EMAIL YANG DIKIRIM DARI FRONTEND
            'email' => 'required|string|email|unique:users,email', 
            'password' => 'required|string|min:8|confirmed',
            // Role harus salah satu dari 'admin' atau 'penjual'
            'role' => ['required', 'string', Rule::in(['admin', 'penjual'])], 
        ]);

        if ($validator->fails()) {
            // Mengembalikan error validasi jika gagal
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Buat Pengguna Baru
        try {
            $user = User::create([
                'name' => $request->name,
                // MENGGUNAKAN EMAIL EKSPLISIT DARI REQUEST
                'email' => $request->email, 
                'password' => Hash::make($request->password),
                'role' => $request->role, // Simpan role
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menyimpan pengguna.', 'error' => $e->getMessage()], 500);
        }
        
        // 3. Buat Token Akses (Menggunakan Laravel Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Kirim Respon Sukses
        return response()->json([
            'message' => 'Registrasi berhasil. Silakan login.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Menangani permintaan login Staff (Admin/Penjual).
     * Endpoint: POST /api/login
     */
    public function login(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Cek Kredensial
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Kredensial yang dimasukkan salah.'], 401);
        }
        
        // Opsional: Cek role
        if (!in_array($user->role, ['admin', 'penjual'])) {
            return response()->json(['message' => 'Akses ditolak. Hanya untuk Staff/Admin.'], 403);
        }

        // 3. Buat Token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Kirim Respon Sukses
        return response()->json([
            'message' => 'Login Staff berhasil.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // Anda dapat menambahkan fungsi logout di sini jika diperlukan
}
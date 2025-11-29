<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class GateController extends Controller
{
    /**
     * Menampilkan halaman form gate.
     */
    public function show()
    {
        // Jika sudah punya akses (gate terbuka), langsung lempar ke login
        if (session()->has('gate_unlocked')) {
            return redirect()->route('login');
        }

        // Render tampilan React
        return Inertia::render('auth/gate');
    }

    /**
     * Memproses password rahasia.
     */
    public function unlock(Request $request)
    {
        // Validasi input
        $request->validate([
            'password' => 'required|string',
        ]);

        // Cek password.
        // NOTE: Di production, sebaiknya ambil dari .env, misal: env('GATE_PASSWORD')
        // Untuk sekarang kita set 'rahasia123'
        $correctPassword = env('GATE_PASSWORD', 'admin123');

        if ($request->password === $correctPassword) {
            // Jika benar, simpan tanda di session
            session(['gate_unlocked' => true]);
            
            // Redirect ke halaman login (sekarang middleware akan mengizinkan)
            return redirect()->route('login');
        }

        // Jika salah, kembalikan dengan error message
        return back()->withErrors(['password' => 'Password salah. Akses ditolak.']);
    }
}
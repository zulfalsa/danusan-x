<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckGatePass
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Jika user sudah login di aplikasi, biarkan lewat (tidak perlu gate lagi)
        if ($request->user()) {
            return $next($request);
        }

        // 2. Tentukan rute yang dilindungi.
        // Kita lindungi 'login' dan 'register' serta sub-path nya jika ada.
        $protectedPaths = ['login', 'register', 'login/*', 'register/*'];

        // 3. Cek apakah user mengakses rute terlarang
        if ($request->is($protectedPaths)) {
            // Jika belum punya "kunci" di session, tendang ke halaman gate
            if (! $request->session()->has('gate_unlocked')) {
                return redirect()->route('gate.form');
            }
        }

        return $next($request);
    }
}
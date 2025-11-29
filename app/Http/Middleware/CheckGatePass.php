<?php

namespace App\Http\Middleware; // wajib sesuai folder

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckGatePass
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return $next($request);
        }

        $protectedPaths = ['dashboard', 'checkout', 'order/*', 'cart'];

        if ($request->is($protectedPaths)) {
            if (! $request->session()->has('gate_unlocked')) {
                return redirect()->route('gate.form');
            }
        }

        return $next($request);
    }
}

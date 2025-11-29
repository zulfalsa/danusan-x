<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Tambahkan rute API otentikasi yang dipanggil oleh frontend React/fetch di sini:
        'api/register',
        'api/login',
        // Jika Anda memiliki rute API lain yang dipanggil melalui fetch/POST tanpa Inertia:
        // 'api/*', 
    ];
}
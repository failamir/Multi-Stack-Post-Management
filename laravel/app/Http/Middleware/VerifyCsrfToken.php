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
        'api/*',
        'sanctum/*',
        'login',
        'logout',
        'register',
        'forgot-password',
        'reset-password',
        'email/verify/*',
        'email/verification-notification'
    ];
}

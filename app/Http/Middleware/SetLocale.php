<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            App::setLocale(Auth::user()->locale);
        } else {
            // Handle cases where the user is not logged in (e.g., set a default locale)
            App::setLocale(config('app.locale')); // Use the default locale from your config/app.php
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserProfile
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $profileType): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user()->load('profiles');

        // Check if user has at least one profile
        $profile = $user->profiles->first();

        // Check if user has a profile
        if (!$profile) {
            Auth::logout();

            return redirect()
                ->route('login')
                ->with('error', 'No profile assigned. Please contact administrator.');
        }

        // Check if profile matches required type
        if ($profile->name !== $profileType) {
            return redirect()
                ->route($profile->name . '.dashboard')
                ->with('error', 'Unauthorized access attempt.');
        }

        // Add profile information to every response
        if (!$request->is('logout')) {
            $request->attributes->add(['current_profile' => $profile->name]);
        }

        return $next($request);
    }
}

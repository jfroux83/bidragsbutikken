<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Response;
use Inertia\ResponseFactory;

class AuthController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        return inertia('Auth/Login');
    }

    /**
     * @throws ValidationException
     */
    public function login(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user()->load('profiles');

        // Check if user has at least one profile
        $profile = $user->profiles->first();

        if (!$profile) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()
                ->route('login')
                ->with('error', 'No profile assigned. Please contact administrator.');
        }

        session(['profile_id' => $profile->id]);

        switch ($profile->name) {
            case 'organization':
                if ($user->organization) {
                    session(['organization_id' => $user->organization->first()->id]);
                }
                break;
            case 'vendor':
                if ($user->vendor) {
                    session(['vendor_id' => $user->vendor->first()->id]);
                }
                break;
            case 'customer':
                if ($user->customer) {
                    session(['customer_id' => $user->customer->first()->id]);
                }
                break;
        }

        // Update last login timestamp
        // $user->update(['last_login_at' => now()]);

        $profileRoute = $profile->name;

        // Redirect based on profile type
        return redirect()
            ->route($profileRoute . '.dashboard')
            ->with('success', 'Welcome back!');
    }

    public function logout(): RedirectResponse
    {
        Auth::logout();

        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect()->route('login');
    }

    /**
     * Show the password creation form.
     */
    public function createPassword(string $token): Response|ResponseFactory|RedirectResponse
    {
        $email = request()->query('email');

        $user = User::where('email', $email)
            ->where('password_reset_token', $token)
            ->where('password_change_required', true)
            ->first();

        if (!$user || $user->isPasswordResetTokenExpired()) {
            return redirect()
                ->route('login')
                ->with('error', 'This password setup link is invalid or has expired. Please contact support.');
        }

        return inertia('Auth/CreatePassword', [
            'email' => $email,
            'token' => $token
        ]);
    }

    /**
     * Store the new password.
     */
    public function storePassword(): RedirectResponse
    {
        $validated = request()->validate([
            'email' => ['required', 'email'],
            'token' => ['required'],
            'password' => ['required', 'min:12', 'confirmed'],
            'temporary_password' => ['required']
        ]);

        $user = User::where('email', $validated['email'])
            ->where('password_reset_token', $validated['token'])
            ->where('password_change_required', true)
            ->first();

        if (!$user || $user->isPasswordResetTokenExpired()) {
            return redirect()
                ->back()
                ->with('error', 'This password setup link is invalid or has expired.');
        }

        // Verify temporary password
        if (!Hash::check($validated['temporary_password'], $user->password)) {
            return redirect()
                ->back()
                ->withErrors(['temporary_password' => 'The temporary password is incorrect.']);
        }

        try {
            $user->password = $validated['password'];
            $user->password_change_required = false;
            $user->password_reset_token = null;
            $user->password_reset_token_expiry = null;
            $user->save();

            return redirect()
                ->route('login')
                ->with('success', 'Password set successfully. You can now log in with your new password.');

        } catch (Exception $e) {
            Log::channel('custom_error')->error('Failed to save new password', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to set password. Please try again.');
        }
    }
}

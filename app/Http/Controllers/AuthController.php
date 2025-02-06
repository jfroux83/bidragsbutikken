<?php

namespace App\Http\Controllers;

use App\Models\SCUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use Inertia\ResponseFactory;

class AuthController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        return inertia('Auth/Login');
    }

    public function login(): RedirectResponse
    {
        $validate = request()->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = SCUser::where('login', $validate['username'])->first();

        if (!$user || !hash('sha256', $validate['password']) === $user->password) {
            Log::channel('custom_errors')->error('Wrong username or password');
            return redirect()
                ->back()
                ->with('error', 'Wrong Credentials provided');
        }

        Auth::login($user);

        return redirect()
            ->route('dashboard');
    }
}

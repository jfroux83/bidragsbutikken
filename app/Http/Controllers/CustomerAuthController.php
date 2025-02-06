<?php

namespace App\Http\Controllers;

use App\Models\SCUser;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use Inertia\ResponseFactory;

class CustomerAuthController extends Controller
{
    public function showLogin(): Response|ResponseFactory
    {
        return inertia('Customers/Auth/Login');
    }

    public function login()
    {
        $validate = request()->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = SCUser::where('login', $validate['username'])->first();

        if (!$user) {
            return redirect()
                ->back()
                ->withErrors(['username' => 'No account with that username was found on our system']);
        }

        if (!$user->customer_customer_id) {
            return redirect()
                ->back()
                ->withErrors(['username' => 'This account is not registered as a customer account. Please contact the administrator']);
        }

        // dd(!(hash('sha256', $validate['password']) === $user->pswd));

        if (!(hash('sha256', $validate['password']) === $user->pswd)) {
            return redirect()
                ->back()
                ->withErrors(['username' => 'Wrong credentials provided']);
        }

        Auth::login($user);

        return redirect()
            ->route('dashboard');
    }

    public function logout()
    {

    }
}

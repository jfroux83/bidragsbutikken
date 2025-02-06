<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerAuthController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'index'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    Route::prefix('/customers')->name('customer.')->group(function () {
        Route::get('/login', [CustomerAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [CustomerAuthController::class, 'login'])->name('login.store');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('/customers')->name('customer.')->group(function () {
        Route::prefix('/profile')->name('profile.')->group(function () {
            Route::get('/{customer}', [])->name('index');
            Route::put('/{customer}', [])->name('update');
        });

        Route::prefix('/my-products')->name('my-products.')->group(function () {
            Route::get('/{customer}', [])->name('index');
            Route::put('/{customer}', [])->name('update');
        });

        Route::prefix('/products')->name('products.')->group(function () {
            Route::get('/', [])->name('index');
            Route::post('/add', [])->name('add');
        });

        Route::post('/logout', [CustomerAuthController::class, 'logout'])->name('logout');
    });
});

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()
            ->route('dashboard');
    }

    return redirect()
        ->route('login');
});

// include 'tests.php';

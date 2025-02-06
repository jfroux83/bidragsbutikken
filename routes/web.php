<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (!auth()->check()) {
        return redirect()->route('login');
    }

    // Get user's profile and redirect accordingly
    $user = auth()->user();
    $profile = $user->profile;

    return match ($profile->name) {
        'admin' => redirect()->route('admin.dashboard'),
        'organization' => redirect()->route('organization.dashboard'),
        'seller' => redirect()->route('seller.dashboard'),
        'customer' => redirect()->route('customer.dashboard'),
        default => redirect()->route('login')
    };
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'index'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

});

// System Admin Routes
Route::prefix('admin')->name('admin.')->middleware(['auth', 'profile:admin'])->group(function () {
     Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
});

// Organization Routes
Route::prefix('organization')->name('organization.')->middleware(['auth', 'profile:organization'])->group(function () {
    // Route::get('/dashboard', [OrganizationDashboardController::class, 'index'])->name('dashboard');
});

// Seller Routes
Route::prefix('seller')->name('seller.')->middleware(['auth', 'profile:seller'])->group(function () {
    // Route::get('/dashboard', [SellerDashboardController::class, 'index'])->name('dashboard');
});

// Customer Routes
Route::prefix('customer')->name('customer.')->middleware(['auth', 'profile:customer'])->group(function () {
    // Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
});

// include 'tests.php';

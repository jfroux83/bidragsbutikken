<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminOrganizationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerDashboardController;
use App\Http\Controllers\OrganizationDashboardController;
use App\Http\Controllers\PostalCodeController;
use App\Http\Controllers\VendorDashboardController;
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
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// System Admin Routes
Route::prefix('admin')->name('admin.')->middleware(['auth', 'profile:admin'])->group(function () {
     Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

     Route::prefix('configuration')->name('configuration.')->group(function () {
         Route::prefix('postal-code')->name('postal-code.')->group(function () {
             Route::get('/', [PostalCodeController::class, 'index'])->name('index');
             Route::get('/create', [PostalCodeController::class, 'create'])->name('create');
             Route::post('/', [PostalCodeController::class, 'store'])->name('store');
             Route::get('/{postalCode}/edit', [PostalCodeController::class, 'edit'])->name('edit');
             Route::put('/{postalCode}', [PostalCodeController::class, 'update'])->name('update');
             Route::delete('/{postalCode}', [PostalCodeController::class, 'destroy'])->name('destroy');
         });
     });

     Route::prefix('organization')->name('organization.')->group(function () {
         Route::get('/', [AdminOrganizationController::class, 'index'])->name('index');
         Route::get('/create', [AdminOrganizationController::class, 'create'])->name('create');
         Route::post('/', [AdminOrganizationController::class, 'store'])->name('store');
         Route::get('/{organization}/edit', [AdminOrganizationController::class, 'edit'])->name('edit');
         Route::put('/{organization}', [AdminOrganizationController::class, 'update'])->name('update');
         Route::delete('/{organization}', [AdminOrganizationController::class, 'destroy'])->name('destroy');
     });
});

// Organization Routes
Route::prefix('organization')->name('organization.')->middleware(['auth', 'profile:organization'])->group(function () {
     Route::get('/dashboard', [OrganizationDashboardController::class, 'index'])->name('dashboard');
});

// Vendor Routes
Route::prefix('vendor')->name('vendor.')->middleware(['auth', 'profile:vendor'])->group(function () {
     Route::get('/dashboard', [VendorDashboardController::class, 'index'])->name('dashboard');
});

// Customer Routes
Route::prefix('customer')->name('customer.')->middleware(['auth', 'profile:customer'])->group(function () {
     Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
});

// include 'tests.php';

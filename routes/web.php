<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminOrganizationController;
use App\Http\Controllers\AdminVendorController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerDashboardController;
use App\Http\Controllers\OrganizationDashboardController;
use App\Http\Controllers\PostalCodeController;
use App\Http\Controllers\SystemJobController;
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
    Route::get('/password/create/{token}', [AuthController::class, 'createPassword'])->name('password.create');
    Route::post('/password/store', [AuthController::class, 'storePassword'])->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// System Admin Routes
Route::prefix('admin')->name('admin.')->middleware(['auth', 'profile:admin'])->group(function () {
     Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // System Jobs routes
    Route::prefix('system-jobs')->name('jobs.')->group(function () {
        Route::get('/', [SystemJobController::class, 'index'])->name('index');
        Route::get('/active-count', [SystemJobController::class, 'activeCount'])->name('active-count');
        Route::get('/list', [SystemJobController::class, 'list'])->name('list');
        Route::get('{jobId}', [SystemJobController::class, 'cancel'])->name('cancel');
    });

    // Audit Logs
    Route::prefix('logs')->name('logs.')->group(function () {
        Route::get('/audit', [AuditLogController::class, 'index'])->name('audit.index');
        Route::post('/audit', [AuditLogController::class, 'show'])->name('audit.show');
    });

     Route::prefix('configuration')->name('configuration.')->group(function () {
         Route::prefix('postal-code')->name('postal-code.')->group(function () {
             Route::get('/', [PostalCodeController::class, 'index'])->name('index');
             Route::get('/create', [PostalCodeController::class, 'create'])->name('create');
             Route::post('/', [PostalCodeController::class, 'store'])->name('store');
             Route::get('/{postalCode}/edit', [PostalCodeController::class, 'edit'])->name('edit');
             Route::put('/{postalCode}', [PostalCodeController::class, 'update'])->name('update');
             Route::delete('/{postalCode}', [PostalCodeController::class, 'destroy'])->name('destroy');
             Route::get('/download-template', [PostalCodeController::class, 'downloadTemplate'])->name('downloadTemplate');
             Route::get('/upload', [PostalCodeController::class, 'upload'])->name('upload');
             Route::post('/upload', [PostalCodeController::class, 'uploadProcess'])->name('upload-process');
         });
     });

     Route::prefix('organization')->name('organization.')->group(function () {
         Route::get('/', [AdminOrganizationController::class, 'index'])->name('index');
         Route::get('/create', [AdminOrganizationController::class, 'create'])->name('create');
         Route::post('/', [AdminOrganizationController::class, 'store'])->name('store');
         Route::get('/{organization}/edit', [AdminOrganizationController::class, 'edit'])->name('edit');
         Route::put('/{organization}', [AdminOrganizationController::class, 'update'])->name('update');
         Route::delete('/{organization}', [AdminOrganizationController::class, 'destroy'])->name('destroy');
         // Organization->Users
         Route::get('/users/{organization}', [AdminOrganizationController::class, 'users'])->name('users');
         Route::post('/users', [AdminOrganizationController::class, 'destroyUser'])->name('destroy-user');
         Route::post('/users/password-reset', [AdminOrganizationController::class, 'passwordReset'])->name('password-reset');
     });

     Route::prefix('vendor')->name('vendor.')->group(function () {
         Route::get('/', [AdminVendorController::class, 'index'])->name('index');
         Route::get('/create', [AdminVendorController::class, 'create'])->name('create');
         Route::post('/', [AdminVendorController::class, 'store'])->name('store');
         Route::get('/{vendor}/edit', [AdminVendorController::class, 'edit'])->name('edit');
         Route::put('/{vendor}', [AdminVendorController::class, 'update'])->name('update');
         Route::delete('/{vendor}', [AdminVendorController::class, 'delete'])->name('destroy');
         // Vendor->Users
         Route::get('/users/{vendor}', [AdminVendorController::class, 'users'])->name('users');
         Route::post('/users', [AdminVendorController::class, 'destroyUser'])->name('destroy-user');
         Route::post('/users/password-reset', [AdminVendorController::class, 'passwordReset'])->name('password-reset');
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

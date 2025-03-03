<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use Inertia\ResponseFactory;

class AdminDashboardController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        return inertia('Admin/Dashboard/Index', [
            'locale' => [
                'admin_dashboard' => __('messages.admin_dashboard'),
                'admin_dashboard_welcome' => __('messages.admin_dashboard_welcome'),
            ]
        ]);
    }
}

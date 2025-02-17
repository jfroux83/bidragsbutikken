<?php

namespace App\Http\Controllers;

use Inertia\Response;
use Inertia\ResponseFactory;

class VendorDashboardController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        return inertia('Vendor/Dashboard/Index', []);
    }
}

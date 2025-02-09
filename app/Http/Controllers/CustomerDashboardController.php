<?php

namespace App\Http\Controllers;

use Inertia\Response;
use Inertia\ResponseFactory;

class CustomerDashboardController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        return inertia("Customer/Dashboard/Index", []);
    }
}

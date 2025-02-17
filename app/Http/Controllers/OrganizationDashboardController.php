<?php

namespace App\Http\Controllers;

use Inertia\Response;
use Inertia\ResponseFactory;

class OrganizationDashboardController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        return inertia("Organization/Dashboard/Index", []);
    }
}

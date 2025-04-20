<?php

namespace App\Http\Controllers;

use Inertia\Response;
use Inertia\ResponseFactory;

class ProductAttributeController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        return inertia('Vendor/Configuration/ProductAttribute/Index', []);
    }
}

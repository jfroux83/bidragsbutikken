<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Inertia\Response;
use Inertia\ResponseFactory;

class ProductCategoryController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $categories = ProductCategory::where('vendor_id', session('vendor_id'))
            ->orderBy('name')
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
            ]);

        return inertia('Vendor/Configuration/ProductCategory/Index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response|ResponseFactory
    {
        return inertia('Vendor/Configuration/ProductCategory/Create');
    }

    public function store() {}

    public function edit(ProductCategory $category) {}

    public function update(ProductCategory $category) {}

    public function destroy(ProductCategory $category) {}
}

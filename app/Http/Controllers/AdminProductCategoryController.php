<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Inertia\Response;
use Inertia\ResponseFactory;

class AdminProductCategoryController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $productCategories = ProductCategory::with(['vendor'])
            ->orderBy('name')
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'vendor_id' => $category->vendor_id,
                'vendor_name' => $category->vendor?->name,
                'name' => $category->name,
            ]);

        return inertia('Admin/Product/Category/Index', [
            'categories' => $productCategories,
        ]);
    }
}

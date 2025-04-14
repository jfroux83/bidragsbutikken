<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Response;
use Inertia\ResponseFactory;

class ProductController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $products = Product::where('vendor_id', session('vendor_id'))
            ->orderBy('name')
            ->get()
            ->map(fn ($product) => [
                'id' => $product->id,
                'status' => (bool) $product->status,
                'name' => $product->name,
                'base_price' => $product->base_price,
                'is_subscribable' => (bool) $product->is_subscribable,
            ]);

        return inertia('Vendor/Configuration/Product/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response|ResponseFactory
    {
        return inertia('Vendor/Configuration/Product/Create');
    }

    public function store() {}

    public function edit(Product $product) {}

    public function update(Product $product) {}

    public function destroy(Product $product) {}
}

<?php

namespace App\Http\Controllers;

use App\Models\VendorProductCatalog;
use Inertia\Response;
use Inertia\ResponseFactory;

class ProductCatalogController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $products = VendorProductCatalog::with(['sourceVendor:id,name', 'product'])
            ->where('vendor_id', session('vendor_id'))
            ->get()
            ->map(fn ($product) => [
                'id' => $product->id,
                'vendor_id' => $product->source_vendor_id,
                'vendor_name' => $product->sourceVendor->name,
                'product_id' => $product->product->id,
                'product_name' => $product->product->name,
            ]);

        return inertia('Vendor/Configuration/ProductCatalog/Index', [
            'products' => $products,
        ]);
    }
}

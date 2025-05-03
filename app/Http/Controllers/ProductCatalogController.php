<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Vendor;
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

    public function vendors(): Response|ResponseFactory
    {
        $currentVendor = session('vendor_id');

        // TODO: add logo of vendor
        $vendors = Vendor::where('is_public', true)
            ->where('status', true)
            ->whereNotIn('id', [$currentVendor])
            ->orderBy('name')
            ->get()
            ->map(fn ($vendor) => [
                'id' => $vendor->id,
                'name' => $vendor->name,
                'telephone' => $vendor->telephone,
                'email' => $vendor->email,
                'address_1' => $vendor->street_1,
                'address_2' => $vendor->street_2,
                'city' => $vendor->city,
                'postal_code' => $vendor->postal_code,
            ]);

        return inertia('Vendor/Configuration/ProductCatalog/Vendors', [
            'vendors' => $vendors,
        ]);
    }

    public function vendorProducts(Vendor $vendor): Response|ResponseFactory
    {
        $products = Product::with(['categories', 'tags', 'variations'])
            ->where('vendor_id', $vendor->id)
            ->where('status', true)
            ->orderBy('name')
            ->get()
            ->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'base_price' => $product->base_price,
                'is_subscribable' => (bool) $product->is_subscribable,
                'categories' => $product->categories->map(fn ($category) => [
                    'name' => $category->name,
                ]),
                'tags' => $product->tags->map(fn ($tag) => [
                    'name' => $tag->name,
                ]),
                'variations' => $product->variations->map(fn ($variation) => [
                    'id' => $variation->id,
                    'sku' => $variation->sku,
                    'price' => $variation->price,
                ])
            ]);

        return inertia('Vendor/Configuration/ProductCatalog/VendorProducts', [
            'vendor' => [
                'id' => $vendor->id,
                'name' => $vendor->name,
            ],
            'products' => $products,
        ]);
    }
}

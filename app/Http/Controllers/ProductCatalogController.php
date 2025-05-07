<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Vendor;
use App\Models\VendorProductCatalog;
use App\Models\VendorProductCatalogPrice;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
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
                'source_vendor_id' => $product->source_vendor_id,
                'source_vendor_name' => $product->sourceVendor->name,
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

    public function addProduct(): RedirectResponse
    {
        $validate = request()->validate([
            'source_vendor_id' => ['required'],
            'product_id' => ['required'],
        ]);

        try {
            $exists = VendorProductCatalog::where('vendor_id', session('vendor_id'))
                ->where('product_id', $validate['product_id'])
                ->where('source_vendor_id', $validate['source_vendor_id'])
                ->exists();

            if ($exists) {
                return redirect()
                    ->back()
                    ->with('error', 'Product already exists in catalog!');
            }

            $catalog = VendorProductCatalog::create([
                'vendor_id' => session('vendor_id'),
                'source_vendor_id' => $validate['source_vendor_id'],
                'product_id' => $validate['product_id'],
            ]);

            // Capture pricing
            $this->addProductPricing($catalog->id, $validate['product_id']);

            return redirect()
                ->route('vendor.product.catalog.index')
                ->with(['success' => 'Product added to catalog successfully.']);

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(ProductCatalogController::class . '::addProduct(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function editProduct(Vendor $vendor, Product $product): Response|ResponseFactory
    {
        $prices = VendorProductCatalogPrice::whereHas('catalog', function ($query) use ($vendor, $product) {
            $query->where('vendor_id', session('vendor_id'))
                  ->where('source_vendor_id', $vendor->id)
                  ->where('product_id', $product->id);
        })
        ->where('product_id', $product->id)
        ->orderBy('id')
        ->get()
        ->map(fn ($price) => [
            'id' => $price->id,
            'product_variation_id' => $price->product_variation_id,
            'type' => $price->type,
            'status' => (bool) $price->status,
            'price' => $price->price,
        ]);

        $product->load(['categories', 'tags']);

        return inertia('Vendor/Configuration/ProductCatalog/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'categories' => $product->categories->map(fn ($category) => [
                    'name' => $category->name,
                ]),
                'tags' => $product->tags->map(fn ($tag) => [
                    'name' => $tag->name,
                ])
            ],
            'source_vendor' => [
                'id' => $vendor->id,
                'name' => $vendor->name,
            ],
            'prices' => $prices,
        ]);
    }

    public function editPrice(VendorProductCatalogPrice $price): Response|ResponseFactory
    {
        $price->load(['product', 'productVariation']);

        return inertia('Vendor/Configuration/ProductCatalog/EditPrice', [
            'price' => [
                'id' => $price->id,
                'product' => [
                    'id' => $price->product_id,
                    'name' => $price->product->name,
                    'source_vendor_id' => $price->product->vendor_id
                ],
                'type' => $price->type,
                'status' => (bool) $price->status,
                'variation' => $price->productVariation?->sku,
                'price' => $price->price
            ]
        ]);
    }

    /**
     * Helper methods
     */
    private function addProductPricing(int $catalogId, int $productId): void
    {
        try {
            // lookup product
            $product = Product::with(['variations'])->where('id', $productId)->first();

            // Capture master base price
            VendorProductCatalogPrice::create([
                'vendor_product_catalog_id' => $catalogId,
                'product_id' => $productId,
                'product_variation_id' => null,
                'type' => 'Master',
                'status' => true,
                'price' => $product->base_price,
            ]);

            // Capture variations pricing if exists
            foreach ($product->variations as $variation) {
                VendorProductCatalogPrice::create([
                    'vendor_product_catalog_id' => $catalogId,
                    'product_id' => $productId,
                    'product_variation_id' => $variation->id,
                    'type' => 'Variation',
                    'status' => true,
                    'price' => $variation->price,
                ]);
            }

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(ProductCatalogController::class . '::addProductPricing(): ' . $e->getMessage());
        }
    }
}

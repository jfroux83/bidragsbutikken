<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductTag;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
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
        return inertia('Vendor/Configuration/Product/Create', [
            'categories' => $this->getCategories(),
            'tags' => $this->getTags()
        ]);
    }

    public function store(): RedirectResponse
    {
        $validated = request()->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', 'boolean'],
            'base_price' => ['nullable', 'numeric'],
            'is_subscribable' => ['nullable', 'boolean'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['required', 'integer', 'exists:product_categories,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['required', 'integer', 'exists:product_tags,id'],
        ]);

        try {
            $product = Product::create([
                'vendor_id' => session('vendor_id'),
                'name' => $validated['name'],
                'description' => $validated['description'],
                'status' => $validated['status'],
                'base_price' => $validated['base_price'],
                'is_subscribable' => $validated['is_subscribable'],
            ]);

            if (!empty($validated['category_ids'])) {
                $product->categories()->sync($validated['category_ids']);
            } else {
                $product->categories()->detach();
            }

            if (!empty($validated['tag_ids'])) {
                $product->tags()->sync($validated['tag_ids']);
            } else {
                $product->tags()->detach();
            }

            return redirect()
                ->route('vendor.product.index')
                ->with('success', 'Product created successfully.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(ProductController::class . '::store(): ' .  $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function edit(Product $product): Response|ResponseFactory
    {
        $product->load(['categories:id', 'tags:id']);

        return inertia('Vendor/Configuration/Product/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'status' => (bool) $product->status,
                'base_price' => $product->base_price,
                'is_subscribable' => (bool) $product->is_subscribable,
                'category_ids' => $product->categories->pluck('id')->toArray(),
                'tag_ids' => $product->tags->pluck('id')->toArray(),
            ],
            'categories' => $this->getCategories(),
            'tags' => $this->getTags(),
        ]);
    }

    public function update(Product $product): RedirectResponse
    {
        $validated = request()->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', 'boolean'],
            'base_price' => ['nullable', 'numeric'],
            'is_subscribable' => ['nullable', 'boolean'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['required', 'integer', 'exists:product_categories,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['required', 'integer', 'exists:product_tags,id'],
        ]);

        try {
            $product->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'status' => $validated['status'],
                'base_price' => $validated['base_price'],
                'is_subscribable' => $validated['is_subscribable'],
            ]);

            $product->categories()->sync($validated['category_ids'] ?? []);

            $product->tags()->sync($validated['tag_ids'] ?? []);

            return redirect()
                ->route('vendor.product.index')
                ->with('success', 'Product updated successfully.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(ProductController::class . '::update(): ' .  $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function destroy(Product $product) {}

    /**
     * Helper methods
     */
    private function getCategories()
    {
        return ProductCategory::where('vendor_id', session('vendor_id'))
            ->orderBy('name')
            ->get()
            ->map(fn ($category) => [
                'value' => $category->id,
                'label' => $category->name,
            ]);
    }

    private function getTags()
    {
        return ProductTag::where('vendor_id', session('vendor_id'))
            ->orderBy('name')
            ->get()
            ->map(fn ($tag) => [
                'value' => $tag->id,
                'label' => $tag->name,
            ]);
    }
}

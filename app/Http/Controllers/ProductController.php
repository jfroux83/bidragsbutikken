<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductCategory;
use App\Models\ProductTag;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
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
            'tags' => $this->getTags(),
            'attributes' => $this->getAttributes(),
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
            'variations' => ['nullable', 'array'],
            'variations.*.sku' => ['required', 'string', 'max:100'],
            'variations.*.price' => ['required', 'numeric', 'min:0'],
            'variations.*.stock' => ['required', 'integer', 'min:0'],
            'variations.*.is_active' => ['required', 'boolean'],
            'variations.*.options' => ['required', 'array', 'min:1'],
            'variations.*.options.*.attribute_name' => ['required', 'string'],
            'variations.*.options.*.attribute_value' => ['required', 'string'],
        ]);

        try {
            DB::beginTransaction();

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

            // Save variations
            if (!empty($validated['variations'])) {
                foreach ($validated['variations'] as $variationData) {
                    $variation = $product->variations()->create([
                        'sku' => $variationData['sku'],
                        'price' => $variationData['price'],
                        'stock' => $variationData['stock'],
                        'is_active' => $variationData['is_active'],
                    ]);

                    // Save variation options
                    foreach ($variationData['options'] as $option) {
                        $variation->options()->create([
                            'attribute_name' => $option['attribute_name'],
                            'attribute_value' => $option['attribute_value'],
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()
                ->route('vendor.product.index')
                ->with('success', 'Product created successfully.');

        } catch (Exception $e) {
            DB::rollBack();
            Log::channel('custom_errors')->error(ProductController::class . '::store(): ' .  $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function edit(Product $product): Response|ResponseFactory
    {
        $product->load(['categories:id', 'tags:id', 'variations.options']);

        $variations = $product->variations->map(function($variation) {
            return [
                'id' => $variation->id,
                'product_id' => $variation->product_id,
                'sku' => $variation->sku,
                'price' => $variation->price,
                'stock' => $variation->stock,
                'is_active' => (bool)$variation->is_active,
                'options' => $variation->options->map(function($option) {
                    return [
                        'attribute_name' => $option->attribute_name,
                        'attribute_value' => $option->attribute_value,
                    ];
                }),
            ];
        });

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
                'variations' => $variations,
            ],
            'categories' => $this->getCategories(),
            'tags' => $this->getTags(),
            'attributes' => $this->getAttributes(),
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
            'variations' => ['nullable', 'array'],
            'variations.*.id' => ['nullable', 'integer'],
            'variations.*.sku' => ['required', 'string', 'max:100'],
            'variations.*.price' => ['required', 'numeric', 'min:0'],
            'variations.*.stock' => ['required', 'integer', 'min:0'],
            'variations.*.is_active' => ['required', 'boolean'],
            'variations.*.options' => ['required', 'array', 'min:1'],
            'variations.*.options.*.attribute_name' => ['required', 'string'],
            'variations.*.options.*.attribute_value' => ['required', 'string'],
        ]);

        try {
            DB::beginTransaction();

            $product->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'status' => $validated['status'],
                'base_price' => $validated['base_price'],
                'is_subscribable' => $validated['is_subscribable'],
            ]);

            $product->categories()->sync($validated['category_ids'] ?? []);

            $product->tags()->sync($validated['tag_ids'] ?? []);

            // Handle variations
            if (isset($validated['variations'])) {
                // Keep track of updated variation IDs to detect deleted ones
                $updatedVariationIds = [];

                foreach ($validated['variations'] as $variationData) {
                    if (isset($variationData['id']) && $variationData['id'] > 0) {
                        // Existing variation - update it
                        $variation = $product->variations()->findOrFail($variationData['id']);
                        $variation->update([
                            'sku' => $variationData['sku'],
                            'price' => $variationData['price'],
                            'stock' => $variationData['stock'],
                            'is_active' => $variationData['is_active'],
                        ]);

                        // Delete existing options and add new ones
                        $variation->options()->delete();
                        foreach ($variationData['options'] as $option) {
                            $variation->options()->create([
                                'attribute_name' => $option['attribute_name'],
                                'attribute_value' => $option['attribute_value'],
                            ]);
                        }

                        $updatedVariationIds[] = $variation->id;
                    } else {
                        // New variation - create it
                        $variation = $product->variations()->create([
                            'sku' => $variationData['sku'],
                            'price' => $variationData['price'],
                            'stock' => $variationData['stock'],
                            'is_active' => $variationData['is_active'],
                        ]);

                        foreach ($variationData['options'] as $option) {
                            $variation->options()->create([
                                'attribute_name' => $option['attribute_name'],
                                'attribute_value' => $option['attribute_value'],
                            ]);
                        }

                        $updatedVariationIds[] = $variation->id;
                    }
                }

                // Delete variations that weren't in the update
                $product->variations()->whereNotIn('id', $updatedVariationIds)->delete();
            } else {
                // No variations submitted, delete all
                $product->variations()->delete();
            }

            DB::commit();

            return redirect()
                ->route('vendor.product.index')
                ->with('success', 'Product updated successfully.');

        } catch (Exception $e) {
            DB::rollBack();
            Log::channel('custom_errors')->error(ProductController::class . '::update(): ' .  $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function destroy(Product $product): RedirectResponse
    {
        try {
            DB::beginTransaction();

            // Delete variation options and variations (cascade doesn't handle this nested relationship)
            foreach ($product->variations as $variation) {
                $variation->options()->delete();
            }
            $product->variations()->delete();

            // Delete product category and tag relationships
            // (these are many-to-many relationships, so we detach rather than delete)
            $product->categories()->detach();
            $product->tags()->detach();

            // Delete the product
            $product->delete();

            DB::commit();

            return redirect()
                ->route('vendor.product.index')
                ->with('success', 'Product deleted successfully.');

        } catch (Exception $e) {
            DB::rollBack();
            Log::channel('custom_errors')->error(ProductController::class . '::destroy(): ' . $e->getMessage());

            return redirect()
                ->back()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }

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

    private function getAttributes()
    {
        return ProductAttribute::with(['values'])
            ->where('vendor_id', session('vendor_id'))
            ->get()
            ->map(fn ($attribute) => [
                'name' => $attribute->name,
                'values' => $attribute->values->map(fn ($value) => $value->value)
            ]);
    }
}

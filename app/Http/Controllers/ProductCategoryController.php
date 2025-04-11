<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
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

    public function store(): RedirectResponse
    {
        $validate = request()->validate([
            'name' => ['required'],
        ]);

        try {
            ProductCategory::create([
                'vendor_id' => session('vendor_id'),
                'name' => $validate['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return redirect()
                ->route('vendor.product.category.index')
                ->with('success', 'Product category created successfully.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(ProductCategoryController::class . '::store(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function edit(ProductCategory $category): Response|ResponseFactory
    {
        return inertia('Vendor/Configuration/ProductCategory/Edit', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name
            ]
        ]);
    }

    public function update(ProductCategory $category): RedirectResponse
    {
        $validate = request()->validate([
            'name' => ['required'],
        ]);

        try {
            $category->update([
                'name' => $validate['name'],
                'updated_at' => now(),
            ]);

            return redirect()
                ->route('vendor.product.category.index')
                ->with('success', 'Product category updated successfully.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(ProductCategoryController::class . '::update(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function destroy(ProductCategory $category): RedirectResponse
    {
        try {
            $category->delete();

            return redirect()
                ->route('vendor.product.category.index')
                ->with('success', 'Product category deleted successfully.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(ProductCategoryController::class . '::destroy(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->with('error', 'Something went wrong. Please try again later.');
        }
    }
}

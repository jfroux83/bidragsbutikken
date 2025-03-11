<?php

namespace App\Http\Controllers;

use App\Models\ProductTag;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use Inertia\ResponseFactory;

class ProductTagController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $productTags = ProductTag::where('vendor_id', session('vendor_id'))
            ->orderBy('name')
            ->get()
            ->map(fn ($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
            ]);

        return inertia('Vendor/Configuration/ProductTag/Index', [
            'tags' => $productTags,
        ]);
    }

    public function create(): Response|ResponseFactory
    {
        return inertia('Vendor/Configuration/ProductTag/Create');
    }

    public function store(): RedirectResponse
    {
        $validate = request()->validate([
            'name' => ['required'],
        ]);

        try {
            ProductTag::create([
                'vendor_id' => session('vendor_id'),
                'name' => $validate['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return redirect()
                ->route('vendor.product.tag.index')
                ->with('message', 'Product tag  successfully created.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(ProductTagController::class . '::store(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('message', 'Something went wrong. Please try again.');
        }
    }

    public function edit(ProductTag $tag) {}

    public function update(ProductTag $tag) {}

    public function destroy(ProductTag $tag) {}
}

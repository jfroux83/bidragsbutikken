<?php

namespace App\Http\Controllers;

use App\Models\OrganizationProduct;
use App\Models\OrganizationUser;
use App\Models\ProductCategory;
use App\Models\ProductTag;
use App\Models\VendorUser;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use Inertia\ResponseFactory;

class CustomerDashboardController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $products = [];
        $categories = [];
        $tags = [];
        $user_id = Auth::id();
        $user_organization_exists = OrganizationUser::where('user_id', $user_id)->exists();

        if ($user_organization_exists) {
            $organization = OrganizationUser::with(['organization:id,vendor_id'])->where('user_id', $user_id)->first();

            $products = OrganizationProduct::with(['product', 'product.variations', 'product.categories', 'product.tags'])
                ->where('organization_id', $organization->id)
                ->where('status', true)
                ->get()
                ->map(fn ($product) => [
                    'id' => $product->product?->id,
                    'name' => $product->product?->name,
                    'tag_line' => $product->product?->tag_line,
                    'unit_measure' => $product->product?->unit_measure,
                    'variations' => $product->product?->variations->map(fn ($variation) => [
                        'id' => $variation->id,
                        'sku' => $variation->sku,
                        'price' => $variation->price,
                        'status' => (bool) $variation->is_active,
                    ]),
                    'categories' => $product->product?->categories->map(fn ($category) => $category->id),
                    'tags' => $product->product?->tags->map(fn ($tag) => $tag->id),
                ]);

            $categories = $this->getCategories($organization->organization->vendor_id);
            $tags = $this->getTags($organization->organization->vendor_id);

        } else {
            $user_vendor_exists = VendorUser::where('user_id', $user_id)->exists();

            if ($user_vendor_exists) {
                $vendor = VendorUser::where('user_id', $user_id)->first();
            }
        }

        return inertia("Customer/Dashboard/Index", [
            'products' => $products,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Helper methods
     */
    private function getCategories(int $vendorId)
    {
        return ProductCategory::where('vendor_id', $vendorId)
            ->get()
            ->map(fn ($category) => [
                'label' => $category->name,
                'value' => $category->id,
            ]);
    }

    private function getTags(int $vendorId)
    {
        return ProductTag::where('vendor_id', $vendorId)
            ->get()
            ->map(fn ($tag) => [
                'label' => $tag->name,
                'value' => $tag->id,
            ]);
    }
}

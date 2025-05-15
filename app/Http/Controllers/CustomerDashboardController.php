<?php

namespace App\Http\Controllers;

use App\Models\OrganizationProduct;
use App\Models\OrganizationUser;
use App\Models\VendorUser;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use Inertia\ResponseFactory;

class CustomerDashboardController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $products = [];
        $user_id = Auth::id();
        $user_organization_exists = OrganizationUser::where('user_id', $user_id)->exists();

        if ($user_organization_exists) {
            $organization = OrganizationUser::where('user_id', $user_id)->first();

            $products = OrganizationProduct::with(['product', 'product.variations'])
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
                    ])
                ]);

        } else {
            $user_vendor_exists = VendorUser::where('user_id', $user_id)->exists();

            if ($user_vendor_exists) {
                $vendor = VendorUser::where('user_id', $user_id)->first();
            }
        }

        return inertia("Customer/Dashboard/Index", [
            'products' => $products,
        ]);
    }
}

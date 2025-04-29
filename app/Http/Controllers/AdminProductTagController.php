<?php

namespace App\Http\Controllers;

use App\Models\ProductTag;
use Inertia\Response;
use Inertia\ResponseFactory;

class AdminProductTagController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $productTags = ProductTag::with(['vendor'])
            ->orderBy('name')
            ->get()
            ->map(fn ($tag) => [
                'id' => $tag->id,
                'vendor_id' => $tag->vendor_id,
                'vendor_name' => $tag->vendor?->name,
                'name' => $tag->name,
            ]);

        return inertia('Admin/Product/Tag/Index', [
            'tags' => $productTags,
        ]);
    }
}

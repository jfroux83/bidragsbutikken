<?php

namespace App\Http\Controllers;

use App\Models\ProductAttribute;
use App\Models\ProductAttributeValue;
use Illuminate\Http\JsonResponse;
use Inertia\Response;
use Inertia\ResponseFactory;

class ProductAttributeController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $attributes = ProductAttribute::with(['values'])
            ->where('vendor_id', session('vendor_id'))
            ->get()
            ->map(fn ($attribute) => [
                'id' => $attribute->id,
                'name' => $attribute->name,
                'values' => $attribute->values->map(fn ($value) => [
                    'id' => $value->id,
                    'value' => $value->value,
                ])
            ]);

        return inertia('Vendor/Configuration/ProductAttribute/Index', [
            'attributes' => $attributes,
        ]);
    }

    public function store(): JsonResponse
    {
        $validated = request()->validate([
            'name' => ['required', 'string', 'max:255'],
            'values' => ['required', 'array', 'min:1'],
            'values.*' => ['required', 'string', 'max:255']
        ]);

        // Create the attribute
        $attribute = ProductAttribute::create([
            'vendor_id' => session('vendor_id'),
            'name' => $validated['name'],
        ]);

        // Create all the values
        foreach ($validated['values'] as $value) {
            ProductAttributeValue::create([
                'product_attribute_id' => $attribute->id,
                'value' => $value,
            ]);
        }

        // Load the values relation
        $attribute->load('values');

        return response()->json($attribute);
    }

    public function update(ProductAttribute $attribute): JsonResponse
    {
        $validated = request()->validate([
            'name' => ['required', 'string', 'max:255'],
            'values' => ['required', 'array', 'min:1'],
        ]);

        $attribute->update([
            'name' => $validated['name'],
        ]);

        $existingValueIds = [];
        $newValues = [];

        foreach ($validated['values'] as $valueData) {
            if (isset($valueData['id'])) {
                $existingValueIds[] = $valueData['id'];
                $attributeValue = ProductAttributeValue::find($valueData['id']);
                if ($attributeValue) {
                    $attributeValue->update(['value' => $valueData['value']]);
                }
            } else {
                $newValues[] = new ProductAttributeValue(['value' => $valueData['value']]);
            }
        }

        $attribute->values()->whereNotIn('id', $existingValueIds)->delete();

        if (!empty($newValues)) {
            $attribute->values()->saveMany($newValues);
        }

        $attribute->load('values');

        return response()->json($attribute);
    }

    public function destroy(ProductAttribute $attribute): JsonResponse
    {
        $attribute->delete();

        return response()->json(['success' => true]);
    }

    public function updateValue(ProductAttribute $attribute, ProductAttributeValue $value): JsonResponse
    {
        $validated = request()->validate([
            'value' => ['required', 'string', 'max:255'],
        ]);

        // Ensure this value belongs to the attribute
        if ($value->product_attribute_id !== $attribute->id) {
            return response()->json(['error' => 'Value does not belong to this attribute'], 403);
        }

        $value->update(['value' => $validated['value']]);

        return response()->json($value);
    }

    public function destroyValue(ProductAttribute $attribute, ProductAttributeValue $value): JsonResponse
    {
        // Ensure this value belongs to the attribute
        if ($value->product_attribute_id !== $attribute->id) {
            return response()->json(['error' => 'Value does not belong to this attribute'], 403);
        }

        $value->delete();

        return response()->json(['success' => true]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static create(array $array)
 * @method static whereHas(string $string, \Closure $param)
 * @property mixed $id
 * @property mixed $product
 * @property mixed $type
 * @property mixed $status
 * @property mixed $productVariation
 * @property mixed $price
 * @property mixed $product_id
 * @property mixed $catalog
 */
class VendorProductCatalogPrice extends Model
{
    protected $table = 'vendor_product_catalog_pricing';

    protected $fillable = [
        'vendor_product_catalog_id',
        'product_id',
        'product_variation_id',
        'type',
        'status',
        'price'
    ];

    /**
     * Relationships
     */
    public function catalog(): BelongsTo
    {
        return $this->belongsTo(VendorProductCatalog::class, 'vendor_product_catalog_id', 'id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function productVariation(): BelongsTo
    {
        return $this->belongsTo(ProductVariation::class, 'product_variation_id', 'id');
    }
}

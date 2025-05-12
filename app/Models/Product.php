<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method static where(string $string, mixed $session)
 * @method static create(array $array)
 * @property mixed $id
 * @property mixed $name
 * @property mixed $description
 * @property mixed $status
 * @property mixed $base_price
 * @property mixed $is_subscribable
 * @property mixed $categories
 * @property mixed $tags
 * @property mixed $variations
 * @property mixed $unit_measure
 * @property mixed $tag_line
 */
class Product extends Model
{
    protected $fillable = [
        'vendor_id',
        'status',
        'name',
        'description',
        'base_price',
        'is_subscribable',
        'tag_line',
        'unit_measure',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'status' => 'integer',
        'is_subscribable' => 'boolean',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ProductCategory::class, 'product_category_product', 'product_id', 'category_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(ProductTag::class, 'product_tag_product', 'product_id', 'tag_id');
    }

    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static create(array $array)
 */
class ProductAttributeValue extends Model
{
    protected $table = 'product_attribute_values';

    protected $fillable = [
        'product_attribute_id',
        'value'
    ];

    public function productAttribute(): BelongsTo
    {
        return $this->belongsTo(ProductAttribute::class);
    }
}

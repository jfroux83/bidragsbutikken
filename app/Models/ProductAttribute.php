<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method static create(array $array)
 * @property mixed $id
 */
class ProductAttribute extends Model
{
    protected $table = 'product_attributes';

    protected $fillable = [
        'vendor_id',
        'name'
    ];

    public function values(): HasMany
    {
        return $this->hasMany(ProductAttributeValue::class);
    }
}

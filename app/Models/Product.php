<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $table = 'product';
    protected $primaryKey = 'product_id';
    public $timestamps = false;
    protected $fillable = [];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_supplier_id', 'supplier_id');
    }
}

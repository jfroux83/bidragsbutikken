<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static where(string $string, $id)
 */
class AgreementLine extends Model
{
    protected $table = 'agreement_lines';
    protected $primaryKey = 'agreement_lines_id';
    public $timestamps = false;
    protected $fillable = [
        'product_Product_id',
        'quantity',
        'delivery_frequency',
        'customer_customer_id',
        'payment_option',
        'created_at',
        'updated_at',
        'first_delivery',
        'current_delivery',
        'last_delivery',
        'next_delivery',
        'once_off_purchase',
        'processed',
        'locked'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_Product_id', 'product_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_customer_id', 'customer_id');
    }
}

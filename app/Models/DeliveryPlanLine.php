<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static create(array $array)
 * @method static where(string $string, mixed $id)
 */
class DeliveryPlanLine extends Model
{
    protected $table = 'delivery_plan_lines';
    public $timestamps = false;
    protected $fillable = [
        'delivery_plan_header_id',
        'agreement_line_id',
        'product_id',
        'delivery_frequency',
        'payment_option',
        'quantity',
    ];

    public function deliveryPlanHeader(): BelongsTo
    {
        return $this->belongsTo(DeliveryPlanHeader::class, 'delivery_plan_header_id', 'id');
    }
}

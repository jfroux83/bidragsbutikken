<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static create(array $array)
 * @method static where(string $string, mixed $customerId)
 */
class DeliveryPlanHeader extends Model
{
    protected $table = 'delivery_plan_headers';
    public $timestamps = false;
    protected $fillable = [
        'doc_num',
        'customer_id',
        'created_at',
        'updated_at',
        'period',
        'file_name'
    ];
}

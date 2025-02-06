<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static where(string $string, string $endDate)
 * @method static create(array $array)
 */
class SystemFee extends Model
{
    protected $table = 'system_fee';
    protected $primaryKey = 'system_fee_id';
    public $timestamps = false;
    protected $fillable = [
        'system_fee_month',
        'payment_date',
        'to_pay',
        'organization_organization_id',
        'system_fee_header_system_fee_header_id',
        'payment_status',
        'payment_reference',
        'payment_link',
        'vipps_key'
    ];
}

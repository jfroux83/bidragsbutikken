<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XSystemFeeLine extends Model
{
    protected $table = 'x_system_fee_lines';
    protected $fillable = [
        'system_fee_header_id',
        'organization_id',
        'amount',
        'payment_status',
        'payment_link',
        'payment_reference',
        'vipps_key'
    ];
}

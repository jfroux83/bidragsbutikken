<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static whereIn(string $string, $customerIds)
 * @method static where(string $string, $customer_id)
 */
class InvoiceHeader extends Model
{
    protected $table = 'invoice_header';
    protected $primaryKey = 'invoice_header_id';
    public $timestamps = false;

    protected $fillable = [
        'doc_num',
        'customer_customer_id',
        'delivery_plan_header_id',
        'created_at',
        'total',
        'payment_reference',
        'payment_link',
        'vipps_key',
        'payment_status'
    ];
}

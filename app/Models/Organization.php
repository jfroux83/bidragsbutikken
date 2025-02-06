<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @method static select(string[] $array)
 */
class Organization extends Model
{
    protected $table = 'organization';
    protected $primaryKey = 'organization_id';
    public $timestamps = false;

    protected $fillable = [

    ];

    // relationships
    public function user(): HasOne
    {
        return $this->hasOne(SCUser::class, 'organization_organization_id', 'organization_id');
    }

    public function customers()
    {
        return $this->hasMany(Customer::class, 'organization_organization_id', 'organization_id');
    }

    public function systemFees()
    {
        return $this->hasMany(SystemFee::class, 'organization_organization_id', 'organization_id');
    }

    public function paymentMethod()
    {
        return $this->hasOne(PaymentMethod::class, 'payment_method_id', 'payment_method_pay');
    }
}

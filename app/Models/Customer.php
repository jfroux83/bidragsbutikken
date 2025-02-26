<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @method static whereIn(string $string, $customerIds)
 * @method static whereHas(string $string, \Closure $param)
 */
class Customer extends Model
{
    protected $table = 'customers';

    protected $fillable = [
        'status',
        'first_name',
        'last_name',
        'street_1',
        'street_2',
        'city',
        'postal_code',
        'telephone',
        'email',
        'referred_by',
    ];

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class, 'organization_customers', 'customer_id', 'organization_id');
    }

    public function vendors(): BelongsToMany
    {
        return $this->belongsToMany(Vendor::class, 'vendor_customers', 'customer_id', 'vendor_id');
    }
}

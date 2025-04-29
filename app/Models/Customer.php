<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @method static whereIn(string $string, $customerIds)
 * @method static whereHas(string $string, \Closure $param)
 * @method static create(array $array)
 * @property mixed $id
 * @property mixed $status
 * @property mixed $first_name
 * @property mixed $last_name
 * @property mixed $email
 * @property mixed $telephone
 * @property mixed $street_1
 * @property mixed $street_2
 * @property mixed $city
 * @property mixed $postal_code
 * @property mixed $referred_by
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
        return $this->belongsToMany(Organization::class, 'organization_customers', 'customer_id', 'organization_id')
            ->withTimestamps();
    }

    public function vendors(): BelongsToMany
    {
        return $this->belongsToMany(Vendor::class, 'vendor_customers', 'customer_id', 'vendor_id')
            ->withTimestamps();
    }
}

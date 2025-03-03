<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method static orderBy(string $string)
 * @method static create(array $array)
 * @property mixed $id
 * @property mixed $status
 * @property mixed $name
 * @property mixed $registration_number
 * @property mixed $address_1
 * @property mixed $address_2
 * @property mixed $city
 * @property mixed $postal_code
 * @property mixed $telephone
 * @property mixed $email
 * @property mixed $logo
 */
class Organization extends Model
{
    protected $table = 'organizations';

    protected $fillable = [
        'status',
        'name',
        'registration_number',
        'address_1',
        'address_2',
        'city',
        'postal_code',
        'telephone',
        'email',
        'logo'
    ];

    // relationships
    public function vendors(): HasMany
    {
        return $this->hasMany(OrganizationVendor::class, 'organization_id', 'id');
    }
}

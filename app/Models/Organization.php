<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static orderBy(string $string)
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
}

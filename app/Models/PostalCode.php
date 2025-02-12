<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static orderBy(string $string)
 * @method static create(array $array)
 * @property mixed $id
 * @property mixed $status
 * @property mixed $postal_code
 * @property mixed $city
 * @property mixed $latitude
 * @property mixed $longitude
 */
class PostalCode extends Model
{
    protected $table = 'postal_codes';

    protected $fillable = [
        'status',
        'postal_code',
        'city',
        'latitude',
        'longitude',
    ];
}

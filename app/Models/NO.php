<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static where(string $string, string $postalCode)
 */
class NO extends Model
{
    protected $table = 'no';
    protected $primaryKey = 'postcode';
    public $timestamps = false;
    protected $fillable = [
        'postcode',
        'city',
        'latitude',
        'longitude',
    ];
}

<?php

namespace App\Helpers;

use App\Models\NO;

class Address
{
    public static function getCity(string $postalCode): string
    {
        return NO::where('postcode', $postalCode)->first()->city;
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static orderBy(string $string)
 * @method static create(array $array)
 * @property mixed $id
 * @property mixed $status
 * @property mixed $name
 * @property mixed $address_1
 * @property mixed $address_2
 * @property mixed $city
 * @property mixed $postal_code
 * @property mixed $telephone
 * @property mixed $email
 * @property mixed $receive_orders_email
 * @property mixed $free_shipping_amount
 * @property mixed $admin_fee
 * @property mixed $payment_fee
 * @property mixed $system_fee
 * @property mixed $contribution_fee
 * @property mixed $bonus_fee
 * @property mixed $max_delivery_distance
 */
class Vendor extends Model
{
    protected $table = 'vendors';

    protected $fillable = [
        'status',
        'name',
        'address_1',
        'address_2',
        'city',
        'postal_code',
        'telephone',
        'email',
        'receive_orders_email',
        'free_shipping_amount',
        'admin_fee',
        'payment_fee',
        'system_fee',
        'contribution_fee',
        'bonus_fee',
        'max_delivery_distance',
        'logo'
    ];
}

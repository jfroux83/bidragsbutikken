<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * @method static where(string $string, mixed $username)
 */
class SCUser extends Authenticatable
{
    protected $table = 'sec_users';
    protected $primaryKey = 'login';
    public $timestamps = false;

    protected $fillable = [];

    public function groups()
    {
        return $this->hasMany(SCUserGroup::class, 'login', 'login');
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static where(string $string, int $int)
 */
class SystemOwner extends Model
{
    protected $table = 'system_owner';
    protected $primaryKey = 'system_owner_id';
    public $timestamps = false;
}

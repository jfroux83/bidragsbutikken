<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static create(array $array)
 */
class SystemFeeHeader extends Model
{
    protected $table = 'system_fee_header';
    protected $primaryKey = 'system_fee_header_id';
    public $timestamps = false;
    protected $fillable = [
        'doc_num',
        'message',
        'content',
        'system_fee_creation_date'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XSystemFeeHeader extends Model
{
    protected $table = 'x_system_fee_headers';
    protected $primaryKey = 'id';
    protected $fillable = [
        'doc_num',
        'date',
        'period',
        'total'
    ];
}

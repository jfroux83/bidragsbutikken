<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static whereIn(string $string, $customerIds)
 */
class DocumentHeader extends Model
{
    protected $table = 'document_header';
    protected $primaryKey = 'document_header_id';
    public $timestamps = false;
    protected $fillable = [];
}

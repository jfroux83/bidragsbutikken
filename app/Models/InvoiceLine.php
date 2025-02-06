<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static whereIN(string $string, $invoiceHeaderIds)
 */
class InvoiceLine extends Model
{
    protected $table = 'invoice_lines';
    protected $primaryKey = 'invoice_lines_id';
    public $timestamps = false;
    protected $fillable = [];
}

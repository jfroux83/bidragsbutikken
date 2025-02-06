<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static systemFee()
 * @method static deliveryPlan()
 */
class Document extends Model
{
    protected $table = 'document';
    protected $primaryKey = 'document_id';
    public $timestamps = false;

    protected $fillable = [
        'doc_type',
        'doc_prefix',
        'doc_padding',
        'doc_counter'
    ];

    // Scopes
    public function scopeSystemFee(Builder $query): void
    {
        $query->where('doc_type', 'system_fee');
    }

    public function scopeDeliveryPlan(Builder $query): void
    {
        $query->where('doc_type', 'plan');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
    protected $table = 'customer';
    protected $primaryKey = 'customer_id';
    protected $fillable = [];

    public function Organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'organization_organization_id', 'organization_id');
    }
}

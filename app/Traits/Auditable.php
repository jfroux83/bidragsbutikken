<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

/**
 * @method static created(\Closure $param)
 * @method static updated(\Closure $param)
 * @method static deleted(\Closure $param)
 */
trait Auditable
{
    protected static function bootAuditable(): void
    {
        static::created(function ($model) {
            static::audit('created', $model);
        });

        static::updated(function ($model) {
            static::audit('updated', $model);
        });

        static::deleted(function ($model) {
            static::audit('deleted', $model);
        });
    }

    protected static function audit(string $event, $model): void
    {
        $auditLog = new AuditLog();

        $auditLog->create([
            'event' => $event,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->id,
            'user_id' => Auth::id(),
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
            'old_values' => $event !== 'created' ? $model->getOriginal() : null,
            'new_values' => $model->getAttributes(),
            'extra' => [
                'model_type' => class_basename($model),
            ],
        ]);
    }
}

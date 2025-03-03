<?php

namespace App\Services;

use App\Models\AuditLog;
use Exception;

class AuditService
{
    public function log(
        string $event,
        ?string $auditableType = null,
        ?int $auditableId = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?array $extra = null
    )
    {
        try {
            return AuditLog::create([
                'event' => $event,
                'auditable_type' => $auditableType,
                'auditable_id' => $auditableId,
                'user_id' => auth()->id(),
                'ip_address' => request()?->ip(),
                'user_agent' => request()?->userAgent(),
                'old_values' => $oldValues,
                'new_values' => $newValues,
                'extra' => array_merge($extra ?? [], [
                    'environment' => config('app.env'),
                ]),
            ]);
        } catch (Exception $e) {
            report($e);
            return null;
        }
    }

    public function logBudgetEvent(
        string $event,
        string $category,
        array $data,
        ?array $oldData = null
    )
    {
        return $this->log(
            $event,
            null,
            null,
            $oldData,
            $data,
            ['category' => $category]
        );
    }
}

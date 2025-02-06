<?php

namespace App\Traits;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

trait ManagesSystemJobs
{
    protected function createSystemJob(
        string $name,
        string $type,
        array $parameters = [],
        string $message = null
    ): ?int
    {
        try {
            return DB::connection('mysql')->table('system_jobs')->insertGetId([
                'name' => $name,
                'type' => $type,
                'status' => 'pending',
                'parameters' => json_encode($parameters),
                'message' => $message ?? "Queued {$name}",
                'created_by' => 'System',
                'created_at' => now(),
                'updated_at' => now()
            ]);

        } catch (Exception $e) {
            Log::channel('custom_errors')->error('ManagesSystemJobs|createSystemJob: ' . $e->getMessage());
            return null;
        }
    }

    protected function updateSystemJob(int $jobId, array $data)
    {
        try {
            DB::connection('mysql')->table('system_jobs')
                ->where('id', $jobId)
                ->update(array_merge($data, [
                    'updated_at' => now()
                ]));

        } catch (Exception $e) {
            Log::channel('custom_errors')->error('ManagesSystemJobs|updateSystemJob: ' . $e->getMessage());
            return null;
        }
    }
}

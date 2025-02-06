<?php

namespace App\Jobs;

use App\Services\SystemFeeService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SystemFeeMonitorJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(SystemFeeService $service): void
    {
        $service->monitor();
    }
}

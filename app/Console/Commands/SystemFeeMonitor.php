<?php

namespace App\Console\Commands;

use App\Services\SystemFeeService;
use Illuminate\Console\Command;

class SystemFeeMonitor extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:system-fee-monitor';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(SystemFeeService $service): void
    {
        $service->monitor();
    }
}

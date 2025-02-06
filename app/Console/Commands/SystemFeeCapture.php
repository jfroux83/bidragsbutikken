<?php

namespace App\Console\Commands;

use App\Services\SystemFeeService;
use Illuminate\Console\Command;

class SystemFeeCapture extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:system-fee-capture';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(SystemFeeService $service)
    {
        $service->capture();
    }
}

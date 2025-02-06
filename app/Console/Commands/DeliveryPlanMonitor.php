<?php

namespace App\Console\Commands;

use App\Services\DeliveryPlanService;
use Illuminate\Console\Command;

class DeliveryPlanMonitor extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delivery-plan-monitor';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize delivery plan changes';

    /**
     * Execute the console command.
     */
    public function handle(DeliveryPlanService $service): void
    {
        $service->synchronize();
    }
}

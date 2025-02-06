<?php

namespace App\Console\Commands;

use App\Services\DeliveryPlanService;
use Illuminate\Console\Command;

class DeliveryPlanExecute extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delivery-plan-execute';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prepare customer delivery plans and sent out';

    /**
     * Execute the console command.
     */
    public function handle(DeliveryPlanService $service): void
    {
        $service->run();
    }
}

<?php

namespace App\Console\Commands;

use App\Services\VippsService;
use Illuminate\Console\Command;

class VippsTest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:vipps-test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Vipps Integration';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $service = new VippsService(3715, '4740410206', 'System Fee Payment');
        $response = $service->createPayment();

        $this->info('Vipps authenticated successfully!');
        $this->info(json_encode($response));
    }
}

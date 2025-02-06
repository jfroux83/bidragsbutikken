<?php

namespace App\Console\Commands;

use App\Services\SystemFeeService;
use Illuminate\Console\Command;
use Twilio\Exceptions\TwilioException;

class SystemFeeExecute extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:system-fee-execute';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Execute system fee';

    /**
     * Execute the console command.
     * @throws TwilioException
     */
    public function handle(SystemFeeService $service): void
    {
        $service->run();
    }
}

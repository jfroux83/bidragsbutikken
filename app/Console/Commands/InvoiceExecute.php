<?php

namespace App\Console\Commands;

use App\Services\InvoiceService;
use Illuminate\Console\Command;

class InvoiceExecute extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:invoice-execute';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prepare customer invoices and sent out';

    /**
     * Execute the console command.
     */
    public function handle(InvoiceService $service): void
    {
        $service->run();
    }
}

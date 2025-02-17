<?php

namespace App\Jobs;

use App\Imports\PostalCodesImport;
use App\Traits\ManagesSystemJobs;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Maatwebsite\Excel\Facades\Excel;

class PostalCodesImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, ManagesSystemJobs;

    public int $timeout = 3600;
    public int $tries = 1;
    protected int $systemJobId;
    protected string $filePath;

    /**
     * Create a new job instance.
     */
    public function __construct(int $systemJobId, string $filePath)
    {
        $this->systemJobId = $systemJobId;
        $this->filePath = $filePath;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Excel::import(
                new PostalCodesImport($this->systemJobId, $this->filePath),
                $this->filePath,
                'private'
            );

        } catch (Exception $e) {
            $this->updateSystemJob($this->systemJobId, [
                'status' => 'failed',
                'completed_at' => now(),
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function failed(Exception $e): void
    {
        $this->updateSystemJob($this->systemJobId, [
            'status' => 'failed',
            'completed_at' => now(),
            'error' => $e->getMessage(),
        ]);
    }
}

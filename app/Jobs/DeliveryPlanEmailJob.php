<?php

namespace App\Jobs;

use App\Mail\DeliveryPlanMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class DeliveryPlanEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private string $email;
    private string $language;
    private string $filePath;
    private string $name;
    private string $organization;

    public function __construct(string $email, string $language, string $filePath, string $name, string $organization)
    {
        $this->email = $email;
        $this->language = $language;
        $this->filePath = $filePath;
        $this->name = $name;
        $this->organization = $organization;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->email)
            ->send(new DeliveryPlanMail(
                $this->language,
                $this->filePath,
                $this->name,
                $this->organization
            ));
    }
}

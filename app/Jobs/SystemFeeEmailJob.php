<?php

namespace App\Jobs;

use App\Mail\SystemFeeMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SystemFeeEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $email;
    protected string $language;
    protected string $name;
    protected float $systemFeePercentage;
    protected float $systemFee;
    protected string $paymentMethod;
    protected array $customers;
    protected string $paymentLink;

    public function __construct(string $email, string $language, string $name, float $systemFeePercentage, float $systemFee, string $paymentMethod, array $customers, string $paymentLink)
    {
        $this->email = $email;
        $this->language = $language;
        $this->name = $name;
        $this->systemFeePercentage = $systemFeePercentage;
        $this->systemFee = $systemFee;
        $this->paymentMethod = $paymentMethod;
        $this->customers = $customers;
        $this->paymentLink = $paymentLink;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->email)
            ->send(new SystemFeeMail(
                $this->language,
                $this->name,
                $this->systemFeePercentage,
                $this->systemFee,
                $this->paymentMethod,
                $this->customers,
                $this->paymentLink
            ));
    }
}

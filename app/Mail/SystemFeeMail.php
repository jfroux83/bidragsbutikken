<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SystemFeeMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $language;
    public string $name;
    public float $systemFeePercentage;
    public float $systemFee;
    public string $paymentMethod;
    public array $customers;
    public string $paymentLink;

    /**
     * Create a new message instance.
     */
    public function __construct(string $language, string $name, float $systemFeePercentage, float $systemFee, string $paymentMethod, array $customers, string $paymentLink)
    {
        $this->language = $language;
        $this->name = $name;
        $this->systemFeePercentage = $systemFeePercentage;
        $this->systemFee = $systemFee;
        $this->paymentMethod = $paymentMethod;
        $this->customers = $customers;
        $this->paymentLink = $paymentLink;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'It is time to pay the system fee',
            //from: new Address(config('mail.from.address'), config('mail.from.name')),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        if ($this->language === 'no') {
            $view = 'emails.system_fee_no';
        } else {
            $view = 'emails.system_fee_en';
        }

        return new Content(
            view: $view,
            with: [
                'name' => $this->name,
                'systemFeePercentage' => $this->systemFeePercentage,
                'systemFee' => $this->systemFee,
                'paymentMethod' => $this->paymentMethod,
                'customers' => $this->customers,
                'paymentLink' => $this->paymentLink,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

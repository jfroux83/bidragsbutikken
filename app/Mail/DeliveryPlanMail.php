<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class DeliveryPlanMail extends Mailable
{
    use Queueable, SerializesModels;

    private string $language;
    private string $filePath;
    private string $name;
    private string $organization;

    /**
     * Create a new message instance.
     */
    public function __construct(string $language, string $filePath, string $name, string $organization)
    {
        $this->language = $language;
        $this->filePath = $filePath;
        $this->name = $name;
        $this->organization = $organization;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Notification of planned product delivery next month',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        if ($this->language === 'no') {
            $view = 'emails.delivery_plan_no';
        } else {
            $view = 'emails.delivery_plan_en';
        }

        return new Content(
            view: $view,
            with: [
                'name' => $this->name,
                'organization' => $this->organization
            ]
        );
    }

    public function attachments(): array
    {
        // File path relative to the 'private' disk
        $relativePath = $this->filePath;

        // Resolve the full path using the 'private' disk
        $absolutePath = Storage::disk('private')->path($relativePath);

        return [
            Attachment::fromPath($absolutePath)
                ->as('DeliveryPlan.pdf')
                ->withMime('application/pdf'),
        ];
    }
}

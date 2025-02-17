<?php

namespace App\Listeners;

use App\Traits\ManagesSystemJobs;
use Illuminate\Mail\Events\MessageSent;

class EventMailSent
{
    use ManagesSystemJobs;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  MessageSent  $event
     * @return void
     */
    public function handle(MessageSent $event): void
    {
        // For Symfony Mailer, $event->message is a Symfony\Component\Mime\Email instance.
        $headers = $event->message->getHeaders();

        if ($headers->has('X-System-Job-Id')) {
            // Use getBodyAsString() to retrieve the header value.
            $jobId = $headers->get('X-System-Job-Id')->getBodyAsString();

            // Update your system job to mark it as sent.
            $this->updateSystemJob($jobId, [
                'status' => 'completed',
                'progress' => 100,
                'message' => 'Email successfully sent.',
                'completed_at' => now(),
            ]);
        }
    }
}

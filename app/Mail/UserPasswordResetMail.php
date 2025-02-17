<?php

namespace App\Mail;

use App\Models\User;
use App\Traits\ManagesSystemJobs;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

/**
 * @method withSwiftMessage(\Closure $param)
 */
class UserPasswordResetMail extends Mailable
{
    use Queueable, SerializesModels, ManagesSystemJobs;

    private readonly int $systemJobId;
    private readonly User $user;
    private readonly string $temporaryPassword;

    /**
     * Create a new message instance.
     */
    public function __construct(int $systemJobId, User $user, string $temporaryPassword)
    {
        $this->systemJobId = $systemJobId;
        $this->user = $user;
        $this->temporaryPassword = $temporaryPassword;
    }

    /**
     * Build the message
     */
    public function build(): self
    {
        return $this->subject(config('app.name') . ' - User Password Reset')
            ->view('emails.user-password-reset', [
                'user' => $this->user,
                'temporaryPassword' => $this->temporaryPassword,
                'appName' => config('app.name'),
                'year' => now()->format('Y'),
            ])
            ->withSymfonyMessage(function ($message) {
                // Add a custom header with the system job id.
                $message->getHeaders()->addTextHeader('X-System-Job-Id', $this->systemJobId);
            });
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

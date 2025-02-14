<?php

namespace App\Mail;

use App\Models\User;
use App\Traits\ManagesSystemJobs;
use Carbon\Carbon;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserRegistrationWelcomeMail extends Mailable
{
    use Queueable, SerializesModels, ManagesSystemJobs;

    private readonly int $systemJobId;
    private readonly User $user;
    private readonly string $temporaryPassword;
    private readonly string $token;
    private readonly Carbon $tokenExpiry;

    /**
     * Create a new message instance.
     */
    public function __construct(int $systemJobId, User $user, string $temporaryPassword, string $token, Carbon $tokenExpiry)
    {
        $this->systemJobId = $systemJobId;
        $this->user = $user;
        $this->temporaryPassword = $temporaryPassword;
        $this->token = $token;
        $this->tokenExpiry = $tokenExpiry;
    }

    /**
     * Build the message
     */
    public function build(): self
    {
        $firstTimeLoginUrl = route('password.create', [
            'token' => $this->token,
            'email' => $this->user->email
        ]);

        $expiryTime = $this->tokenExpiry->format('F j, Y, g:i A');

        return $this->subject('Welcome to ' . config('app.name') . ' - Account Setup Required')
            ->view('emails.welcome-user', [
                'user' => $this->user,
                'temporaryPassword' => $this->temporaryPassword,
                'firstTimeLoginUrl' => $firstTimeLoginUrl,
                'expiryTime' => $expiryTime,
                'appName' => config('app.name'),
                'year' => now()->format('Y'),
            ]);
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

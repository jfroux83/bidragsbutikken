<?php

namespace App\Jobs;

use App\Mail\UserRegistrationWelcomeMail;
use App\Models\User;
use App\Traits\ManagesSystemJobs;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class UserRegistrationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, ManagesSystemJobs;

    /**
     * Number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * Number of seconds to wait before retrying the job.
     */
    public array $backoff = [60, 180, 300]; // 1min, 3mins, 5mins

    private readonly User $user;
    private readonly string $temporaryPassword;
    private readonly string $token;
    private string $jobId;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user, string $temporaryPassword, string $token)
    {
        $this->user = $user;
        $this->temporaryPassword = $temporaryPassword;
        $this->token = $token;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            if (!$this->user->exists ||
                !$this->user->password_reset_token ||
                $this->user->isPasswordResetTokenExpired()) {

                $this->fail(new Exception('User invalid or token expired'));
                return;
            }

            $this->jobId = $this->createSystemJob(
                name: 'Send User Registration Welcome Email',
                type: 'email.user-registration-welcome',
                parameters: [
                    'userId' => $this->user->id,
                    'userName' => $this->user->name,
                    'userEmail' => $this->user->email,
                    'temporaryPassword' => $this->temporaryPassword,
                    'token' => $this->token,
                ],
                message: 'Sending User Welcome Email starting...'
            );

            Mail::to($this->user->email)
                ->send(new UserRegistrationWelcomeMail(
                    systemJobId: $this->jobId,
                    user: $this->user,
                    temporaryPassword: $this->temporaryPassword,
                    token: $this->token,
                    tokenExpiry: $this->user->password_reset_token_expiry
                ));

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(UserRegistrationJob::class . '::handle(): ' . $e->getMessage());

            $this->updateSystemJob($this->jobId, [
                'status' => 'failed',
                'completed_at' => now(),
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function failed(Exception $e): void
    {
        $this->updateSystemJob($this->jobId, [
            'status' => 'failed',
            'completed_at' => now(),
            'error' => $e->getMessage(),
        ]);
    }
}

<?php

namespace App\Jobs;

use App\Mail\UserPasswordResetMail;
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

class UserPasswordResetJob implements ShouldQueue
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
    private string $jobId;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user, string $temporaryPassword)
    {
        $this->user = $user;
        $this->temporaryPassword = $temporaryPassword;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            if (!$this->user->exists) {
                $this->fail(new Exception('User invalid'));
                return;
            }

            $this->jobId = $this->createSystemJob(
                name: 'Send User Password Reset Email',
                type: 'email.user-password-reset',
                parameters: [
                    'userId' => $this->user->id,
                    'userName' => $this->user->name,
                    'userEmail' => $this->user->email,
                    'temporaryPassword' => $this->temporaryPassword
                ],
                message: 'Sending User Password Reset Email starting...'
            );

            Mail::to($this->user->email)
                ->send(new UserPasswordResetMail(
                   systemJobId: $this->jobId,
                   user: $this->user,
                   temporaryPassword: $this->temporaryPassword
                ));

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(UserPasswordResetJob::class . '::handle(): ' . $e->getMessage());

            $this->updateSystemJob($this->jobId, [
                'status' => 'failed',
                'completed_at' => now(),
                'error' => $e->getMessage()
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

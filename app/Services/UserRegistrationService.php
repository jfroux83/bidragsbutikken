<?php

namespace App\Services;

use App\Jobs\UserRegistrationJob;
use App\Models\CustomerUser;
use App\Models\OrganizationUser;
use App\Models\Profile;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\VendorUser;
use DateTime;
use Illuminate\Support\Str;

class UserRegistrationService
{
    /**
     * Password configuration
     */
    private const MIN_LENGTH = 12;
    private const INCLUDE_UPPERCASE = true;
    private const INCLUDE_NUMBERS = true;
    private const INCLUDE_SYMBOLS = true;

    public function userRegistration(string $type, int $registerId, string $email): bool
    {
        // Check if user with this email already exists
        if (User::where('email', $email)->exists()) {
            return false;
        }

        $tempPassword = $this->generateTempPassword();
        $token = $this->generateToken();

        $user = User::create([
            'name' => Str::ucfirst($type) . ' ' . $registerId,
            'email' => $email,
            'password' => $tempPassword,
            'locale' => 'en',
            'password_change_required' => true,
            'password_reset_token' => $token,
            'password_reset_token_expiry' => $this->getTokenExpiry(),
        ]);

        $profileId = Profile::where('name', $type)->first()->id;

        UserProfile::create([
            'user_id' => $user->id,
            'profile_id' => $profileId,
        ]);

        switch ($type) {
            case 'organization':
                OrganizationUser::create([
                    'organization_id' => $registerId,
                    'user_id' => $user->id,
                ]);
                break;
            case 'vendor':
                VendorUser::create([
                    'vendor_id' => $registerId,
                    'user_id' => $user->id,
                ]);
                break;
            case 'customer':
                CustomerUser::create([
                    'customer_id' => $registerId,
                    'user_id' => $user->id,
                ]);
                break;
        }

        dispatch(new UserRegistrationJob($user, $tempPassword, $token));

        return true;
    }

    /**
     * Generate a secure temporary password
     */
    public function generateTempPassword(): string
    {
        $length = self::MIN_LENGTH;
        $uppercase = self::INCLUDE_UPPERCASE;
        $numbers = self::INCLUDE_NUMBERS;
        $symbols = self::INCLUDE_SYMBOLS;

        // Define character sets
        $lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        $uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $numberChars = '0123456789';
        $symbolChars = '!@#$%^&*()_-+=<>?';

        // Initialize password with required character types
        $password = [
            Str::random(1),  // At least one lowercase
        ];

        if ($uppercase) {
            $password[] = substr(str_shuffle($uppercaseChars), 0, 1);
        }

        if ($numbers) {
            $password[] = substr(str_shuffle($numberChars), 0, 1);
        }

        if ($symbols) {
            $password[] = substr(str_shuffle($symbolChars), 0, 1);
        }

        // Calculate remaining length needed
        $remainingLength = $length - count($password);

        // Build character pool based on requirements
        $charPool = $lowercaseChars;
        if ($uppercase) $charPool .= $uppercaseChars;
        if ($numbers) $charPool .= $numberChars;
        if ($symbols) $charPool .= $symbolChars;

        // Add remaining random characters
        $password[] = substr(str_shuffle($charPool), 0, $remainingLength);

        // Shuffle all parts and combine
        shuffle($password);
        return implode('', $password);
    }

    /**
     * Generate a secure reset token
     */
    public function generateToken(): string
    {
        return Str::random(64);
    }

    /**
     * Get token expiration timestamp
     */
    public function getTokenExpiry(): DateTime
    {
        return now()->addHours(48);
    }
}

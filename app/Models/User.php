<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @method static create(array $array)
 * @method static whereIn(string $string, $orgUsers)
 * @method static find(mixed $userId)
 * @method static where(string $string, array|string|null $email)
 * @property mixed $password_reset_token_expiry
 * @property mixed $password_change_required
 * @property mixed $password_reset_token
 * @property mixed $email
 * @property mixed $id
 * @property mixed $name
 * @property mixed|string $password
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'status',
        'name',
        'email',
        'password',
        'locale',
        'password_change_required',
        'password_reset_token',
        'password_reset_token_expiry'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'password_change_required' => 'boolean',
            'status' => 'boolean',
            'password_reset_token_expiry' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function profile(): BelongsToMany
    {
        return $this->belongsToMany(Profile::class, 'user_profiles', 'user_id', 'profile_id');
    }


    /*
     * Methods
     */

    // Add a helper method to check if password reset token is expired
    public function isPasswordResetTokenExpired(): bool
    {
        if (!$this->password_reset_token_expiry) {
            return true;
        }

        return $this->password_reset_token_expiry->isPast();
    }

    // Add a helper method to check if user needs to change password
    public function requiresPasswordChange(): bool
    {
        return $this->password_change_required;
    }

    // Add a helper method to clear password reset data
    public function clearPasswordResetData(): void
    {
        $this->update([
            'password_reset_token' => null,
            'password_reset_token_expiry' => null,
            'password_change_required' => false,
        ]);
    }
}

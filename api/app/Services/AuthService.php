<?php

namespace App\Services;

use App\Constants\TokenAbility;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthService
{
    public function generateSessionId(): string
    {
        return Str::uuid()->toString();
    }

    /**
     * @return array{
     *     accessToken: string,
     *     accessTokenExpirationDate: date,
     *     refreshToken: string,
     *     refreshTokenExpirationDate: date,
     * }
     */
    public function generateToken(User $user, string $sessionId): array
    {
        $atExpireTime = now()->addMinutes(config('sanctum.expiration'));
        $rtExpireTime = now()->addMinutes(config('sanctum.rt_expiration'));

        $accessToken = $user->createToken("access_token_{$sessionId}", [TokenAbility::ACCESS_API], $atExpireTime);
        $refreshToken = $user->createToken("refresh_token_{$sessionId}", [TokenAbility::ISSUE_ACCESS_TOKEN], $rtExpireTime);

        return [
            'accessToken' => $accessToken->plainTextToken,
            'accessTokenExpirationDate' => $atExpireTime,
            'refreshToken' => $refreshToken->plainTextToken,
            'refreshTokenExpirationDate' => $rtExpireTime,
        ];
    }

    public function revokeToken(User $user, string $sessionId)
    {
        $user->tokens()
            ->where('name', "access_token_{$sessionId}")
            ->orWhere('name', "refresh_token_{$sessionId}")
            ->delete();
    }

    public function sendResetPasswordLink($email): string
    {
        return Password::sendResetLink([
            'email' => $email
        ]);
    }

    public function doPasswordReset($userData)
    {
        return Password::reset(
            $userData,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ]);
                $user->save();
                event(new PasswordReset($user));
            }
        );
    }
}

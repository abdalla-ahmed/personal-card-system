<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\AuthService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends ApiController
{
    public function __construct(
        private readonly AuthService $authService,
        private readonly UserService $userService
    ) {}

    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $user = $this->userService->createUser($data);

        $sessionId = $this->authService->generateSessionId();
        $token = $this->authService->generateToken($user, $sessionId);
        $userWithAccessTokenAndPermissions = $this->userService->mapUserWithAccessTokenAndPermissions($user, $token);

        return $this->resSuccess($userWithAccessTokenAndPermissions)
            ->withHeaders([
                'X-Session-ID' => $token
            ]);
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        $user = User::where('username', $data['username'])->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->resError('The provided credentials are incorrect');
        }

        $sessionId = $this->authService->generateSessionId();
        $token = $this->authService->generateToken($user, $sessionId);
        $userWithAccessTokenAndPermissions = $this->userService->mapUserWithAccessTokenAndPermissions($user, $token);

        return $this->resSuccess($userWithAccessTokenAndPermissions)
            ->withHeaders([
                'X-Session-ID' => $sessionId
            ]);
    }

    public function logout(Request $request)
    {
        // retrieve session id from request header
        $sessionId = $request->header('X-Session-ID');
        if (!$sessionId) {
            return $this->resNoContent();
        }

        // currently authenticated user
        $user = $request->user();
        $this->authService->revokeToken($user, $sessionId);

        return $this->resNoContent();
    }

    public function refreshToken(Request $request)
    {
        $sessionId = $request->header('X-Session-ID');
        if (!$sessionId) {
            return $this->resError('Invalid session');
        }

        $user = $request->user();
        $this->authService->revokeToken($user, $sessionId);
        $token = $this->authService->generateToken($user, $sessionId);
        $userWithAccessTokenAndPermissions = $this->userService->mapUserWithAccessTokenAndPermissions($user, $token);

        return $this->resSuccess($userWithAccessTokenAndPermissions)
            ->withHeaders([
                'X-Session-ID' => $sessionId
            ]);
    }
}

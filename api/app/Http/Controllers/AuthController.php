<?php

namespace App\Http\Controllers;

use App\Constants\ActivityAction;
use App\Constants\ModuleID;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\Activity;
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
    )
    {
    }

    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $user = $this->userService->createUser($data['username'], $data['email'], $data['password']);

        $sessionId = $this->authService->generateSessionId();
        $token = $this->authService->generateToken($user, $sessionId);
        $userWithAccessTokenAndPermissions = $this->userService->mapUserWithAccessTokenAndPermissions($user, $token);

        Auth::setUser($user);

        Activity::Log(ModuleID::Users, ActivityAction::USER_SIGNUP, $user);
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

        Auth::setUser($user);

        Activity::Log(ModuleID::Users, ActivityAction::USER_LOGIN, $user);
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
        if (!is_null($user)) {
            $this->authService->revokeToken($user, $sessionId);
        }

        Activity::Log(ModuleID::Users, ActivityAction::USER_LOGOUT, $user);
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

        Activity::Log(ModuleID::Users, ActivityAction::USER_TOKEN_REFRESH, $user);
        return $this->resSuccess($userWithAccessTokenAndPermissions)
            ->withHeaders([
                'X-Session-ID' => $sessionId
            ]);
    }
}

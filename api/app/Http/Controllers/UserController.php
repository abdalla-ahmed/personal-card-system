<?php

namespace App\Http\Controllers;

use App\Constants\ActivityAction;
use App\Constants\ModuleExtraPermission;
use App\Constants\ModuleID;
use App\Constants\UserSecurityLevel;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\UpdateUserProfileRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\Role;
use App\Models\User;
use App\Models\UserModule;
use App\Models\UserModulePermission;
use App\Models\UserRole;
use App\Services\Activity;
use App\Services\Permission;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends ApiController
{
    public function __construct(
        private readonly UserService $userService
    )
    {
    }

    public function index()
    {
        $users = User::orderBy('id', 'asc')->get();

        $userRoles = UserRole::leftJoin('role', 'role.id', '=', 'role_id')
            ->select('role_id as id', 'user_id as userId', 'role.name as name')
            ->orderBy('user_id', 'asc')
            ->orderBy('role_id', 'asc')
            ->get();

        $mappedUsers = $users->map(function ($u) use ($userRoles) {
            return [
                'id' => $u->id,
                'username' => $u->username,
                'email' => $u->email,
                'securityLevel' => $u->security_level,
                'roles' => $userRoles->filter(fn($r) => $r->userId === $u->id)->values(),
            ];
        });

        return $this->resSuccess($mappedUsers);
    }

    public function show(User $user)
    {
        if (Auth::user()->security_level < $user->security_level) {
            return $this->resUnauthorized();
        }

        $mappedUser = $this->userService->mapUserWithRoles($user);

        return $this->resSuccess($mappedUser);
    }

    public function store(CreateUserRequest $request)
    {
        $currentUser = $request->user();
        $data = $request->validated();

        if ($data['securityLevel'] != UserSecurityLevel::L1
            && !Permission::checkModuleExtraPermission($currentUser,
                ModuleExtraPermission::Change_security_level)) {
            return $this->resUnauthorized("You don't have the necessary permissions to change user's security level");
        }

        $isOnlyUserRole = $data['roles'] == [2];
        if (!$isOnlyUserRole
            && !Permission::checkModuleExtraPermission($currentUser,
                ModuleExtraPermission::Assign_roles)) {
            return $this->resUnauthorized("You don't have the necessary permissions to change user's roles");
        }

        if (User::where('username', $data['username'])->exists()) {
            return $this->resError('Username has been already taken');
        }

        if (User::where('email', $data['email'])->exists()) {
            return $this->resError('Email address belongs to another user');
        }

        $user = $this->userService->createUser(
            $data['username'],
            $data['email'],
            $data['password'],
            $data['securityLevel'] ?? UserSecurityLevel::L1,
            $data['roles'],
        );

        if (is_null($user)) {
            return $this->resError('Failed to create user');
        }

        Activity::Log(ModuleID::Users, ActivityAction::CREATE, $user);
        return $this->resNoContent();
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $currentUser = $request->user();
        $data = $request->validated();

        if ($currentUser->security_level < $user->security_level) {
            return $this->resUnauthorized();
        }

        if ($data['securityLevel'] != $user->security_level
            && !Permission::checkModuleExtraPermission($currentUser,
                ModuleExtraPermission::Change_security_level)) {
            return $this->resUnauthorized("You don't have the necessary permissions to change user's security level");
        }

        $currentUserRoles = UserRole::where('user_id', $user->id)
            ->select('role_id')->get()
            ->map(fn($r) => $r->role_id);

        $isRolesChanged = collect($data['roles'])->sort()->values() != $currentUserRoles->sort()->values();
        if ($isRolesChanged && !Permission::checkModuleExtraPermission($currentUser,
                ModuleExtraPermission::Assign_roles)) {
            return $this->resUnauthorized("You don't have the necessary permissions to change user's roles");
        }


        $data['username'] = strtolower($data['username']);
        $data['email'] = strtolower($data['email']);

        if (User::where('id', '!=', $user->id)->where('username', $data['username'])->exists()) {
            return $this->resError('Username has been already taken');
        }

        if (User::where('id', '!=', $user->id)->where('email', $data['email'])->exists()) {
            return $this->resError('Email address belongs to another user');
        }

        $userRoles = collect($data['roles'])->map(function ($roleId) use ($user) {
            return [
                'user_id' => $user->id,
                'role_id' => $roleId,
            ];
        });

        if ($userRoles->isEmpty()) {
            return $this->resError('One role at least is required');
        }

        if ($user->isSuperAdmin()) {
            if ($data['username'] !== $user->username) {
                return $this->resError('The default admin user cannot change the username');
            }
            if (!$userRoles->contains('role_id', 1)) {
                return $this->resError('The default admin user must have the admin role');
            }
        }

        $userUpdateRecord = [
            'username' => $data['username'],
            'email' => $data['email'],
            'security_level' => $data['securityLevel'],
        ];

        if (!empty($data['password'])) {
            $userUpdateRecord['password'] = $data['password'];
        }

        // update user
        if (!$user->update($userUpdateRecord)) {
            return $this->resError('Failed to update user');
        }

        // update user roles
        UserRole::where('user_id', $user->id)->delete();
        UserRole::insert($userRoles->toArray());

        Activity::Log(ModuleID::Users, ActivityAction::UPDATE, $user);
        return $this->resNoContent();
    }

    public function destroy(User $user)
    {
        if (Auth::user()->security_level < $user->security_level) {
            return $this->resUnauthorized();
        }

        if ($user->username === 'admin') {
            return $this->resError('The default admin user cannot be deleted');
        }

        if (!$user->delete()) {
            return $this->resError('Failed to delete user');
        }

        Activity::Log(ModuleID::Users, ActivityAction::DELETE, $user);
        return $this->resNoContent();
    }

    public function permissions(User $user)
    {
        if (Auth::user()->security_level < $user->security_level) {
            return $this->resUnauthorized();
        }

        $userPermissions = $this->userService->mapUserPermissions($user);

        return $this->resSuccess($userPermissions);
    }

    public function updatePermissions(Request $request, User $user)
    {
        if (Auth::user()->security_level < $user->security_level) {
            return $this->resUnauthorized();
        }

        $data = $request->all();

        if (!isset($data['permissions'])) {
            return $this->resError();
        }

        $permissions = array();
        foreach ($data['permissions'] as $permission) {
            $permissions[] = [
                'user_id' => $user->id,
                'module_id' => $permission['id'],
                'allow_view' => $permission['allowView'],
                'allow_create' => $permission['allowCreate'],
                'allow_update' => $permission['allowUpdate'],
                'allow_delete' => $permission['allowDelete'],
            ];
        }

        $userModulePermissions = array();
        foreach ($data['permissions'] as $permission) {
            foreach ($permission['extraPermissions'] as $extraPermissionId) {
                $userModulePermissions[] = [
                    'user_id' => $user->id,
                    'module_id' => $permission['id'],
                    'module_permission_id' => $extraPermissionId,
                ];
            }
        }

        // update user module permissions
        UserModule::where('user_id', $user->id)->delete();
        UserModule::insert($permissions);

        // update user module extra permissions
        UserModulePermission::where('user_id', $user->id)->delete();
        UserModulePermission::insert($userModulePermissions);

        Activity::Log(ModuleID::Users, ActivityAction::USER_PERMISSIONS_UPDATE, $user);
        return $this->resNoContent();
    }

    public function profile(Request $request)
    {
        $userProfile = $this->userService->mapUserProfile($request->user());
        return $this->resSuccess($userProfile);
    }

    public function updateProfile(UpdateUserProfileRequest $request)
    {
        $data = $request->validated();
        $currentUser = $request->user();

        if (isset($data[$currentUser->getKeyName()]))
            unset($data[$currentUser->getKeyName()]);

        $data['username'] = strtolower($data['username']);
        $data['email'] = strtolower($data['email']);

        if (User::where('id', '!=', $currentUser->id)->where('username', $data['username'])->exists()) {
            return $this->resError('Username has been already taken');
        }

        if (User::where('id', '!=', $currentUser->id)->where('email', $data['email'])->exists()) {
            return $this->resError('Email address belongs to another user');
        }

        if ($currentUser->isSuperAdmin()) {
            if ($data['username'] !== $currentUser->username) {
                return $this->resError('The default admin user cannot change the username');
            }
        }

        $userUpdateRecord = [
            'username' => $data['username'],
            'email' => $data['email'],
        ];

        if (!empty($data['password'])) {
            $userUpdateRecord['password'] = $data['password'];
        }

        if (!$currentUser->update($userUpdateRecord)) {
            return $this->resError('Failed to update user profile');
        }

        Activity::Log(ModuleID::Users, ActivityAction::USER_PROFILE_UPDATE, $currentUser);
        return $this->resNoContent();
    }
}

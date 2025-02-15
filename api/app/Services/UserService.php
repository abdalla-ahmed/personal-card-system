<?php

namespace App\Services;

use App\Constants\ModuleID;
use App\Constants\UserSecurityLevel;
use App\Models\Module;
use App\Models\ModulePermission;
use App\Models\RoleModule;
use App\Models\RoleModulePermission;
use App\Models\User;
use App\Models\UserModule;
use App\Models\UserModulePermission;
use App\Models\UserRole;

class UserService
{
    public function createUser($username, $email, $password, $securityLevel = UserSecurityLevel::L1, $roles = null): User
    {
        $username = strtolower($username);
        $email = strtolower($email);

        if (empty($roles)) {
            $roles = [2]; // normal user
        }

        $user = User::create([
            'username' => $username,
            'email' => $email,
            'password' => $password,
            'security_level' => $securityLevel,
        ]);

        $userRoles = collect($roles)->map(function ($roleId) use ($user) {
            return [
                'user_id' => $user->id,
                'role_id' => $roleId,
            ];
        });

        UserRole::insert($userRoles->toArray());

        $userModules = Module::all()->map(function ($module) use ($user) {
            return [
                'user_id' => $user->id,
                'module_id' => $module->id,
                'allow_view' => false,
                'allow_create' => false,
                'allow_update' => false,
                'allow_delete' => false,
            ];
        });

        UserModule::insert($userModules->toArray());

        return $user;
    }

    public function mapUserWithRoles(User $user)
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'securityLevel' => $user->security_level,
            'roles' => $user->roles->map(fn($x) => $x->role_id)->values(),
        ];
    }

    public function mapUserWithAccessTokenAndPermissions(User $user, array $token): array
    {
        $modules = Module::select('id')->orderBy('id')->get()->map(fn($x) => $x->id)->values();

        $userRoleIdList = UserRole::where('user_id', $user->id)->select('role_id')->get()->map(fn($x) => $x->role_id)->values();

        $roleModules = RoleModule::whereIn('role_id', $userRoleIdList)->get();
        $roleModulePermissions = RoleModulePermission::whereIn('role_id', $userRoleIdList)->get();

        $userModules = UserModule::where('user_id', $user->id)->get();
        $userModulePermissions = UserModulePermission::where('user_id', $user->id)->get();


        $permissions = array();

        foreach ($modules as $moduleId) {
            $roleModule = $roleModules->filter(fn($x) => $x->module_id === $moduleId);
            $roleModulePermission = $roleModulePermissions->filter(fn($x) => $x->module_id === $moduleId)
                ->map(fn($x) => $x->module_permission_id)->values();

            $userModule = $userModules->filter(fn($x) => $x->module_id === $moduleId)->first();
            $userModulePermission = $userModulePermissions->filter(fn($x) => $x->module_id === $moduleId)
                ->map(fn($x) => $x->module_permission_id)->values();

            $extraPermissions = collect($roleModulePermission);
            $extraPermissions = $extraPermissions->merge($userModulePermission);

            $permissions[] = [
                'moduleId' => $moduleId,
                'allowView' => $userModule->allow_view || !!$roleModule->first(fn($x) => $x->allow_view),
                'allowCreate' => $userModule->allow_create || !!$roleModule->first(fn($x) => $x->allow_create),
                'allowUpdate' => $userModule->allow_update || !!$roleModule->first(fn($x) => $x->allow_update),
                'allowDelete' => $userModule->allow_delete || !!$roleModule->first(fn($x) => $x->allow_delete),
                'extraPermissions' => $extraPermissions,
            ];
        }

        return [
            'userId' => $user->id,
            'username' => $user->username,
            'securityLevel' => $user->security_level,
            'roles' => $userRoleIdList,
            'permissions' => $permissions,
            'token' => $token,
        ];
    }

    public function mapUserPermissions(User $user): array
    {
        $modules = Module::all();
        $modulePermissions = ModulePermission::all();

        $userModules = UserModule::where('user_id', $user->id)->get();
        $userModulePermissions = UserModulePermission::where('user_id', $user->id)->get();

        $permissions = $modules->map(function ($module) use ($userModules, $modulePermissions, $userModulePermissions) {
            $userModule = $userModules->filter(fn($x) => $x->module_id === $module->id)->first();
            $currentModulePermissions = $modulePermissions->filter(fn($x) => $x->module_id === $module->id);
            $userCurrentModulePermissions = $userModulePermissions->filter(fn($x) => $x->module_id === $module->id);
            return [
                'id' => $module->id,
                'name' => $module->name,
                'category' => $module->category,
                'allowView' => $userModule->allow_view,
                'allowCreate' => $userModule->allow_create,
                'allowUpdate' => $userModule->allow_update,
                'allowDelete' => $userModule->allow_delete,
                'extraPermissions' => $currentModulePermissions->map(function ($mp) use ($userCurrentModulePermissions) {
                    return [
                        'id' => $mp->id,
                        'description' => $mp->description,
                        'allowed' => !!$userCurrentModulePermissions->where('module_permission_id', $mp->id)->first(),
                    ];
                })->values()
            ];
        })->values();

        return [
            'userId' => $user->id,
            'permissions' => $permissions,
        ];
    }

    public function mapUserProfile(User $user): array
    {
        return [
            'username' => $user->username,
            'email' => $user->email,
        ];
    }
}

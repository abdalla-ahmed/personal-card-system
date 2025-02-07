<?php

namespace App\Services;

use App\Constants\ModuleAction;
use App\Constants\ModuleExtraPermission;
use App\Models\RoleModule;
use App\Models\UserModulePermission;
use App\Models\RoleModulePermission;
use App\Models\UserRole;
use App\Models\User;
use App\Models\UserModule;

class PermissionService
{

    /**
    *  use ModuleAction enum for $action
    */
    public static function checkModulePermission(User $user, string $action, int $moduleId): bool
    {
        // The default admin user can do anything,
        // regardless of the actual permissions assigned.
        if ($user->isSuperAdmin()) {
            return true;
        }

        $userHasPermission = UserModule::where('module_id', $moduleId)
            ->where('user_id', $user->id)
            ->where($action, true)
            ->exists();
        if ($userHasPermission)
            return true;

        $userRoleIdList = $user->roles->select('role_id')->values();
        $userRoleHasPermission = RoleModule::where('module_id', $moduleId)
            ->whereIn('role_id', $userRoleIdList)
            ->where($action, true)
            ->exists();
        if ($userRoleHasPermission)
            return true;

        return false;
    }

    /**
    *  use ModuleExtraPermission enum for $extraPermissionId
    */
    public static function checkModuleExtraPermission(User $user, int $extraPermissionId): bool
    {
        // As you may notice, the default admin user cannot bypass a module's extra permissions.

        $userModulePermissions = UserModulePermission::where('module_permission_id', $extraPermissionId)
            ->where('user_id', $user->id)
            ->exists();
        if ($userModulePermissions)
            return true;

        $userRoleIdList = UserRole::where('user_id', $user->id)->select('role_id')->get()->map(fn($x) => $x->role_id)->values();
        $roleModulePermissions = RoleModulePermission::where('module_permission_id', $extraPermissionId)
            ->whereIn('role_id', $userRoleIdList)
            ->exists();
        if ($roleModulePermissions)
            return true;

        return false;
    }
}

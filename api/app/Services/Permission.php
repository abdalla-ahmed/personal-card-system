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

class Permission
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

        $userHasModulePermission = UserModule::where('module_id', $moduleId)
            ->where('user_id', $user->id)
            ->where($action, true)
            ->exists();
        if ($userHasModulePermission)
            return true;

        $userRolesIdList = $user->roles->select('role_id')->values();
        $anyUserRoleHasModulePermission = RoleModule::where('module_id', $moduleId)
            ->whereIn('role_id', $userRolesIdList)
            ->where($action, true)
            ->exists();
        if ($anyUserRoleHasModulePermission)
            return true;

        return false;
    }

    /**
    *  use ModuleExtraPermission enum for $extraPermissionId
    */
    public static function checkModuleExtraPermission(User $user, int $extraPermissionId): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        $userHasModuleExtraPermission = UserModulePermission::where('module_permission_id', $extraPermissionId)
            ->where('user_id', $user->id)
            ->exists();
        if ($userHasModuleExtraPermission)
            return true;

        $userRolesIdList = UserRole::where('user_id', $user->id)->select('role_id')->get()->map(fn($x) => $x->role_id)->values();
        $anyUserRoleHasModuleExtraPermission = RoleModulePermission::where('module_permission_id', $extraPermissionId)
            ->whereIn('role_id', $userRolesIdList)
            ->exists();
        if ($anyUserRoleHasModuleExtraPermission)
            return true;

        return false;
    }
}

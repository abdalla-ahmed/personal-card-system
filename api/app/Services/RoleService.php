<?php

namespace App\Services;

use App\Models\Module;
use App\Models\ModulePermission;
use App\Models\Role;
use App\Models\RoleModule;
use App\Models\RoleModulePermission;

class RoleService
{
    public function createRole($data): Role
    {
        $role = Role::create($data);

        $roleModules = Module::all()->map(function ($module) use ($role) {
            return [
                'role_id' => $role->id,
                'module_id' => $module->id,
                'allow_view' => false,
                'allow_create' => false,
                'allow_update' => false,
                'allow_delete' => false,
            ];
        });

        RoleModule::insert($roleModules->toArray());

        return $role;
    }

    public function mapRoleWithPermissions(Role $role): array
    {
        $modules = Module::all();
        $modulePermissions = ModulePermission::all();

        $roleModules = RoleModule::where('role_id', $role->id)->get();
        $roleModulePermissions = RoleModulePermission::where('role_id', $role->id)->get();

        $permissions = $modules->map(function ($module) use ($roleModules, $modulePermissions, $roleModulePermissions) {
            $roleModule = $roleModules->filter(fn($x) => $x->module_id === $module->id)->first();
            $currentModulePermissions = $modulePermissions->filter(fn($x) => $x->module_id === $module->id);
            $roleCurrentModulePermissions = $roleModulePermissions->filter(fn($x) => $x->module_id === $module->id);
            return [
                'id' => $module->id,
                'name' => $module->name,
                'category' => $module->category,
                'allowView' => $roleModule->allow_view,
                'allowCreate' => $roleModule->allow_create,
                'allowUpdate' => $roleModule->allow_update,
                'allowDelete' => $roleModule->allow_delete,
                'extraPermissions' => $currentModulePermissions->map(function ($mp) use ($roleCurrentModulePermissions) {
                    return [
                        'id' => $mp->id,
                        'description' => $mp->description,
                        'allowed' => !!$roleCurrentModulePermissions->where('module_permission_id', $mp->id)->first(),
                    ];
                })->values()
            ];
        })->values();

        return [
            'id' => $role->id,
            'name' => $role->name,
            'static' => $role->static,
            'permissions' => $permissions,
        ];
    }
}

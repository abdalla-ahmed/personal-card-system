<?php

namespace App\Http\Controllers;

use App\Constants\ActivityAction;
use App\Constants\ModuleID;
use App\Http\Requests\Role\CreateRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Models\Role;
use App\Models\RoleModule;
use App\Models\RoleModulePermission;
use App\Models\UserRole;
use App\Services\RoleService;
use App\Services\Activity;
use Illuminate\Http\Request;

class RoleController extends ApiController
{
    public function __construct(
        private readonly RoleService $roleService
    )
    {
    }

    public function index()
    {
        $roles = Role::select('id', 'name', 'static')->orderBy('id', 'asc')->get()->values();
        return $this->resSuccess($roles);
    }

    public function store(CreateRoleRequest $request)
    {
        $data = $request->validated();

        if (Role::where('name', $data['name'])->exists()) {
            return $this->resError('There\'s a role with the same name already exists');
        }

        $role = Role::create($data);

        $permissions = array();
        foreach ($data['permissions'] as $permission) {
            $permissions[] = [
                'role_id' => $role->id,
                'module_id' => $permission['id'],
                'allow_view' => $permission['allowView'],
                'allow_create' => $permission['allowCreate'],
                'allow_update' => $permission['allowUpdate'],
                'allow_delete' => $permission['allowDelete'],
            ];
        }

        $roleModulePermissions = array();
        foreach ($data['permissions'] as $permission) {
            foreach ($permission['extraPermissions'] as $extraPermissionId) {
                $roleModulePermissions[] = [
                    'role_id' => $role->id,
                    'module_id' => $permission['id'],
                    'module_permission_id' => $extraPermissionId,
                ];
            }
        }

        // create role module permissions
        RoleModule::insert($permissions);

        // create role module extra permissions
        RoleModulePermission::insert($roleModulePermissions);

        Activity::Log(ModuleID::Roles, ActivityAction::CREATE, $role);
        return $this->resNoContent();
    }

    public function show(Role $role)
    {
        $mappedRole = $this->roleService->mapRoleWithPermissions($role);

        return $this->resSuccess($mappedRole);
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        $data = $request->validated();

        if (!$role->update($data)) {
            return $this->resError('Failed to update role');
        }

        $permissions = array();
        foreach ($data['permissions'] as $permission) {
            $permissions[] = [
                'role_id' => $role->id,
                'module_id' => $permission['id'],
                'allow_view' => $permission['allowView'],
                'allow_create' => $permission['allowCreate'],
                'allow_update' => $permission['allowUpdate'],
                'allow_delete' => $permission['allowDelete'],
            ];
        }

        $roleModulePermissions = array();
        foreach ($data['permissions'] as $permission) {
            foreach ($permission['extraPermissions'] as $extraPermissionId) {
                $roleModulePermissions[] = [
                    'role_id' => $role->id,
                    'module_id' => $permission['id'],
                    'module_permission_id' => $extraPermissionId,
                ];
            }
        }

        // update role module permissions
        RoleModule::where('role_id', $role->id)->delete();
        RoleModule::insert($permissions);

        // update role module extra permissions
        RoleModulePermission::where('role_id', $role->id)->delete();
        RoleModulePermission::insert($roleModulePermissions);

        Activity::Log(ModuleID::Roles, ActivityAction::UPDATE, $role);
        return $this->resNoContent();
    }

    public function destroy(Role $role)
    {
        if ($role->static) {
            return $this->resError('Static roles cannot be deleted');
        }

        if (UserRole::where('role_id', $role->id)->exists()) {
            return $this->resError('The role is currently related to users and cannot be deleted');
        }

        if (!$role->delete()) {
            return $this->resError('Failed to delete role');
        }

        Activity::Log(ModuleID::Roles, ActivityAction::DELETE, $role);
        return $this->resNoContent();
    }
}

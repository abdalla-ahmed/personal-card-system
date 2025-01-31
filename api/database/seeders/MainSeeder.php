<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\ModulePermission;
use App\Models\Role;
use App\Models\RoleModule;
use App\Models\RoleModulePermission;
use App\Models\User;
use App\Models\UserModule;
use App\Models\UserModulePermission;
use App\Models\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MainSeeder extends Seeder
{
    private $roles = [
        ['id' => 1, 'name' => 'Admin', 'static' => true],
        ['id' => 2, 'name' => 'User', 'static' => true],
    ];

    private $modules = [
        ['id' => 1, 'name' => 'Logs', 'category' => 'Administration'],
        ['id' => 2, 'name' => 'Roles', 'category' => 'Administration'],
        ['id' => 3, 'name' => 'Users', 'category' => 'Administration'],
        ['id' => 4, 'name' => 'Cards', 'category' => 'Main'],
    ];

    private $modulePermissions = [
        ['id' => 1, 'module_id' => 3, 'description' => 'Can view and update user permissions'],
    ];


    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::insert($this->roles);
        Module::insert($this->modules);
        ModulePermission::insert($this->modulePermissions);

        $user = User::create([
            'username' => 'admin',
            'email' => 'admin@what.ever',
            'password' => 'admin'
        ]);

        UserRole::create([
            'user_id' => $user->id,
            'role_id' => 1, // admin
        ]);

        $userModules = Module::all()->map(function ($module) use ($user) {
            return [
                'user_id' => $user->id,
                'module_id' => $module->id,
                'allow_view' => true,
                'allow_create' => true,
                'allow_update' => true,
                'allow_delete' => true,
            ];
        });

        $userModulePermission = ModulePermission::all()->map(function ($modulePermission) use ($user) {
            return [
                'user_id' => $user->id,
                'module_id' => $modulePermission->module_id,
                'module_permission_id' => $modulePermission->id,
            ];
        });

        UserModule::insert($userModules->toArray());
        UserModulePermission::insert($userModulePermission->toArray());

        // populate permissions for the default roles.
        // interactions with the database inside a loop is not for production but this is just a seeder script.
        foreach ($this->roles as $role) {
            $isAdmin = $role['id'] === 1;

            $roleModules = Module::all()->map(function ($module) use ($role, $isAdmin) {
                return [
                    'role_id' => $role['id'],
                    'module_id' => $module->id,
                    'allow_view' => $isAdmin,
                    'allow_create' => $isAdmin,
                    'allow_update' => $isAdmin,
                    'allow_delete' => $isAdmin,
                ];
            });

            if ($isAdmin) {
                $roleModulePermission = ModulePermission::all()->map(function ($modulePermission) use ($role) {
                    return [
                        'role_id' => $role['id'],
                        'module_id' => $modulePermission->module_id,
                        'module_permission_id' => $modulePermission->id,
                    ];
                });
            }

            RoleModule::insert($roleModules->toArray());
            RoleModulePermission::insert($roleModulePermission->toArray());
        }

        $this->command->info('MainSeeder completed.');
    }
}

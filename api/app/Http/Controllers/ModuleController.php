<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\ModulePermission;
use App\Services\UserService;
use Illuminate\Http\Request;

class ModuleController extends ApiController
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    public function index()
    {
        $modulePermissions = ModulePermission::all();
        $mappedModules = Module::all()->map(function ($module) use ($modulePermissions) {
            $currentModulePermissions = $modulePermissions->filter(fn($x) => $x->module_id === $module->id);
            return [
                'id' => $module->id,
                'name' => $module->name,
                'category' => $module->category,
                'allowView' => false,
                'allowCreate' => false,
                'allowUpdate' => false,
                'allowDelete' => false,
                'extraPermissions' => $currentModulePermissions->map(function ($mp) {
                    return [
                        'id' => $mp->id,
                        'description' => $mp->description,
                        'allowed' => false,
                    ];
                })->values()
            ];
        })->values();

        return $this->resSuccess($mappedModules);
    }
}

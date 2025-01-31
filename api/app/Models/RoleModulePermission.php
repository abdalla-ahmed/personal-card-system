<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleModulePermission extends Model
{
    protected $table = 'role_module_permission';
    protected $fillable = ['role_id', 'module_id', 'module_permission_id'];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function modulePermission()
    {
        return $this->belongsTo(ModulePermission::class);
    }
}

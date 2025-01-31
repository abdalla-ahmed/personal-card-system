<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserModulePermission extends Model
{
    protected $table = 'user_module_permission';
    protected $fillable = ['user_id', 'module_id', 'module_permission_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $table = 'module';
    protected $fillable = ['name', 'category'];

    public function modulePermissions()
    {
        return $this->hasMany(ModulePermission::class);
    }

    public function userModules()
    {
        return $this->hasMany(UserModule::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModulePermission extends Model
{
    protected $table = 'module_permission';
    protected $fillable = ['description'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}

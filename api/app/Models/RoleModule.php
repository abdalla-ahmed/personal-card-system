<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleModule extends Model
{
    protected $table = 'role_module';
    protected $fillable = ['role_id', 'module_id', 'allow_view', 'allow_create', 'allow_update', 'allow_delete'];

    protected function casts(): array
    {
        return [
            'allow_view' => 'bool',
            'allow_create' => 'bool',
            'allow_update' => 'bool',
            'allow_delete' => 'bool',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}

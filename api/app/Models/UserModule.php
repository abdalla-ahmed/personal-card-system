<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserModule extends Model
{
    protected $table = 'user_module';
    protected $fillable = ['user_id', 'module_id', 'allow_view', 'allow_create', 'allow_update', 'allow_delete'];

    protected function casts(): array
    {
        return [
            'allow_view' => 'bool',
            'allow_create' => 'bool',
            'allow_update' => 'bool',
            'allow_delete' => 'bool',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}

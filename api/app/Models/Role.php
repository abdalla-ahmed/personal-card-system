<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'role';
    protected $fillable = ['name'];

    protected function casts(): array
    {
        return [
            'static' => 'bool'
        ];
    }

    public function userRoles()
    {
        return $this->hasMany(UserRole::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $table = 'card';
    protected $fillable = [
        'full_name',
        'position',
        'telephone',
        'mobile',
        'email',
        'address',
        'company_name',
        'company_address',
        'logo_file_name'
    ];

    protected function casts(): array
    {
        return [
            'active' => 'bool'
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

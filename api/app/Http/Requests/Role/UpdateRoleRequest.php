<?php

namespace App\Http\Requests\Role;

use App\Http\Requests\ApiRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class UpdateRoleRequest extends ApiRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' =>           'required|string',
            'permissions' =>    'required|array',
        ];
    }
}

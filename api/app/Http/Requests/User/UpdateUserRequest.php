<?php

namespace App\Http\Requests\User;

use App\Http\Requests\ApiRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class UpdateUserRequest extends ApiRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'username' =>   'required|string|min:2|max:255',
            'email' =>      'required|string|email|max:255',
            'password' =>   'nullable|string|min:4|max:50',
            'roles' =>      'required|array',
            'roles.*' =>    'integer',
            'securityLevel' =>  'required|integer',
        ];
    }
}

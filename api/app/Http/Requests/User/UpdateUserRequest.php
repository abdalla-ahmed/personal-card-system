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
            'username' =>   'required|alpha_dash|min:2|max:255',
            'email' =>      'required|alpha_dash|email|max:255',
            'password' =>   'nullable|string|min:4|max:50',
            'roles' =>      'required|array',
            'roles.*' =>    'integer',
            'securityLevel' =>  'required|integer',
        ];
    }
}

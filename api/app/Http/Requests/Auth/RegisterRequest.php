<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\ApiRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class RegisterRequest extends ApiRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'username' =>   'required|string|min:2|max:255|unique:user',
            'email' =>      'required|string|email|max:255|unique:user',
            'password' =>   'required|string|min:4|max:50',
            'passwordConfirmation' => 'required|same:password',
        ];
    }
}

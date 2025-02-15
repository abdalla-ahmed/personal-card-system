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
            'username' =>   'required|alpha_dash|min:2|max:50',
            'email' =>      'required|string|email|max:50',
            'password' =>   'required|string|min:4|max:50',
            'passwordConfirmation' => 'required|same:password',
        ];
    }
}

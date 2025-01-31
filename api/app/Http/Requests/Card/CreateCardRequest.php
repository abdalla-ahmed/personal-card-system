<?php

namespace App\Http\Requests\Card;

use App\Http\Requests\ApiRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class CreateCardRequest extends ApiRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'fullName'          =>  'required|string|min:2|max:100',
            'position'          =>  'required|string|min:2|max:100',
            'telephone'         =>  'required|string|min:2|max:15',
            'mobile'            =>  'required|string|min:2|max:15',
            'email'             =>  'required|string|min:5|max:100',
            'address'           =>  'required|string|min:5|max:100',
            'companyName'       =>  'required|string|min:5|max:100',
            'companyAddress'    =>  'required|string|min:5|max:100',
        ];
    }
}

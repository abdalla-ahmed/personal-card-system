<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class LogController extends ApiController
{
    public function index()
    {
        return $this->resSuccess(User::orderBy('id', 'asc')->get());
    }

    public function show(User $user)
    {
        return $this->resSuccess($user);
    }
}

<?php

namespace App\Constants;

enum ActivityAction: string
{
    // crud
    case CREATE = 'Create';
    case UPDATE = 'Update';
    case DELETE = 'Delete';
    case PERMISSIONS_UPDATE = 'Permissions Update';

    // special
    case LOGS_PURGE = 'Logs Clear';

    // user/auth
    case USER_SIGNUP = 'User Signup';
    case USER_LOGIN = 'User Login';
    case USER_LOGOUT = 'User Logout';
    case USER_TOKEN_REFRESH = 'User Access Token Refresh';
}

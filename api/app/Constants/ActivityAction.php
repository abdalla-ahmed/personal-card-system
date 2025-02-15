<?php

namespace App\Constants;

enum ActivityAction: string
{
    // crud
    case CREATE = 'Created';
    case UPDATE = 'Updated';
    case DELETE = 'Deleted';

    // user/auth
    case USER_SIGNUP = 'New User Registered';
    case USER_LOGIN = 'User Logged In';
    case USER_LOGOUT = 'User Logged Out';
    case USER_TOKEN_REFRESH = 'User Access Token Refresh';

    // user profile
    case USER_PERMISSIONS_UPDATE = 'User Special Permissions Updated';
    case USER_PROFILE_UPDATE = 'User Profile Updated';

    // activity log
    case LOGS_PURGE = 'Activity Log Cleared';
}

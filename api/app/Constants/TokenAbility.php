<?php

namespace App\Constants;

enum TokenAbility: string
{
    case ACCESS_API = 'access-api';
    case ISSUE_ACCESS_TOKEN = 'issue-access-token';
}

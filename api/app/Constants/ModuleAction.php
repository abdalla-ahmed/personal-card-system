<?php

namespace App\Constants;

enum ModuleAction: string
{
    case View = 'allow_view';
    case Create = 'allow_create';
    case Update = 'allow_update';
    case Delete = 'allow_delete';
}

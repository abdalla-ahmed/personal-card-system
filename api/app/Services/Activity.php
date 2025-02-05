<?php

namespace App\Services;

use App\Constants\ActivityAction;
use App\Constants\ModuleID;
use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Activity
{
    // these are properties that are hidden from audit
    protected static $hiddenProps = [
        'password',
    ];

    public static function Log(
        int            $moduleId,
        ActivityAction $action,
        Model|null     $entity = null,
        array|null     $oldData = null,
        array|null     $newData = null
    ): void
    {
        $old_data = $oldData;
        $new_data = $newData;

        if (!is_null($entity)) {
            switch ($action) {
                case ActivityAction::CREATE:
                    $old_data = null;
                    $new_data = $entity->toArray();
                    break;
                case ActivityAction::UPDATE:
                    $old_data = $entity->getOriginal();
                    $new_data = $entity->toArray();
                    break;
                case ActivityAction::DELETE:
                    $old_data = $entity->toArray();
                    $new_data = null;
                    break;
            }
        }

        if (!is_null($old_data)) {
            foreach (self::$hiddenProps as $prop) {
                if (isset($old_data[$prop])) {
                    $old_data[$prop] = '<hidden>';
                }
            }
        }

        if (!is_null($new_data)) {
            foreach (self::$hiddenProps as $prop) {
                if (isset($new_data[$prop])) {
                    $new_data[$prop] = '<hidden>';
                }
            }
        }

        $request = request();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'ip_address' => $request->ip() ?? null,
            'user_agent' => $request->userAgent() ?? null,
            'module_id' => $moduleId,
            'action' => $action,
            'entity_type' => !is_null($entity) ? get_class($entity) : null,
            'entity_id' => !is_null($entity) ? $entity[$entity->getKeyName()] : null,
            'old_data' => $old_data,
            'new_data' => $new_data,
        ]);
    }
}

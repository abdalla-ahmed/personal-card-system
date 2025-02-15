<?php

namespace App\Http\Controllers;

use App\Constants\ActivityAction;
use App\Constants\ModuleID;
use App\Constants\UserSecurityLevel;
use App\Models\ActivityLog;
use App\Models\User;
use App\Services\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityLogController extends ApiController
{
    public function index()
    {
        $logs = ActivityLog::with(['user:id,username', 'module:id,name'])
            ->select(
                'id',
                'user_id',
                'module_id',
                'created_at as createdAt',
                'ip_address as ipAddress',
                'action',
                'entity_type as entityType',
                'entity_id as entityId'
            )
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->resSuccess($logs);
    }

    public function show(Request $request)
    {
        $id = $request->route('id');

        $log = ActivityLog::with(['user:id,username', 'module:id,name'])
            ->where('id', $id)
            ->select(
                'id',
                'user_id',
                'module_id',
                'created_at as createdAt',
                'ip_address as ipAddress',
                'user_agent as userAgent',
                'action',
                'entity_type as entityType',
                'entity_id as entityId',
                'old_data as oldData',
                'new_data as newData'
            )
            ->first();

        return $this->resSuccess($log);
    }

    public function destroy()
    {
        // only users with the highest security level can delete activity log.
        if (Auth::user()->security_level < UserSecurityLevel::L5) {
            return $this->resUnauthorized();
        }

        ActivityLog::query()->delete();
        Activity::Log(ModuleID::ActivityLog, ActivityAction::LOGS_PURGE);
        return $this->resNoContent();
    }
}

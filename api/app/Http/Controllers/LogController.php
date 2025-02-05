<?php

namespace App\Http\Controllers;

use App\Constants\ActivityAction;
use App\Constants\ModuleID;
use App\Models\ActivityLog;
use App\Models\User;
use App\Services\Activity;
use Illuminate\Http\Request;

class LogController extends ApiController
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
        ActivityLog::query()->delete();
        Activity::Log(ModuleID::ActivityLogs, ActivityAction::LOGS_PURGE);
        return $this->resNoContent();
    }
}

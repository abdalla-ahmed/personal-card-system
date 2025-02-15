<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Services\Permission;
use App\Constants\ModuleAction;


class CheckModulePermission extends MiddlewareBase
{
    private $actions = [
        'view' =>   'allow_view',
        'create' => 'allow_create',
        'update' => 'allow_update',
        'delete' => 'allow_delete',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $action): Response
    {
        $moduleId = $request['module_id'];

        Log::info("[CheckModulePermission-middleware] module=$moduleId, action=$action");

        if ((is_null($moduleId) || !is_numeric($moduleId)) || (is_null($action) || !is_string($action))) {
            return $this->resUnexpected();
        }

        if (!Auth::check()) {
            return $this->resUnauthenticated();
        }

        $user = Auth::user();
        $action = $this->actions[$action];

        if (is_null($action) || is_null($user)) {
            return $this->resUnexpected();
        }

        if (!Permission::checkModulePermission($user, $action, $moduleId)) {
            return $this->resUnauthorized();
        }

        return $next($request);
    }

    /**
     * Handle tasks after the response has been sent to the browser.
     */
    public function terminate(Request $request, Response $response): void
    {
        unset($request['module_id']);
    }
}

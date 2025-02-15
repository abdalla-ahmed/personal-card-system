<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Services\Permission;


class CheckModuleExtraPermission extends MiddlewareBase
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, int $extraPermissionId): Response
    {
        Log::info("[CheckModuleExtraPermission-middleware] extraPermission=$extraPermissionId");

        if (is_null($extraPermissionId) || !is_integer($extraPermissionId)) {
            return $this->resUnexpected();
        }

        if (!Auth::check()) {
            return $this->resUnauthenticated();
        }

        $user = Auth::user();

        if (is_null($user)) {
            return $this->resUnexpected();
        }

        if (!Permission::checkModuleExtraPermission($user, $extraPermissionId)) {
            return $this->resUnauthorized();
        }

        return $next($request);
    }
}

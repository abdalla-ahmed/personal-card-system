<?php

namespace App\Http\Middleware;

use App\Http\Library\ApiHelper;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use App\Models\UserModule;
use Illuminate\Support\Facades\Auth;

class CheckModule extends MiddlewareBase
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $moduleId): Response
    {
        Log::info("[CheckModule-middleware] module=$moduleId");

        if (is_null($moduleId) || !is_numeric($moduleId)) {
            return $this->resUnexpected();
        }

        $request['module_id'] =  $moduleId;

        return $next($request);
    }
}

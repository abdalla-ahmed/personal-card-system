<?php

use App\Http\Middleware\ApiResponseInterceptor;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CheckModule;
use App\Http\Middleware\CheckModuleExtraPermission;
use App\Http\Middleware\CheckModulePermission;
use Illuminate\Console\Scheduling\Schedule;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            //'abilities' => CheckAbilities::class,
            //'ability' => CheckForAnyAbility::class,

            'module' => CheckModule::class,
            'm' => CheckModule::class,

            'module.permission' => CheckModulePermission::class,
            'mp' => CheckModulePermission::class,

            'module.extra.permission' => CheckModuleExtraPermission::class,
            'xp' => CheckModuleExtraPermission::class,
        ]);

        $middleware->priority([
            CheckModule::class,
            CheckModulePermission::class,
            CheckModuleExtraPermission::class
        ]);

        $middleware->append(ApiResponseInterceptor::class);
    })
    ->withSchedule(function (Schedule $schedule) {
        // delete all expired access tokens database records
        $schedule->command('sanctum:prune-expired --hours=24')->daily();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

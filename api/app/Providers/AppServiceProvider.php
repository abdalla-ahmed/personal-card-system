<?php

namespace App\Providers;

use App\Constants\TokenAbility;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Connection;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (!app()->runningInConsole()) {
            //DB::connection()->enableQueryLog();
            DB::listen(function (QueryExecuted $query) {
                Log::debug("DB Query ($query->time ms): $query->sql");
            });

            DB::whenQueryingForLongerThan(threshold: 50 /* ms */, handler: function (Connection $connection, QueryExecuted $query) {
                Log::warning("DB Query takes so long ($query->time ms): $query->sql");
            });

            RateLimiter::for('api', function (Request $request) {
                return Limit::perMinute(30)->by($request->ip());
            });

            RateLimiter::for('storage', function (Request $request) {
                return Limit::perMinute(60)->by($request->ip());
            });

            // hook access token validation
            $this->overrideSanctumConfigurationToSupportRefreshToken();
        }

    }

    private function overrideSanctumConfigurationToSupportRefreshToken(): void
    {
        Sanctum::$accessTokenAuthenticationCallback = function ($accessToken, $isValid) {
            $abilities = collect($accessToken->abilities);
            if (!empty($abilities) && $abilities[0] === TokenAbility::ISSUE_ACCESS_TOKEN) {
                return $accessToken->expires_at && $accessToken->expires_at->isFuture();
            }

            return $isValid;
        };
    }
}

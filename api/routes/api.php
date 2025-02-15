<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\QRCodeController;
use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

// public
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/generate/qr-code', [QRCodeController::class, 'generateQrCode']);
Route::post('/generate/pdf', [PdfController::class, 'generatePdf2']);

Route::get('/public/cards/{card}', [CardController::class, 'showPublic']);


// internal
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh-token', [AuthController::class, 'refreshToken']);

    Route::get('/modules', [ModuleController::class, 'index']);

    Route::middleware(['module:1'])->group(function () {
        Route::get('/activity-log', [ActivityLogController::class, 'index'])->middleware('mp:view');
        Route::get('/activity-log/{id}', [ActivityLogController::class, 'show'])->middleware('mp:view');
        Route::delete('/activity-log', [ActivityLogController::class, 'destroy'])->middleware('mp:delete');
    });

    Route::middleware(['module:2'])->group(function () {
        Route::get('/roles', [RoleController::class, 'index'])->middleware(['mp:view']);
        Route::get('/roles/{role}', [RoleController::class, 'show'])->middleware(['mp:view']);
        Route::post('/roles', [RoleController::class, 'store'])->middleware('mp:create');
        Route::put('/roles/{role}', [RoleController::class, 'update'])->middleware('mp:update');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->middleware(['mp:delete']);
    });

    Route::middleware(['module:3'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->middleware('mp:view');
        Route::get('/users/{user}', [UserController::class, 'show'])->middleware('mp:view');
        Route::post('/users', [UserController::class, 'store'])->middleware('mp:create');
        Route::put('/users/{user}', [UserController::class, 'update'])->middleware('mp:update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware(['mp:delete']);
        Route::get('/users/{user}/permissions', [UserController::class, 'permissions'])->middleware('xp:1');
        Route::put('/users/{user}/permissions', [UserController::class, 'updatePermissions'])->middleware('xp:1');
    });

    Route::middleware(['module:4'])->group(function () {
        Route::get('/cards', [CardController::class, 'index'])->middleware(['mp:view']);
        Route::get('/cards/{card}', [CardController::class, 'show'])->middleware(['mp:view']);
        Route::post('/cards', [CardController::class, 'store'])->middleware('mp:create');
        Route::post('/cards/{card}', [CardController::class, 'update'])->middleware('mp:update'); // Yes POST not PUT (not a mistake)
        Route::patch('/cards/{card}', [CardController::class, 'updateState'])->middleware('mp:update');
        Route::delete('/cards/{card}', [CardController::class, 'destroy'])->middleware(['mp:delete']);
    });

    Route::middleware(['module:5'])->group(function () {
        Route::get('/users/current-user/profile', [UserController::class, 'profile'])->middleware('mp:view');
        Route::put('/users/current-user/profile', [UserController::class, 'updateProfile'])->middleware('mp:update');
    });
});

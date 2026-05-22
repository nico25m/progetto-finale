<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppNotificationController;
use App\Http\Controllers\BoardColumnController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [AppNotificationController::class, 'index']);
    Route::put('/notifications/read', [AppNotificationController::class, 'markAsRead']);
    Route::get('/boards', [BoardController::class, 'index']);
    Route::post('/boards', [BoardController::class, 'store']);
    Route::put('/boards/{board}', [BoardController::class, 'update']);
    Route::delete('/boards/{board}', [BoardController::class, 'destroy']);
    Route::post('/boards/join', [BoardController::class, 'join']);
    Route::delete('/boards/{board}/leave', [BoardController::class, 'leave']);
    Route::post('/boards/{board}/invite', [BoardController::class, 'updateInvite']);
    Route::put('/board-members/{member}', [BoardController::class, 'updateMember']);
    Route::delete('/board-members/{member}', [BoardController::class, 'removeMember']);
    Route::post('/boards/{board}/columns', [BoardColumnController::class, 'store']);
    Route::post('/boards/{board}/tags', [TagController::class, 'store']);
    Route::put('/columns/{column}', [BoardColumnController::class, 'update']);
    Route::delete('/columns/{column}', [BoardColumnController::class, 'destroy']);
    Route::post('/columns/{column}/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
    Route::put('/tags/{tag}', [TagController::class, 'update']);
    Route::delete('/tags/{tag}', [TagController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

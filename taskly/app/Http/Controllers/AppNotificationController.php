<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppNotificationController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()
            ->appNotifications()
            ->with('board:id,name')
            ->latest()
            ->limit(30)
            ->get();
    }

    public function markAsRead(Request $request)
    {
        $request->user()
            ->appNotifications()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->noContent();
    }
}

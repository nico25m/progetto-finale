<?php

namespace App\Http\Controllers;
use App\Models\AppNotification;
use App\Models\Board;
use Illuminate\Http\Request;

abstract class Controller
{
    protected function getRole(Request $request, Board $board): ?string
    {
        if ($board->user_id === $request->user()->id) {
            return 'owner';
        }

        return $board->members()
            ->where('user_id', $request->user()->id)
            ->value('role');
    }

    protected function createNotification(Board $board, Request $request, string $message): void
    {
        $userIds = $board->members()
            ->where('user_id', '!=', $request->user()->id)
            ->pluck('user_id');

        foreach ($userIds as $userId) {
            AppNotification::create([
                'user_id' => $userId,
                'board_id' => $board->id,
                'message' => $message,
            ]);
        }
    }
}

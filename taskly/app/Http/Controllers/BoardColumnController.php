<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardColumn;
use Illuminate\Http\Request;

class BoardColumnController extends Controller
{
    public function store(Request $request, Board $board)
    {
        $this->checkBoardManager($request, $board);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:20'],
        ]);

        $data['position'] = $board->columns()->count();

        $column = $board->columns()->create($data);

        $this->createNotification(
            $board,
            $request,
            $request->user()->name . " ha creato la colonna {$column->name} nella bacheca {$board->name}."
        );

        return response()->json($column->load('tasks'), 201);
    }

    public function update(Request $request, BoardColumn $column)
    {
        $this->checkBoardManager($request, $column->board);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:20'],
        ]);

        $column->update($data);

        $this->createNotification(
            $column->board,
            $request,
            $request->user()->name . " ha modificato la colonna {$column->name}."
        );

        return response()->json($column->load('tasks'));
    }

    public function destroy(Request $request, BoardColumn $column)
    {
        $this->checkBoardManager($request, $column->board);

        $board = $column->board;
        $columnName = $column->name;
        $column->delete();

        $this->createNotification(
            $board,
            $request,
            $request->user()->name . " ha eliminato la colonna {$columnName}."
        );

        return response()->noContent();
    }

    private function checkBoardManager(Request $request, Board $board): void
    {
        $role = $this->getRole($request, $board);

        if (! in_array($role, ['owner', 'admin'], true)) {
            abort(403);
        }
    }
}

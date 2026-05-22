<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Request $request, BoardColumn $column)
    {
        $this->checkTaskEditor($request, $column->board);

        $data = $this->validateTask($request);
        $this->checkTag($data['tag_id'] ?? null, $column->board);
        $data['position'] = $column->tasks()->count();

        $task = $column->tasks()->create($data);

        $this->createNotification(
            $column->board,
            $request,
            $request->user()->name . " ha creato la task {$task->title}."
        );

        return response()->json($task->load('tag'), 201);
    }

    public function update(Request $request, Task $task)
    {
        $this->checkTaskEditor($request, $task->column->board);

        $data = $this->validateTask($request);
        $this->checkTag($data['tag_id'] ?? null, $task->column->board);
        $task->update($data);

        $this->createNotification(
            $task->column->board,
            $request,
            $request->user()->name . " ha modificato la task {$task->title}."
        );

        return response()->json($task->load('tag'));
    }

    public function destroy(Request $request, Task $task)
    {
        $this->checkTaskEditor($request, $task->column->board);

        $board = $task->column->board;
        $taskTitle = $task->title;
        $task->delete();

        $this->createNotification(
            $board,
            $request,
            $request->user()->name . " ha eliminato la task {$taskTitle}."
        );

        return response()->noContent();
    }

    private function validateTask(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => ['required', 'string', 'in:low,medium,high'],
            'tag_id' => ['nullable', 'exists:tags,id'],
        ]);
    }

    private function checkTaskEditor(Request $request, Board $board): void
    {
        $role = $this->getRole($request, $board);

        if (! in_array($role, ['owner', 'admin', 'editor'], true)) {
            abort(403);
        }
    }

    private function checkTag($tagId, Board $board): void
    {
        if ($tagId && ! $board->tags()->where('id', $tagId)->exists()) {
            abort(422);
        }
    }

}

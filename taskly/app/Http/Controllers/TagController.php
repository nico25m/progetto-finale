<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function store(Request $request, Board $board)
    {
        $this->checkBoardManager($request, $board);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:20'],
        ]);

        $tag = $board->tags()->create($data);

        $this->createNotification(
            $board,
            $request,
            $request->user()->name . " ha creato il tag {$tag->name} nella bacheca {$board->name}."
        );

        return response()->json($tag, 201);
    }

    public function update(Request $request, Tag $tag)
    {
        $this->checkBoardManager($request, $tag->board);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:20'],
        ]);

        $tag->update($data);

        $this->createNotification(
            $tag->board,
            $request,
            $request->user()->name . " ha modificato il tag {$tag->name}."
        );

        return response()->json($tag);
    }

    public function destroy(Request $request, Tag $tag)
    {
        $this->checkBoardManager($request, $tag->board);

        $board = $tag->board;
        $tagName = $tag->name;
        $tag->delete();

        $this->createNotification(
            $board,
            $request,
            $request->user()->name . " ha eliminato il tag {$tagName}."
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

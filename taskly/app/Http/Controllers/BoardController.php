<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardMember;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BoardController extends Controller
{
    private array $defaultColumns = [
        ['name' => 'Da fare', 'color' => '#2563eb'],
        ['name' => 'In corso', 'color' => '#2563eb'],
        ['name' => 'Completate', 'color' => '#2563eb'],
    ];

    public function index(Request $request)
    {
        return Board::query()
            ->where('user_id', $request->user()->id)
            ->orWhereHas('members', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->with(['columns', 'tags', 'members.user'])
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:20'],
        ]);

        $board = $request->user()->boards()->create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'color' => $data['color'] ?? '#2563eb',
            'invite_code' => $this->createInviteCode(),
            'invite_role' => 'editor',
        ]);

        $board->members()->create([
            'user_id' => $request->user()->id,
            'role' => 'owner',
        ]);

        foreach ($this->defaultColumns as $position => $column) {
            $board->columns()->create([
                'name' => $column['name'],
                'color' => $column['color'],
                'position' => $position,
            ]);
        }

        return response()->json($board->load(['columns', 'tags', 'members.user']), 201);
    }

    public function update(Request $request, Board $board)
    {
        $this->checkBoardManager($request, $board);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'color' => ['required', 'string', 'max:20'],
        ]);

        $board->update($data);

        $this->createNotification(
            $board,
            $request,
            $request->user()->name . " ha modificato la bacheca {$board->name}."
        );

        return response()->json($board->load(['columns', 'tags', 'members.user']));
    }

    public function destroy(Request $request, Board $board)
    {
        if ($board->user_id !== $request->user()->id) {
            abort(403);
        }

        $board->delete();

        return response()->noContent();
    }

    public function join(Request $request)
    {
        $data = $request->validate([
            'invite_code' => ['required', 'string'],
        ]);

        $board = Board::where('invite_code', Str::upper($data['invite_code']))->firstOrFail();

        if (! $board->members()->where('user_id', $request->user()->id)->exists()) {
            $board->members()->create([
                'user_id' => $request->user()->id,
                'role' => $board->invite_role ?? 'editor',
            ]);
        }

        $this->createNotification(
            $board,
            $request,
            $request->user()->name . " è entrato nella bacheca {$board->name}."
        );

        return response()->json($board->load(['columns', 'tags', 'members.user']));
    }

    public function leave(Request $request, Board $board)
    {
        if ($board->user_id === $request->user()->id) {
            abort(403);
        }

        $board->members()
            ->where('user_id', $request->user()->id)
            ->delete();

        $this->createNotification(
            $board,
            $request,
            $request->user()->name . " ha abbandonato la bacheca {$board->name}."
        );

        return response()->noContent();
    }

    public function updateInvite(Request $request, Board $board)
    {
        $this->checkBoardManager($request, $board);

        $data = $request->validate([
            'role' => ['required', 'string', 'in:admin,editor,viewer'],
        ]);

        $board->update([
            'invite_role' => $data['role'],
        ]);

        $this->createNotification(
            $board,
            $request,
            $request->user()->name . " ha aggiornato il ruolo degli inviti nella bacheca {$board->name}."
        );

        return response()->json($board->load(['columns', 'tags', 'members.user']));
    }

    public function updateMember(Request $request, BoardMember $member)
    {
        $this->checkBoardOwner($request, $member->board);

        if ($member->role === 'owner') {
            abort(403);
        }

        $data = $request->validate([
            'role' => ['required', 'string', 'in:admin,editor,viewer'],
        ]);

        $member->update([
            'role' => $data['role'],
        ]);

        $this->createNotification(
            $member->board,
            $request,
            $request->user()->name . " ha modificato un ruolo nella bacheca {$member->board->name}."
        );

        return response()->json($member->board->load(['columns', 'tags', 'members.user']));
    }

    public function removeMember(Request $request, BoardMember $member)
    {
        $this->checkBoardOwner($request, $member->board);

        if ($member->role === 'owner') {
            abort(403);
        }

        $board = $member->board;
        $member->delete();

        $this->createNotification(
            $board,
            $request,
            $request->user()->name . " ha rimosso un utente dalla bacheca {$board->name}."
        );

        return response()->json($board->load(['columns', 'tags', 'members.user']));
    }

    private function checkBoardManager(Request $request, Board $board): void
    {
        $role = $this->getRole($request, $board);

        if (! in_array($role, ['owner', 'admin'], true)) {
            abort(403);
        }
    }

    private function checkBoardOwner(Request $request, Board $board): void
    {
        if ($board->user_id !== $request->user()->id) {
            abort(403);
        }
    }

    private function createInviteCode(): string
    {
        do {
            $code = Str::upper(Str::random(8));
        } while (Board::where('invite_code', $code)->exists());

        return $code;
    }
}

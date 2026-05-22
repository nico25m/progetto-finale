<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('board_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('editor');
            $table->timestamps();

            $table->unique(['board_id', 'user_id']);
        });

        $boards = DB::table('boards')->get();

        foreach ($boards as $board) {
            DB::table('board_members')->insert([
                'board_id' => $board->id,
                'user_id' => $board->user_id,
                'role' => 'owner',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('board_members');
    }
};

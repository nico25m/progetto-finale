<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('boards', function (Blueprint $table) {
            $table->string('color')->default('#2563eb');
            $table->string('invite_code')->nullable()->unique();
        });

        $boards = DB::table('boards')->get();

        foreach ($boards as $board) {
            DB::table('boards')
                ->where('id', $board->id)
                ->update(['invite_code' => Str::upper(Str::random(8))]);
        }

        Schema::table('tasks', function (Blueprint $table) {
            $table->text('description')->nullable();
            $table->string('priority')->default('medium');
            $table->date('due_date')->nullable();
            $table->boolean('completed')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['description', 'priority', 'due_date', 'completed']);
        });

        Schema::table('boards', function (Blueprint $table) {
            $table->dropColumn(['color', 'invite_code']);
        });
    }
};

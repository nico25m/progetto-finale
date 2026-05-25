<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('board_columns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('color')->default('#0000');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        $defaultColumns = [
            ['name' => 'Da fare', 'color' => '#0000'],
            ['name' => 'In corso', 'color' => '#0000'],
            ['name' => 'Completate', 'color' => '#0000'],
        ];

        $boards = DB::table('boards')->get();

        foreach ($boards as $board) {
            foreach ($defaultColumns as $position => $column) {
                DB::table('board_columns')->insert([
                    'board_id' => $board->id,
                    'name' => $column['name'],
                    'color' => $column['color'],
                    'position' => $position,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('board_columns');
    }
};

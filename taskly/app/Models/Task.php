<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'board_column_id',
        'tag_id',
        'title',
        'description',
        'priority',
        'position',
    ];

    public function column(): BelongsTo
    {
        return $this->belongsTo(BoardColumn::class, 'board_column_id');
    }

    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }
}

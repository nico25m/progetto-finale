<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Board extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'color',
        'invite_code',
        'invite_role',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function columns(): HasMany
    {
        return $this->hasMany(BoardColumn::class)
            ->with('tasks')
            ->orderBy('position');
    }

    public function tags(): HasMany
    {
        return $this->hasMany(Tag::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(BoardMember::class);
    }
}

import React from "react";

export function Filters({
    tags,
    search,
    priorityFilter,
    tagFilter,
    onSearchChange,
    onPriorityChange,
    onTagChange,
}) {
    return (
        <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_180px]">
            <input
                className="input sm:col-span-2 xl:col-span-1"
                placeholder="Cerca task..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
            />
            <select
                className="select"
                value={priorityFilter}
                onChange={(event) => onPriorityChange(event.target.value)}
            >
                <option value="">Tutte le priorità</option>
                <option value="low">Bassa</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
            </select>
            <select
                className="select"
                value={tagFilter}
                onChange={(event) => onTagChange(event.target.value)}
            >
                <option value="">Tutti i tag</option>
                {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                        {tag.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

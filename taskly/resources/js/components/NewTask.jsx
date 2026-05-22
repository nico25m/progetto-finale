import React from "react";

export function NewTask({ columns, tags, error, onSubmit }) {
    return (
        <form
            className="space-y-3"
            onSubmit={(event) => {
                const formData = new FormData(event.currentTarget);
                const columnId = Number(formData.get("column_id"));
                onSubmit(event, columnId);
            }}
        >
            <input
                className="input"
                name="taskTitle"
                placeholder="Titolo"
                type="text"
                required
            />
            <textarea
                className="textarea"
                name="description"
                placeholder="Descrizione"
            ></textarea>
            <div className="grid gap-3 sm:grid-cols-2">
                <select
                    className="select"
                    name="column_id"
                    defaultValue={columns[0]?.id || ""}
                    required
                >
                    {columns.map((column) => (
                        <option key={column.id} value={column.id}>
                            {column.name}
                        </option>
                    ))}
                </select>
                <select className="select" name="priority" defaultValue="medium">
                    <option value="low">Bassa</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                </select>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag.id}>
                            <input
                                className="peer sr-only"
                                id={`new-task-tag-${tag.id}`}
                                name="tag_id"
                                type="radio"
                                value={tag.id}
                            />
                            <label
                                className="pill peer-checked:ring-2 peer-checked:ring-[#2563eb]"
                                htmlFor={`new-task-tag-${tag.id}`}
                                style={{ backgroundColor: `${tag.color}50` }}
                            >
                                {tag.name}
                            </label>
                        </span>
                    ))}
                </div>
            )}
            {error && <p className="error">{error}</p>}
            <button className="btn btn-blue" type="submit">
                Aggiungi
            </button>
        </form>
    );
}

import React from "react";

export function BoardSettings({
    board,
    boardNameLimit,
    error,
    onSubmit,
    onDelete,
}) {
    return (
        <form className="space-y-3" onSubmit={onSubmit}>
            <input
                className="input"
                name="name"
                defaultValue={board.name}
                placeholder="Nome bacheca"
                type="text"
                maxLength={boardNameLimit + 1}
                required
            />
            <textarea
                className="textarea"
                name="description"
                defaultValue={board.description || ""}
                placeholder="Descrizione bacheca"
            ></textarea>
            <label className="color-row">
                Colore
                <input
                    className="color-input"
                    name="color"
                    type="color"
                    defaultValue={board.color || "#2563eb"}
                />
            </label>

            {error && <p className="error">{error}</p>}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                    className="btn btn-red btn-full sm:w-auto"
                    type="button"
                    onClick={onDelete}
                >
                    Elimina bacheca
                </button>
                <button
                    className="btn btn-blue btn-full sm:w-auto"
                    type="submit"
                >
                    Salva
                </button>
            </div>
        </form>
    );
}

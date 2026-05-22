import React from "react";

export function Labels({ tags, onCreateTag, onUpdateTag, onDeleteTag }) {
    return (
        <section>
            <form
                className="mb-4 grid gap-3 sm:grid-cols-[1fr_64px_112px]"
                onSubmit={onCreateTag}
            >
                <input
                    className="input"
                    name="tagName"
                    placeholder="Nome tag"
                    type="text"
                />
                <label className="flex h-11 items-center justify-between gap-3 rounded-lg border border-[#d6dce5] bg-white px-3 text-sm font-bold text-[#667085] sm:px-2">
                    <span className="sm:hidden">Colore</span>
                    <input
                        className="h-8 w-12 rounded-md border border-[#d6dce5] bg-white p-1 sm:w-full"
                        name="tagColor"
                        type="color"
                        defaultValue="#2563eb"
                        aria-label="Colore tag"
                    />
                </label>
                <button className="btn btn-blue" type="submit">
                    Aggiungi
                </button>
            </form>

            <div className="space-y-3">
                {tags.map((tag) => (
                    <form
                        className="grid gap-3 rounded-lg border border-[#dbe3ee] bg-[#f8fbff] p-3 sm:grid-cols-[1fr_100px_90px] sm:items-center"
                        key={tag.id}
                        onSubmit={(event) => onUpdateTag(event, tag.id)}
                    >
                        <div className="flex min-w-0 items-center gap-3 rounded-lg bg-white px-3 py-2 sm:bg-transparent sm:px-0 sm:py-0">
                            <span
                                className="h-3.5 w-3.5 shrink-0 rounded-full"
                                style={{ backgroundColor: tag.color }}
                            ></span>
                            <input
                                className="min-w-0 flex-1 bg-transparent text-base font-extrabold text-[#101828] outline-none"
                                name="name"
                                defaultValue={tag.name}
                            />
                            <input
                                className="h-8 w-11 shrink-0 rounded-md border border-[#d6dce5] bg-white p-1"
                                name="color"
                                type="color"
                                defaultValue={tag.color}
                                aria-label={`Colore ${tag.name}`}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:contents">
                            <button
                                className="btn btn-plain bg-white"
                                type="submit"
                            >
                                Modifica
                            </button>
                            <button
                                className="btn btn-red bg-white"
                                type="button"
                                onClick={() => onDeleteTag(tag.id)}
                            >
                                Elimina
                            </button>
                        </div>
                    </form>
                ))}
            </div>
        </section>
    );
}

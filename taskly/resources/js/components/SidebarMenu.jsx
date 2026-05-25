import React from "react";
import { getRoleLabel } from "../role/roles";

export function SidebarMenu({
    user,
    boards,
    selectedBoardId,
    boardError,
    boardNameLimit,
    onCreateBoard,
    onJoinBoard,
    onSelectBoard,
    onOpenBoardSettings,
}) {
    function countTasks(board) {
        let total = 0;

        for (const column of board.columns || []) {
            total = total + (column.tasks?.length || 0);
        }

        return total;
    }

    function getRole(board) {
        const member = (board.members || []).find(
            (item) => item.user_id === user?.id,
        );
        return member?.role || "owner";
    }

    function canManageBoard(board) {
        const role = getRole(board);
        return role === "owner" || role === "admin";
    }

    function countMembers(board) {
        return board.members?.length || 1;
    }

    function pluralLabel(total, single, plural) {
        return total === 1 ? single : plural;
    }

    return (
        <>
            <form
                className="mb-4 grid grid-cols-[1fr_64px] gap-3 sm:gap-4"
                onSubmit={onCreateBoard}
            >
                <input
                    className="input min-w-0"
                    name="boardName"
                    type="text"
                    placeholder="Nuova bacheca"
                    aria-label="Nuova bacheca"
                    maxLength={boardNameLimit + 1}
                />
                <button className="btn btn-blue" type="submit">
                    Crea
                </button>
            </form>

            {boardError && <p className="error mb-4">{boardError}</p>}

            <form
                className="grid grid-cols-[1fr_64px] gap-3 sm:gap-4"
                onSubmit={onJoinBoard}
            >
                <input
                    className="input min-w-0"
                    name="invite_code"
                    type="text"
                    placeholder="Codice invito"
                    aria-label="Codice invito"
                />
                <button className="btn btn-light" type="submit">
                    Entra
                </button>
            </form>

            {boards.length > 0 && (
                <section className="mt-4">
                    <div className="max-h-52 space-y-2 overflow-y-auto pr-1 min-[1240px]:max-h-none min-[1240px]:overflow-visible min-[1240px]:pr-0">
                        {boards.map((board) => (
                            <div
                                className={`flex w-full min-w-0 items-center justify-between rounded-lg px-3 py-3 text-left transition ${
                                    board.id === selectedBoardId
                                        ? "bg-[#eaf2ff] text-[#101828]"
                                        : "bg-white text-[#202938] hover:bg-[#f5f8fc]"
                                }`}
                                key={board.id}
                            >
                                <button
                                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                    type="button"
                                    onClick={() => onSelectBoard(board.id)}
                                >
                                    <span
                                        className="h-9 w-3 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor:
                                                board.color || "#2563eb",
                                        }}
                                    ></span>
                                    <span className="min-w-0 flex-1 overflow-hidden">
                                        <span
                                            className="block max-w-full truncate text-base font-extrabold"
                                            title={board.name}
                                        >
                                            {board.name}
                                        </span>
                                        <span className="block truncate text-sm text-[#667085]">
                                            {getRoleLabel(getRole(board))} -{" "}
                                            {countTasks(board)}{" "}
                                            {pluralLabel(countTasks(board), "task", "task")}
                                            <span className="min-[1240px]:hidden">
                                                {" "}- {countMembers(board)}{" "}
                                                {pluralLabel(countMembers(board), "utente", "utenti")}
                                            </span>
                                        </span>
                                        <span className="hidden truncate text-sm text-[#667085] min-[1240px]:block">
                                            {countMembers(board)}{" "}
                                            {pluralLabel(countMembers(board), "utente", "utenti")}
                                        </span>
                                    </span>
                                </button>

                                {canManageBoard(board) && (
                                    <button
                                        className="ml-2 flex h-9 w-8 flex-col items-center justify-center gap-0.5 rounded-md transition hover:bg-white"
                                        type="button"
                                        onClick={() =>
                                            onOpenBoardSettings(board.id)
                                        }
                                        aria-label={`Gestisci ${board.name}`}
                                    >
                                        <span className="h-1 w-1 rounded-full bg-[#667085]"></span>
                                        <span className="h-1 w-1 rounded-full bg-[#667085]"></span>
                                        <span className="h-1 w-1 rounded-full bg-[#667085]"></span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}

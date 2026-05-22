import React from "react";
import { Dialog } from "./Dialog";
import { Share } from "./Share";
import { Labels } from "./Labels";
import { BoardSettings } from "./BoardSettings";
import { NewTask } from "./NewTask";

function getPriorityValue(priority) {
    if (priority === "low") {
        return "bassa";
    }

    if (priority === "medium") {
        return "media";
    }

    if (priority === "high") {
        return "alta";
    }

    return priority || "medium";
}

export function TasklyModals({
    activeModal,
    board,
    boardNameLimit,
    boardActionError,
    columnError,
    selectedColumn,
    selectedTask,
    selectedColumns,
    selectedRole,
    shareMessage,
    onClose,
    onUpdateBoard,
    onDeleteBoard,
    onCreateColumn,
    onUpdateColumn,
    onDeleteColumn,
    onCreateTag,
    onUpdateTag,
    onDeleteTag,
    onCreateTask,
    onUpdateTask,
    onDeleteTask,
    onShare,
    onUpdateMemberRole,
    onRemoveMember,
}) {
    if (activeModal === "board") {
        return (
            <Dialog title="Gestisci bacheca" onClose={onClose}>
                <BoardSettings
                    board={board}
                    boardNameLimit={boardNameLimit}
                    error={boardActionError}
                    onSubmit={onUpdateBoard}
                    onDelete={onDeleteBoard}
                />
            </Dialog>
        );
    }

    if (activeModal === "column") {
        return (
            <Dialog title="Nuova colonna" onClose={onClose}>
                <form className="space-y-3" onSubmit={onCreateColumn}>
                    <input
                        className="input"
                        name="columnName"
                        placeholder="Nome colonna"
                        type="text"
                    />
                    <label className="color-row">
                        Colore
                        <input
                            className="color-input"
                            name="columnColor"
                            type="color"
                            defaultValue="#2563eb"
                        />
                    </label>
                    {columnError && <p className="error">{columnError}</p>}
                    <button className="btn btn-blue" type="submit">
                        Crea
                    </button>
                </form>
            </Dialog>
        );
    }

    if (activeModal === "editColumn" && selectedColumn) {
        return (
            <Dialog title="Modifica colonna" onClose={onClose}>
                <form
                    className="space-y-3"
                    onSubmit={(event) =>
                        onUpdateColumn(event, selectedColumn.id)
                    }
                >
                    <input
                        className="input"
                        name="name"
                        defaultValue={selectedColumn.name}
                    />
                    <label className="color-row">
                        Colore
                        <input
                            className="color-input"
                            name="color"
                            type="color"
                            defaultValue={selectedColumn.color}
                        />
                    </label>
                    {columnError && <p className="error">{columnError}</p>}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            className="btn btn-blue btn-full sm:w-auto"
                            type="submit"
                        >
                            Salva
                        </button>
                        <button
                            className="btn btn-red btn-full sm:w-auto"
                            type="button"
                            onClick={() => onDeleteColumn(selectedColumn.id)}
                        >
                            Elimina
                        </button>
                    </div>
                </form>
            </Dialog>
        );
    }

    if (activeModal === "tag") {
        return (
            <Dialog title="Gestisci tag" onClose={onClose}>
                {boardActionError && (
                    <p className="error mb-3">{boardActionError}</p>
                )}
                <Labels
                    tags={board.tags || []}
                    onCreateTag={onCreateTag}
                    onUpdateTag={onUpdateTag}
                    onDeleteTag={onDeleteTag}
                />
            </Dialog>
        );
    }

    if (activeModal === "task") {
        return (
            <Dialog title="Nuova task" onClose={onClose}>
                <NewTask
                    columns={selectedColumns}
                    tags={board.tags || []}
                    error={columnError}
                    onSubmit={onCreateTask}
                />
            </Dialog>
        );
    }

    if (activeModal === "editTask" && selectedTask) {
        return (
            <Dialog title="Modifica task" onClose={onClose}>
                <form
                    className="space-y-3"
                    onSubmit={(event) => onUpdateTask(event, selectedTask.id)}
                >
                    <input
                        className="input"
                        name="title"
                        defaultValue={selectedTask.title}
                        placeholder="Titolo"
                        type="text"
                        required
                    />
                    <textarea
                        className="textarea"
                        name="description"
                        defaultValue={selectedTask.description || ""}
                        placeholder="Descrizione"
                    ></textarea>
                    <select
                        className="select"
                        name="priority"
                        defaultValue={getPriorityValue(selectedTask.priority)}
                    >
                        <option value="low">Bassa</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                    </select>

                    <div className="flex flex-wrap gap-2">
                        <span>
                            <input
                                className="peer sr-only"
                                id="edit-task-no-tag"
                                name="tag_id"
                                type="radio"
                                value=""
                                defaultChecked={!selectedTask.tag_id}
                            />
                            <label
                                className="pill bg-[#eef2f6] peer-checked:ring-2 peer-checked:ring-[#2563eb]"
                                htmlFor="edit-task-no-tag"
                            >
                                Nessun tag
                            </label>
                        </span>
                        {(board.tags || []).map((tag) => (
                            <span key={tag.id}>
                                <input
                                    className="peer sr-only"
                                    id={`edit-task-tag-${tag.id}`}
                                    name="tag_id"
                                    type="radio"
                                    value={tag.id}
                                    defaultChecked={
                                        String(selectedTask.tag_id || "") ===
                                        String(tag.id)
                                    }
                                />
                                <label
                                    className="pill peer-checked:ring-2 peer-checked:ring-[#2563eb]"
                                    htmlFor={`edit-task-tag-${tag.id}`}
                                    style={{
                                        backgroundColor: `${tag.color}33`,
                                    }}
                                >
                                    {tag.name}
                                </label>
                            </span>
                        ))}
                    </div>

                    {columnError && <p className="error">{columnError}</p>}

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            className="btn btn-blue btn-full sm:w-auto"
                            type="submit"
                        >
                            Salva
                        </button>
                        <button
                            className="btn btn-red btn-full sm:w-auto"
                            type="button"
                            onClick={() => onDeleteTask(selectedTask.id)}
                        >
                            Elimina
                        </button>
                    </div>
                </form>
            </Dialog>
        );
    }

    if (activeModal === "share") {
        return (
            <Dialog title="Condividi bacheca" onClose={onClose}>
                <Share
                    board={board}
                    selectedRole={selectedRole}
                    error={boardActionError}
                    shareMessage={shareMessage}
                    onShare={onShare}
                    onUpdateMemberRole={onUpdateMemberRole}
                    onRemoveMember={onRemoveMember}
                />
            </Dialog>
        );
    }

    return null;
}

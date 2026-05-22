import React from "react";
import { TaskCard } from "./TaskCard";

export function Columns({
    columns,
    canEditColumns,
    canEditTasks,
    onEditColumn,
    onEditTask,
}) {
    return (
        <div className="grid flex-1 auto-cols-[minmax(280px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-2 min-[1240px]:auto-cols-auto min-[1240px]:grid-flow-row min-[1240px]:grid-cols-4">
            {columns.map((column) => (
                <section
                    className="flex min-w-70 flex-col rounded-lg border border-[#dbe3ee] bg-white/80 p-3 min-[1240px]:min-w-0"
                    key={column.id}
                >
                    <div className="mb-4 flex items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                            <span
                                className="mt-0.5 h-11 w-1 shrink-0 rounded-full"
                                style={{ backgroundColor: column.color }}
                            ></span>
                            <h2
                                className="min-w-0 truncate pt-3 text-base font-extrabold text-[#101828]"
                                title={column.name}
                            >
                                {column.name}
                            </h2>
                        </div>

                        <div className="flex shrink-0 items-center gap-3 pt-2">
                            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#f3f7fc] px-2 text-sm font-bold text-[#667085]">
                                {column.tasks?.length || 0}
                            </span>
                            {canEditColumns && (
                                <button
                                    className="rounded-md bg-[#f8fbff] px-3 py-2 text-sm font-extrabold text-[#667085] transition hover:bg-[#eaf2ff] hover:text-[#176fe6]"
                                    type="button"
                                    onClick={() => onEditColumn(column.id)}
                                >
                                    Modifica
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="min-h-90 space-y-3 min-[1240px]:min-h-112.5">
                        {(column.tasks || []).map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                canEdit={canEditTasks}
                                onEditTask={onEditTask}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

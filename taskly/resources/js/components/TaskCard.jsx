import React from "react";

const priorityLabels = {
    low: "Bassa",
    medium: "Media",
    high: "Alta",
};

const priorityClasses = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-red-500",
};

export function TaskCard({ task, canEdit, onEditTask }) {
    const priority = task.priority || "medium";
    const cardClass = `block w-full rounded-lg border border-[#dbe3ee] bg-white p-4 text-left shadow-[0_10px_22px_rgba(16,24,40,0.04)] ${
        canEdit
            ? "transition hover:border-[#b8c7dc] hover:shadow-[0_14px_26px_rgba(16,24,40,0.08)]"
            : ""
    }`;
    const content = (
        <>
            <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="min-w-0 text-base font-extrabold text-[#101828]">
                    {task.title}
                </h3>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                        priorityClasses[priority] || priorityClasses.media
                    }`}
                >
                    {priorityLabels[priority] || priority}
                </span>
            </div>

            {task.description && (
                <p className="mb-5 line-clamp-2 text-sm leading-5 text-[#667085]">
                    {task.description}
                </p>
            )}

            <div className="flex justify-end text-sm font-medium text-[#5f6f86]">
                {task.tag ? (
                    <span
                        className="inline-flex max-w-full truncate rounded-full px-3 py-1.5 text-sm font-extrabold text-[#101828]"
                        style={{ backgroundColor: `${task.tag.color}50` }}
                    >
                        <span className="truncate">{task.tag.name}</span>
                    </span>
                ) : (
                    <span className="truncate text-sm text-[#667085]">
                        Nessun tag
                    </span>
                )}
            </div>
        </>
    );

    if (!canEdit) {
        return <article className={cardClass}>{content}</article>;
    }

    return (
        <button
            className={cardClass}
            type="button"
            onClick={() => onEditTask(task.id)}
        >
            {content}
        </button>
    );
}

import React from "react";

export function Notifications({ open, notifications, onToggle, onMarkRead }) {
    const unread = notifications.filter((item) => !item.read_at).length;

    return (
        <div className="relative">
            <button
                className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffffff] cursor-pointer transition hover:bg-[#dbeafe]"
                type="button"
                onClick={onToggle}
                aria-label="Apri notifiche"
            >
                <svg
                    className="h-5 w-5 text-[#101828]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                {unread > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#dc2626] px-1 text-xs font-extrabold text-white">
                        {unread}
                    </span>
                )}
            </button>

            {open && (
                <section className="absolute right-0 z-50 mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-[#dbe3ee] bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h2 className="text-base font-extrabold">Notifiche</h2>

                        {unread > 0 && (
                            <button
                                className="text-sm font-bold text-[#1761c8] hover:text-[#79aff7] cursor-pointer"
                                type="button"
                                onClick={onMarkRead}
                            >
                                Segna lette
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <p className="rounded-lg bg-[#f6f9fc] px-3 py-4 text-sm text-[#667085]">
                            Nessuna notifica.
                        </p>
                    ) : (
                        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                            {notifications.map((notification) => (
                                <article
                                    className={`rounded-lg border px-3 py-3 ${
                                        notification.read_at
                                            ? "border-[#e5eaf1] bg-white"
                                            : "border-[#bfdbfe] bg-[#eff6ff]"
                                    }`}
                                    key={notification.id}
                                >
                                    <p className="text-sm font-bold leading-5 text-[#101828]">
                                        {notification.message}
                                    </p>
                                    <p className="mt-1 text-xs text-[#667085]">
                                        {notification.board?.name || "Taskly"}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

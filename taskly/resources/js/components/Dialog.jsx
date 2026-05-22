import React from "react";

export function Dialog({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 grid place-items-start overflow-y-auto bg-[#101828]/35 px-4 py-4 sm:place-items-center sm:py-6">
            <section className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-5 shadow-[0_28px_90px_rgba(15,23,42,0.28)] sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-extrabold text-[#101828] sm:text-[26px]">
                        {title}
                    </h2>
                    <button
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3f7fc] text-xl text-[#101828] transition hover:bg-[#eaf2ff]"
                        type="button"
                        onClick={onClose}
                        aria-label="Chiudi"
                    >
                        X
                    </button>
                </div>

                {children}
            </section>
        </div>
    );
}

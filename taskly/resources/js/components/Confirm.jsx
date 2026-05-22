import React from "react";

export function Confirm({
    title,
    text,
    confirmText = "Conferma",
    cancelText = "Annulla",
    onConfirm,
    onCancel,
}) {
    return (
        <div className="fixed inset-0 z-70 grid place-items-center bg-[#101828]/35 px-4">
            <section className="w-full max-w-md rounded-xl bg-white p-5 shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
                <h2 className="mb-2 text-2xl font-extrabold text-[#101828]">
                    {title}
                </h2>
                <p className="mb-5 text-base leading-6 text-[#667085]">
                    {text}
                </p>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        className="btn btn-plain bg-[#f3f7fc]"
                        type="button"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="btn bg-red-500 text-white"
                        type="button"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </section>
        </div>
    );
}

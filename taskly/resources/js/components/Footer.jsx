import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="border-t border-blue-100 bg-white/90">
            <div className="mx-auto grid min-h-16 w-[min(1180px,calc(100%-28px))] grid-cols-1 items-center gap-3 py-4 text-sm text-[#64748b] md:grid-cols-3">
                <Link
                    className="inline-flex items-center justify-center gap-2 font-extrabold text-[#172033] md:justify-start"
                    to="/"
                    aria-label="Taskly home"
                >
                    <img className="h-8 w-8 rounded-lg" src="/assets/taskly-logo.svg" alt="" />
                    <span>Taskly</span>
                </Link>

                <p className="text-center text-xs sm:text-sm">
                    &copy; 2026 Taskly
                </p>

            </div>
        </footer>
    );
}

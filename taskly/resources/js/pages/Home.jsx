import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

export function Home() {
    return (
        <main className="flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_18%_24%,#dbeafe_0,#eef6ff_28%,transparent_45%),linear-gradient(120deg,#f8fbff_0%,#eef7ff_52%,#fffaf4_100%)] text-[#172033]">
            <nav
                className="mx-auto flex w-[min(1180px,calc(100%-40px))] flex-wrap items-center justify-between gap-4 py-6 max-sm:w-[min(100%-28px,1180px)]"
                aria-label="Navigazione principale"
            >
                <Link
                    className="inline-flex items-center gap-3 text-2xl font-extrabold text-[#0b1324]"
                    to="/"
                    aria-label="Taskly home"
                >
                    <img
                        className="h-12 w-12 rounded-xl shadow-[0_14px_28px_rgba(37,99,235,0.20)]"
                        src="/assets/taskly-logo.svg"
                        alt=""
                    />
                    <span>Taskly</span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                        className="inline-flex h-10 items-center justify-center rounded-lg px-3 text-sm font-extrabold text-[#0b1324] transition hover:bg-white/70 sm:px-4 sm:text-base"
                        to="/accedi"
                    >
                        Accedi
                    </Link>
                    <Link
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white shadow-[0_16px_28px_rgba(37,99,235,0.24)] transition hover:-translate-y-px hover:bg-[#1d4ed8] sm:px-5 sm:text-base"
                        to="/registrati"
                    >
                        Registrati
                    </Link>
                </div>
            </nav>

            <section className="mx-auto grid flex-1 w-[min(1180px,calc(100%-40px))] grid-cols-[minmax(0,1.1fr)_480px] items-center gap-20 pb-16 pt-8 max-[1239px]:grid-cols-1 max-[1239px]:gap-12 max-[1239px]:py-12 max-sm:w-[min(100%-28px,1180px)]">
                <div className="max-w-172.5">
                    <p className="mb-4 inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-normal text-[#2563eb] shadow-[0_12px_35px_rgba(37,99,235,0.10)]">
                        Task condivisi, liste personali, bacheche pulite
                    </p>
                    <h1 className="m-0 text-[clamp(3.3rem,5.9vw,5.4rem)] font-bold leading-[0.98] tracking-normal text-[#172033] max-sm:text-[clamp(2.7rem,14vw,4rem)]">
                        Organizza tutto senza perdere il filo.
                    </h1>
                    <p className="mt-7 mb-8 max-w-155 text-[1.13rem] leading-8 text-[#5f6f86] max-sm:text-base">
                        Taskly ti aiuta a creare bacheche, usare tag colorati,
                        invitare altri utenti e assegnare ruoli chiari per collaborare
                        senza confusione.
                    </p>
                    <Link
                        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#2563eb] px-10 font-extrabold text-white shadow-[0_16px_30px_rgba(37,99,235,0.23)] transition hover:-translate-y-px hover:bg-[#1d4ed8] sm:w-auto"
                        to="/registrati"
                    >
                        Inizia ora!
                    </Link>

                    <div className="mt-9 grid max-w-150 grid-cols-3 gap-3 max-sm:grid-cols-1">
                        <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
                            <p className="text-2xl font-extrabold text-[#2563eb]">Task </p>
                            <p className="mt-1 text-sm font-bold text-[#64748b]">organizzate</p>
                        </div>
                        <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
                            <p className="text-2xl font-extrabold text-[#2563eb]">Colori</p>
                            <p className="mt-1 text-sm font-bold text-[#64748b]">personalizzabili</p>
                        </div>
                        <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
                            <p className="text-2xl font-extrabold text-[#2563eb]">Ruoli</p>
                            <p className="mt-1 text-sm font-bold text-[#64748b]">condivisi</p>
                        </div>
                    </div>
                </div>

                <div
                    className="relative rounded-xl bg-white/85 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.14)] "
                    aria-label="Esempio di bacheca Taskly"
                >
                    <div className="mb-5 flex items-center justify-between border-b border-[#e2e8f0] pb-4">
                        <div>
                            <p className="text-xs font-extrabold uppercase text-[#2563eb]">Ruolo</p>
                            <h2 className="mt-1 text-2xl font-extrabold text-[#172033]">Bacheca Esempio</h2>
                        </div>
                    </div>

                    <section className="mb-4 rounded-lg border border-[#dbe3ee] bg-white p-3.5">
                        <h3 className="mb-3 text-sm font-extrabold text-[#172033]">Da fare</h3>
                        <article className="mb-3 flex h-10 items-center gap-3 rounded-lg bg-[#f7f9fc] px-3">
                            <span className="rounded-full bg-[#fee2e2] px-2 py-1 text-xs font-extrabold text-[#b91c1c]">Urgente</span>
                            <p className="text-base font-extrabold text-[#202938]">Consegna progetto</p>
                        </article>
                        <article className="flex h-10 items-center gap-3 rounded-lg bg-[#f7f9fc] px-3">
                            <span className="rounded-full bg-[#ede9fe] px-2 py-1 text-xs font-extrabold text-[#6d28d9]">Studio</span>
                            <p className="text-base font-extrabold text-[#202938]">Studiare Matematica</p>
                        </article>
                    </section>

                    <section className="mb-4 rounded-lg border border-[#dbe3ee] bg-white p-3.5">
                        <h3 className="mb-3 text-sm font-extrabold text-[#172033]">In corso</h3>
                        <article className="flex h-10 items-center gap-3 rounded-lg bg-[#f7f9fc] px-3">
                            <span className="rounded-full bg-[#e0f2fe] px-2 py-1 text-xs font-extrabold text-[#0369a1]">Lavoro</span>
                            <p className="text-base font-extrabold text-[#202938]">Riunione alle 10:00</p>
                        </article>
                    </section>

                    <section className="rounded-lg border border-[#dbe3ee] bg-white p-3.5">
                        <h3 className="mb-3 text-sm font-extrabold text-[#172033]">Completate</h3>
                        <article className="flex h-10 items-center gap-3 rounded-lg bg-[#f7f9fc] px-3">
                            <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-xs font-extrabold text-[#15803d]">Spesa</span>
                            <p className="text-base font-extrabold text-[#202938]">Comprare il latte</p>
                        </article>
                    </section>
                </div>
            </section>
            <Footer />
        </main>
    );
}

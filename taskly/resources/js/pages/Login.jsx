import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get('email') || '').trim();
        const password = String(formData.get('password') || '');

        setError('');

        try {
            await window.axios.get('/sanctum/csrf-cookie');
            await window.axios.post('/api/login', { email, password });
            navigate('/taskly');
        } catch (error) {
            const message = error.response?.data?.message;
            setError(message || 'Email o password non corretti.');
        }
    }

    return (
        <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_20%_15%,rgba(91,169,255,0.18),transparent_24rem),linear-gradient(135deg,#ffffff_0%,#f8fcff_48%,#eaf6ff_100%)] px-4 py-8 text-[#102033] sm:px-6 sm:py-10">
            <section className="auth-card">
                <Link
                    className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#1761c8] transition hover:text-[#0f5fc9]"
                    to="/"
                >
                    <span aria-hidden="true">←</span>
                    Torna alla home
                </Link>

                <div className="mb-8 text-center">
                    <Link
                        className="mx-auto mb-4 block h-14 w-14"
                        to="/"
                        aria-label="Torna alla home di Taskly"
                    >
                        <img
                            className="h-14 w-14 rounded-xl shadow-[0_14px_30px_rgba(29,116,245,0.24)]"
                            src="/assets/taskly-logo.svg"
                            alt=""
                        />
                    </Link>
                    <h1 className="mb-2 text-3xl font-extrabold">Taskly</h1>
                    <p className="text-sm leading-6 text-[#4b657f]">
                        Accedi al tuo account per gestire bacheche, liste e task.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

                    <input
                        className="input"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        aria-label="Email"
                        required
                    />

                    <input
                        className="input"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        aria-label="Password"
                        required
                    />

                    <button
                        className="btn btn-blue btn-full mt-2"
                        type="submit"
                    >
                        Accedi
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#4b657f]">
                    Non hai un account?{' '}
                    <Link className="font-bold text-[#1761c8] hover:text-[#0f5fc9]" to="/registrati">
                        Registrati
                    </Link>
                </p>
            </section>
        </main>
    );
}

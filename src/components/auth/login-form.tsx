"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const router = useRouter();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = (await res.json()) as { message?: string };

            if (!res.ok) {
                setError(data.message ?? "Giriş başarısız.");
                return;
            }

            router.replace("/dashboard");
            router.refresh();
        } catch {
            setError("Sunucuya ulaşılamadı.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-[1.75rem] border border-white/10 bg-slate-900/55 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                    Kullanıcı Adı
                </label>
                <input
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
                    placeholder="Kullanıcı adınızı girin"
                    value={form.username}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, username: e.target.value }))
                    }
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Şifre</label>
                <input
                    type="password"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400/60"
                    placeholder="Şifrenizi girin"
                    value={form.password}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                />
            </div>

            {error ? (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                </div>
            ) : null}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500 px-4 py-3 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Giriş yapılıyor..." : "Sisteme Giriş Yap"}
            </button>
        </form>
    );
}
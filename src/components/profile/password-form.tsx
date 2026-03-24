"use client";

import { useState } from "react";

export function PasswordForm() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/profile/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message ?? "Şifre güncellenemedi.");
                return;
            }

            setMessage("Şifre başarıyla güncellendi.");
            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch {
            setError("Sunucuya ulaşılamadı.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="grid gap-4 md:grid-cols-1">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Mevcut Şifre
                    </label>
                    <input
                        type="password"
                        value={form.currentPassword}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, currentPassword: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                        placeholder="Mevcut şifreniz"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Yeni Şifre</label>
                    <input
                        type="password"
                        value={form.newPassword}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, newPassword: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-fuchsia-400 focus:bg-white"
                        placeholder="Yeni şifre"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Yeni Şifre Tekrar
                    </label>
                    <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, confirmPassword: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-fuchsia-400 focus:bg-white"
                        placeholder="Yeni şifre tekrar"
                    />
                </div>
            </div>

            {message ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                </div>
            ) : null}

            {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            ) : null}

            <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 font-bold text-white shadow-md transition hover:scale-[1.01] disabled:opacity-60"
            >
                {loading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
            </button>
        </form>
    );
}
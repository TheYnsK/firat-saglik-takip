"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    initialValues: {
        fullName: string;
        username: string;
        role: string;
    };
};

export function ProfileForm({ initialValues }: Props) {
    const router = useRouter();

    const [form, setForm] = useState({
        fullName: initialValues.fullName,
        username: initialValues.username,
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
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message ?? "Profil güncellenemedi.");
                return;
            }

            setMessage("Profil bilgileri başarıyla güncellendi.");
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
            className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Ad Soyad</label>
                    <input
                        value={form.fullName}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, fullName: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                        placeholder="Ad soyad"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Kullanıcı Adı
                    </label>
                    <input
                        value={form.username}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, username: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                        placeholder="Kullanıcı adı"
                    />
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold text-slate-500">Rol</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                    {initialValues.role === "admin" ? "Yönetici" : "Kullanıcı"}
                </p>
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
                {loading ? "Kaydediliyor..." : "Profil Bilgilerini Güncelle"}
            </button>
        </form>
    );
}
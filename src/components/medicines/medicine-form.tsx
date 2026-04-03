"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type Props = {
    mode?: "create" | "edit";
    medicineId?: string;
    initialValues?: {
        name: string;
        type: string;
        measure: string;
        note: string;
        lowStockThreshold: number;
    };
};

export function MedicineForm({
                                 mode = "create",
                                 medicineId,
                                 initialValues,
                             }: Props) {
    const router = useRouter();

    const [form, setForm] = useState({
        name: initialValues?.name ?? "",
        type: initialValues?.type ?? "",
        measure: initialValues?.measure ?? "",
        note: initialValues?.note ?? "",
        lowStockThreshold: initialValues?.lowStockThreshold ?? 0,
    });

    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch(
                mode === "edit" && medicineId ? `/api/medicines/${medicineId}` : "/api/medicines",
                {
                    method: mode === "edit" ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.message ?? "Kayıt başarısız.");
                return;
            }

            setMessage(
                mode === "edit"
                    ? "İlaç başarıyla güncellendi."
                    : "İlaç başarıyla eklendi."
            );

            if (mode === "create") {
                setForm({
                    name: "",
                    type: "",
                    measure: "",
                    note: "",
                    lowStockThreshold: 0,
                });
            }

            router.refresh();
        } catch {
            setError("Sunucuya ulaşılamadı.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteConfirmed() {
        if (!medicineId) return;

        setDeleteLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch(`/api/medicines/${medicineId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message ?? "Silme işlemi başarısız.");
                setConfirmOpen(false);
                return;
            }

            setConfirmOpen(false);
            router.push("/medicines/list/edit");
            router.refresh();
        } catch {
            setError("Sunucuya ulaşılamadı.");
            setConfirmOpen(false);
        } finally {
            setDeleteLoading(false);
        }
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">İlaç Adı</label>
                        <input
                            placeholder="Örn: Parol"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Tür</label>
                        <input
                            placeholder="Örn: Tablet, Ampul, Şurup"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                            value={form.type}
                            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Ölçü</label>
                        <input
                            placeholder="Örn: 500 mg / 10 ml"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                            value={form.measure}
                            onChange={(e) => setForm((p) => ({ ...p, measure: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Düşük Stok Limiti
                        </label>
                        <input
                            type="number"
                            min={0}
                            placeholder="Örn: 20"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-400 focus:bg-white"
                            value={form.lowStockThreshold}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    lowStockThreshold: Number(e.target.value),
                                }))
                            }
                        />
                        <p className="text-xs leading-5 text-slate-500">
                            Toplam stok bu sayının altına düştüğünde sistem düşük stok uyarısı verir.
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Not</label>
                    <textarea
                        placeholder="İlaca dair ek bilgi yazabilirsiniz."
                        rows={4}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                        value={form.note}
                        onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                    />
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

                <div className="flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={loading || deleteLoading}
                        className="rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 font-bold text-white shadow-md transition hover:scale-[1.01] disabled:opacity-60"
                    >
                        {loading
                            ? "Kaydediliyor..."
                            : mode === "edit"
                                ? "İlacı Güncelle"
                                : "İlacı Kaydet"}
                    </button>

                    {mode === "edit" ? (
                        <button
                            type="button"
                            onClick={() => setConfirmOpen(true)}
                            disabled={loading || deleteLoading}
                            className="rounded-2xl bg-rose-600 px-5 py-3 font-bold text-white shadow-md transition hover:bg-rose-700 disabled:opacity-60"
                        >
                            Sil
                        </button>
                    ) : null}
                </div>
            </form>

            <ConfirmDialog
                open={confirmOpen}
                title="İlaç kaydını sil"
                description="Bu ilaç kaydını silmek istediğinize emin misiniz? Eğer bu ilaca bağlı ilaç kayıtları varsa silme işlemi gerçekleşmez."
                confirmText="Evet, sil"
                cancelText="Vazgeç"
                loading={deleteLoading}
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );
}
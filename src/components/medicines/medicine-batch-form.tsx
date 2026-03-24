"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type MedicineOption = {
    _id: string;
    name: string;
    type: string;
    measure: string;
};

type Props = {
    mode?: "create" | "edit";
    batchId?: string;
    initialValues?: {
        medicineId: string;
        barcode: string;
        batchNo: string;
        expiryDate: string;
        stockQuantity: number;
        receivedAt: string;
        note: string;
    };
};

export function MedicineBatchForm({
                                      mode = "create",
                                      batchId,
                                      initialValues,
                                  }: Props) {
    const router = useRouter();

    const [medicines, setMedicines] = useState<MedicineOption[]>([]);
    const [loadingMedicines, setLoadingMedicines] = useState(true);

    const [form, setForm] = useState({
        medicineId: initialValues?.medicineId ?? "",
        barcode: initialValues?.barcode ?? "",
        batchNo: initialValues?.batchNo ?? "",
        expiryDate: initialValues?.expiryDate ?? "",
        stockQuantity: initialValues?.stockQuantity ?? 0,
        receivedAt: initialValues?.receivedAt ?? "",
        note: initialValues?.note ?? "",
    });

    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        async function loadMedicines() {
            try {
                const res = await fetch("/api/medicines");
                const data = await res.json();
                setMedicines(data.items ?? []);
            } catch {
                setMedicines([]);
            } finally {
                setLoadingMedicines(false);
            }
        }

        loadMedicines();
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch(
                mode === "edit" && batchId ? `/api/medicine-batches/${batchId}` : "/api/medicine-batches",
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
                setError(data.message ?? "Parti kaydı başarısız.");
                return;
            }

            setMessage(
                mode === "edit"
                    ? "Parti kaydı başarıyla güncellendi."
                    : "Parti kaydı başarıyla eklendi."
            );

            if (mode === "create") {
                setForm({
                    medicineId: "",
                    barcode: "",
                    batchNo: "",
                    expiryDate: "",
                    stockQuantity: 0,
                    receivedAt: "",
                    note: "",
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
        if (!batchId) return;

        setDeleteLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch(`/api/medicine-batches/${batchId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message ?? "Silme işlemi başarısız.");
                setConfirmOpen(false);
                return;
            }

            setConfirmOpen(false);
            router.push("/medicines/batches/edit");
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
                        <label className="text-sm font-semibold text-slate-700">İlaç</label>
                        <select
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                            value={form.medicineId}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, medicineId: e.target.value }))
                            }
                            disabled={loadingMedicines}
                        >
                            <option value="">İlaç seçin</option>
                            {medicines.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.name} - {item.type} - {item.measure}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Barkod</label>
                        <input
                            placeholder="Barkod numarasını girin"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                            value={form.barcode}
                            onChange={(e) => setForm((p) => ({ ...p, barcode: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Parti No</label>
                        <input
                            placeholder="Örn: PRT-2026-001"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                            value={form.batchNo}
                            onChange={(e) => setForm((p) => ({ ...p, batchNo: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Son Kullanma Tarihi
                        </label>
                        <input
                            type="date"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                            value={form.expiryDate}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, expiryDate: e.target.value }))
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Stok Miktarı</label>
                        <input
                            type="number"
                            min={0}
                            placeholder="Örn: 50"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-fuchsia-400 focus:bg-white"
                            value={form.stockQuantity}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    stockQuantity: Number(e.target.value),
                                }))
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Parti Giriş Tarihi
                        </label>
                        <input
                            type="date"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                            value={form.receivedAt}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, receivedAt: e.target.value }))
                            }
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Not</label>
                    <textarea
                        rows={4}
                        placeholder="Parti ile ilgili ek bilgi yazabilirsiniz."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
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
                                ? "Parti Kaydını Güncelle"
                                : "Parti Kaydını Ekle"}
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
                title="Parti kaydını sil"
                description="Bu parti kaydını silmek istediğinize emin misiniz? Silme işleminden sonra bu partiye ait bilgiler geri alınamaz."
                confirmText="Evet, sil"
                cancelText="Vazgeç"
                loading={deleteLoading}
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );
}
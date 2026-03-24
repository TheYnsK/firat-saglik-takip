"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type MedicineItem = {
    _id: string;
    name: string;
    type: string;
    measure: string;
};

type BatchItem = {
    _id: string;
    medicineId: string;
    medicineName: string;
    barcode: string;
    batchNo: string;
    expiryDate: string;
    stockQuantity: number;
};

export function MedicineStockMovementForm() {
    const router = useRouter();

    const [medicines, setMedicines] = useState<MedicineItem[]>([]);
    const [batches, setBatches] = useState<BatchItem[]>([]);

    const [form, setForm] = useState({
        medicineId: "",
        batchId: "",
        transactionType: "IN" as "IN" | "OUT" | "ADJUSTMENT",
        quantity: 0,
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [medicinesRes, batchesRes] = await Promise.all([
                    fetch("/api/medicines"),
                    fetch("/api/medicine-batches/list"),
                ]);

                const medicinesData = await medicinesRes.json();
                const batchesData = await batchesRes.json();

                setMedicines(medicinesData.items ?? []);
                setBatches(batchesData.items ?? []);
            } catch {
                setMedicines([]);
                setBatches([]);
            } finally {
                setLoadingData(false);
            }
        }

        loadData();
    }, []);

    const filteredBatches = useMemo(
        () => batches.filter((item) => item.medicineId === form.medicineId),
        [batches, form.medicineId]
    );

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/medicine-transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message ?? "İşlem başarısız.");
                return;
            }

            setMessage("Stok hareketi başarıyla kaydedildi.");
            setForm({
                medicineId: "",
                batchId: "",
                transactionType: "IN",
                quantity: 0,
                description: "",
            });

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
                    <label className="text-sm font-semibold text-slate-700">İlaç</label>
                    <select
                        value={form.medicineId}
                        onChange={(e) =>
                            setForm((p) => ({
                                ...p,
                                medicineId: e.target.value,
                                batchId: "",
                            }))
                        }
                        disabled={loadingData}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
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
                    <label className="text-sm font-semibold text-slate-700">Parti</label>
                    <select
                        value={form.batchId}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, batchId: e.target.value }))
                        }
                        disabled={!form.medicineId || loadingData}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                    >
                        <option value="">Parti seçin</option>
                        {filteredBatches.map((item) => (
                            <option key={item._id} value={item._id}>
                                {item.batchNo} | Stok: {item.stockQuantity}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">İşlem Türü</label>
                    <select
                        value={form.transactionType}
                        onChange={(e) =>
                            setForm((p) => ({
                                ...p,
                                transactionType: e.target.value as "IN" | "OUT" | "ADJUSTMENT",
                            }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                    >
                        <option value="IN">Stok Girişi</option>
                        <option value="OUT">Stok Çıkışı</option>
                        <option value="ADJUSTMENT">Stok Düzeltme</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Miktar</label>
                    <input
                        type="number"
                        min={0}
                        placeholder="Örn: 10"
                        value={form.quantity}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, quantity: Number(e.target.value) }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-fuchsia-400 focus:bg-white"
                    />
                    <p className="text-xs text-slate-500">
                        Düzeltme işleminde yazdığınız sayı partinin yeni stok değeri olur.
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Açıklama</label>
                <textarea
                    rows={4}
                    placeholder="İşlem notu yazabilirsiniz."
                    value={form.description}
                    onChange={(e) =>
                        setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
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

            <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 font-bold text-white shadow-md transition hover:scale-[1.01] disabled:opacity-60"
            >
                {loading ? "Kaydediliyor..." : "Stok Hareketini Kaydet"}
            </button>
        </form>
    );
}
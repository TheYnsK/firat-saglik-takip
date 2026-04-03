"use client";

import { useState } from "react";
import { MedicineDetailCard } from "@/components/medicines/medicine-detail-card";

type ResultType = {
    medicine: {
        _id: string;
        name: string;
        type: string;
        measure: string;
        note: string;
        lowStockThreshold: number;
        totalStock: number;
        isLowStock: boolean;
    };
    batches: {
        _id: string;
        barcode: string;
        batchNo: string;
        expiryDate: string;
        stockQuantity: number;
        receivedAt: string;
        note: string;
    }[];
} | null;

export function MedicineControlSearch() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ResultType>(null);
    const [error, setError] = useState("");

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch(`/api/medicines/control?q=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.message ?? "Arama sırasında hata oluştu.");
                return;
            }

            if (!data.item) {
                setError("İlaç veya barkod kaydı bulunamadı.");
                return;
            }

            setResult(data.item);
        } catch {
            setError("Sunucuya ulaşılamadı.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <form
                onSubmit={handleSearch}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                        İlaç adı veya barkod ile arama
                    </label>
                    <div className="flex flex-col gap-3 md:flex-row">
                        <input
                            placeholder="Örn: Parol veya barkod numarası"
                            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 font-bold text-white shadow-md transition hover:scale-[1.01] disabled:opacity-60"
                        >
                            {loading ? "Sorgulanıyor..." : "Kontrol Et"}
                        </button>
                    </div>
                    <p className="text-xs leading-5 text-slate-500">
                        Barkod okutulduğunda veya ilaç adı yazıldığında, ilacın tüm kayıt ve
                        stok bilgileri aşağıda görüntülenir.
                    </p>
                </div>
            </form>

            {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            ) : null}

            {result ? (
                <MedicineDetailCard medicine={result.medicine} batches={result.batches} />
            ) : null}
        </div>
    );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type Props = {
    mode?: "create" | "edit";
    productId?: string;
    initialValues?: {
        name: string;
        barcode: string;
        type: string;
        stockQuantity: number;
        lowStockThreshold: number;
        hasExpiry: boolean;
        expiryDate: string;
        note: string;
    };
};

export function ProductForm({
                                mode = "create",
                                productId,
                                initialValues,
                            }: Props) {
    const router = useRouter();

    const [form, setForm] = useState({
        name: initialValues?.name ?? "",
        barcode: initialValues?.barcode ?? "",
        type: initialValues?.type ?? "",
        stockQuantity: initialValues?.stockQuantity ?? 0,
        lowStockThreshold: initialValues?.lowStockThreshold ?? 0,
        hasExpiry: initialValues?.hasExpiry ?? false,
        expiryDate: initialValues?.expiryDate ?? "",
        note: initialValues?.note ?? "",
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
                mode === "edit" && productId ? `/api/products/${productId}` : "/api/products",
                {
                    method: mode === "edit" ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...form,
                        expiryDate: form.hasExpiry ? form.expiryDate : null,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.message ?? "Kayıt başarısız.");
                return;
            }

            setMessage(
                mode === "edit"
                    ? "Ürün başarıyla güncellendi."
                    : "Ürün başarıyla eklendi."
            );

            if (mode === "create") {
                setForm({
                    name: "",
                    barcode: "",
                    type: "",
                    stockQuantity: 0,
                    lowStockThreshold: 0,
                    hasExpiry: false,
                    expiryDate: "",
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
        if (!productId) return;

        setDeleteLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message ?? "Silme işlemi başarısız.");
                setConfirmOpen(false);
                return;
            }

            setConfirmOpen(false);
            router.push("/products/list/edit");
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
                        <label className="text-sm font-semibold text-slate-700">Ürün Adı</label>
                        <input
                            placeholder="Örn: Eldiven"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Barkod</label>
                        <input
                            placeholder="Barkod numarası"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                            value={form.barcode}
                            onChange={(e) => setForm((p) => ({ ...p, barcode: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Tür</label>
                        <input
                            placeholder="Örn: Medikal Sarf"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                            value={form.type}
                            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Stok</label>
                        <input
                            type="number"
                            min={0}
                            placeholder="Örn: 100"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                            value={form.stockQuantity}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, stockQuantity: Number(e.target.value) }))
                            }
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
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-fuchsia-400 focus:bg-white"
                            value={form.lowStockThreshold}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    lowStockThreshold: Number(e.target.value),
                                }))
                            }
                        />
                        <p className="text-xs text-slate-500">
                            Stok bu sayının altına düştüğünde uyarı gösterilir.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <input
                                type="checkbox"
                                checked={form.hasExpiry}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        hasExpiry: e.target.checked,
                                        expiryDate: e.target.checked ? p.expiryDate : "",
                                    }))
                                }
                            />
                            Son kullanma tarihi var
                        </label>

                        <input
                            type="date"
                            disabled={!form.hasExpiry}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none disabled:opacity-50"
                            value={form.expiryDate}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, expiryDate: e.target.value }))
                            }
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Not</label>
                    <textarea
                        rows={4}
                        placeholder="Ürüne dair ek bilgi yazabilirsiniz."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
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
                                ? "Ürünü Güncelle"
                                : "Ürünü Kaydet"}
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
                title="Ürün kaydını sil"
                description="Bu ürün kaydını silmek istediğinize emin misiniz?"
                confirmText="Evet, sil"
                cancelText="Vazgeç"
                loading={deleteLoading}
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );
}
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ProductItem = {
    _id: string;
    name: string;
    barcode: string;
    type: string;
    stockQuantity: number;
};

export function ProductStockForm() {
    const router = useRouter();

    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const [barcode, setBarcode] = useState("");
    const [barcodeMessage, setBarcodeMessage] = useState("");
    const [barcodeError, setBarcodeError] = useState("");

    const [form, setForm] = useState({
        productId: "",
        transactionType: "IN" as "IN" | "OUT" | "ADJUSTMENT",
        quantity: 0,
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const lookupTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                setProducts(data.items ?? []);
            } catch {
                setProducts([]);
            } finally {
                setLoadingData(false);
            }
        }

        loadProducts();
    }, []);

    const selectedProduct = useMemo(
        () => products.find((item) => item._id === form.productId) ?? null,
        [products, form.productId]
    );

    function applyBarcodeLookup(rawBarcode: string) {
        const normalized = rawBarcode.trim();

        setBarcodeError("");
        setBarcodeMessage("");

        if (!normalized) return;

        const matchedProduct = products.find((item) => item.barcode === normalized);

        if (!matchedProduct) {
            setBarcodeError("Bu barkoda ait ürün bulunamadı.");
            return;
        }

        setForm((prev) => ({
            ...prev,
            productId: matchedProduct._id,
        }));

        setBarcodeMessage(`${matchedProduct.name} ürünü otomatik seçildi.`);
    }

    useEffect(() => {
        if (!barcode.trim() || loadingData || products.length === 0) {
            return;
        }

        if (lookupTimerRef.current) {
            clearTimeout(lookupTimerRef.current);
        }

        lookupTimerRef.current = setTimeout(() => {
            applyBarcodeLookup(barcode);
        }, 150);

        return () => {
            if (lookupTimerRef.current) {
                clearTimeout(lookupTimerRef.current);
            }
        };
    }, [barcode, loadingData, products]);

    function handleBarcodeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (lookupTimerRef.current) {
                clearTimeout(lookupTimerRef.current);
            }
            applyBarcodeLookup(barcode);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/product-transactions", {
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

            setMessage("Ürün stok hareketi başarıyla kaydedildi.");
            setBarcode("");
            setBarcodeMessage("");
            setBarcodeError("");
            setForm({
                productId: "",
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
            <div className="rounded-3xl border border-cyan-200 bg-cyan-50/60 p-5">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Barkod ile ürün bul
                    </label>

                    <div className="flex flex-col gap-3 md:flex-row">
                        <input
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            onKeyDown={handleBarcodeKeyDown}
                            placeholder="Ürün barkodunu okutun veya yazın"
                            className="flex-1 rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                        />


                    </div>

                    <p className="text-xs leading-5 text-slate-500">
                        Barkod okutulduğu anda ilgili ürün otomatik seçilir. Dilerseniz aşağıdan
                        manuel seçim yapmaya devam edebilirsiniz.
                    </p>
                </div>

                {barcodeMessage ? (
                    <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {barcodeMessage}
                    </div>
                ) : null}

                {barcodeError ? (
                    <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {barcodeError}
                    </div>
                ) : null}
            </div>

            {selectedProduct ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-bold text-slate-800">Seçilen Ürün</h3>
                    <div className="mt-2 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                        <div>
                            <span className="font-semibold text-slate-800">Ürün:</span>{" "}
                            {selectedProduct.name}
                        </div>
                        <div>
                            <span className="font-semibold text-slate-800">Tür:</span>{" "}
                            {selectedProduct.type}
                        </div>
                        <div>
                            <span className="font-semibold text-slate-800">Barkod:</span>{" "}
                            {selectedProduct.barcode}
                        </div>
                        <div>
                            <span className="font-semibold text-slate-800">Mevcut Stok:</span>{" "}
                            {selectedProduct.stockQuantity}
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Ürün</label>
                    <select
                        value={form.productId}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, productId: e.target.value }))
                        }
                        disabled={loadingData}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-400 focus:bg-white"
                    >
                        <option value="">Ürün seçin</option>
                        {products.map((item) => (
                            <option key={item._id} value={item._id}>
                                {item.name} | Barkod: {item.barcode} | Stok: {item.stockQuantity}
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
                        Düzeltme işleminde yazdığınız sayı ürünün yeni stok değeri olur.
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
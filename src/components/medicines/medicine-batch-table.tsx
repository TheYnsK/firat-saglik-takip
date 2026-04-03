"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {formatDateTR} from "@/lib/date";

type BatchItem = {
    _id: string;
    medicineName: string;
    barcode: string;
    expiryDate: string;
    stockQuantity: number;
    receivedAt: string;
    note: string;
};

type Props = {
    items: BatchItem[];
    showActions?: boolean;
};

export function MedicineBatchTable({ items, showActions = false }: Props) {
    const [query, setQuery] = useState("");

    const filteredItems = useMemo(() => {
        const normalized = query.trim().toLocaleLowerCase("tr-TR");

        if (!normalized) return items;

        return items.filter((item) => {
            const searchableText = [
                item.medicineName,
                item.barcode,
                item.note,
            ]
                .join(" ")
                .toLocaleLowerCase("tr-TR");

            return searchableText.includes(normalized);
        });
    }, [items, query]);

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    İlaç adı veya barkod ile ara
                </label>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Örn: Parol veya barkod numarası"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                />
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-left text-slate-600">
                        <tr>
                            <th className="px-4 py-3 font-semibold">İlaç Adı</th>
                            <th className="px-4 py-3 font-semibold">Barkod</th>
                            <th className="px-4 py-3 font-semibold">SKT</th>
                            <th className="px-4 py-3 font-semibold">Stok</th>
                            <th className="px-4 py-3 font-semibold">Giriş Tarihi</th>
                            <th className="px-4 py-3 font-semibold">Not</th>
                            {showActions ? <th className="px-4 py-3 font-semibold">İşlem</th> : null}
                        </tr>
                        </thead>

                        <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item._id} className="border-t border-slate-100">
                                <td className="px-4 py-3 font-semibold text-slate-900">
                                    {item.medicineName}
                                </td>
                                <td className="px-4 py-3 text-slate-700">{item.barcode}</td>
                                <td className="px-4 py-3 text-slate-700">
                                    formatDateTR(item.expiryDate)

                                </td>
                                <td className="px-4 py-3 text-slate-700">{item.stockQuantity}</td>
                                <td className="px-4 py-3 text-slate-700">
                                    {new Date(item.receivedAt).toLocaleDateString("tr-TR")}
                                </td>
                                <td className="px-4 py-3 text-slate-700">{item.note || "-"}</td>
                                {showActions ? (
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/medicines/batches/edit/${item._id}`}
                                            className="rounded-xl bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
                                        >
                                            Düzenle / Sil
                                        </Link>
                                    </td>
                                ) : null}
                            </tr>
                        ))}

                        {filteredItems.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={showActions ? 7 : 6}
                                    className="px-4 py-10 text-center text-slate-500"
                                >
                                    Aramaya uygun kayıt bulunamadı.
                                </td>
                            </tr>
                        ) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
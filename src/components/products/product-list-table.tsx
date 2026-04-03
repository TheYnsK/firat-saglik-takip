import Link from "next/link";
import type { ProductSummaryItem } from "@/types/product";
import {formatDateTR} from "@/lib/date";

type Props = {
    items: ProductSummaryItem[];
    showActions?: boolean;
};

export function ProductListTable({ items, showActions = false }: Props) {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                        <th className="px-4 py-3 font-semibold">Ürün Adı</th>
                        <th className="px-4 py-3 font-semibold">Barkod</th>
                        <th className="px-4 py-3 font-semibold">Tür</th>
                        <th className="px-4 py-3 font-semibold">Stok</th>
                        <th className="px-4 py-3 font-semibold">Düşük Stok Limiti</th>
                        <th className="px-4 py-3 font-semibold">SKT</th>
                        <th className="px-4 py-3 font-semibold">Durum</th>
                        {showActions ? <th className="px-4 py-3 font-semibold">İşlem</th> : null}
                    </tr>
                    </thead>

                    <tbody>
                    {items.map((item) => (
                        <tr key={item._id} className="border-t border-slate-100">
                            <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                            <td className="px-4 py-3 text-slate-700">{item.barcode}</td>
                            <td className="px-4 py-3 text-slate-700">{item.type}</td>
                            <td className="px-4 py-3 text-slate-700">{item.stockQuantity}</td>
                            <td className="px-4 py-3 text-slate-700">{item.lowStockThreshold}</td>
                            <td className="px-4 py-3 text-slate-700">
                                {item.hasExpiry && item.expiryDate
                                    ? formatDateTR(item.expiryDate)
                                    : "-"}
                            </td>
                            <td className="px-4 py-3">
                                {item.isExpired ? (
                                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                      SKT Geçmiş
                    </span>
                                ) : item.isExpiringSoon ? (
                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      SKT Yaklaşan
                    </span>
                                ) : item.isLowStock ? (
                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      Düşük Stok
                    </span>
                                ) : (
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Normal
                    </span>
                                )}
                            </td>
                            {showActions ? (
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/products/list/edit/${item._id}`}
                                        className="rounded-xl bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
                                    >
                                        Düzenle / Sil
                                    </Link>
                                </td>
                            ) : null}
                        </tr>
                    ))}

                    {items.length === 0 ? (
                        <tr>
                            <td
                                colSpan={showActions ? 8 : 7}
                                className="px-4 py-10 text-center text-slate-500"
                            >
                                Henüz ürün kaydı bulunmuyor.
                            </td>
                        </tr>
                    ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
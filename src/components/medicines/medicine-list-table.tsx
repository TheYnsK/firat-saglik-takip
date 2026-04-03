import Link from "next/link";
import type { MedicineSummaryItem } from "@/types/medicine";

type Props = {
    items: MedicineSummaryItem[];
    showActions?: boolean;
};

export function MedicineListTable({ items, showActions = false }: Props) {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                        <th className="px-4 py-3 font-semibold">İlaç Adı</th>
                        <th className="px-4 py-3 font-semibold">Tür</th>
                        <th className="px-4 py-3 font-semibold">Ölçü</th>
                        <th className="px-4 py-3 font-semibold">Toplam Stok</th>
                        <th className="px-4 py-3 font-semibold">Düşük Stok Limiti</th>
                        <th className="px-4 py-3 font-semibold">Kayıt Sayısı</th>
                        <th className="px-4 py-3 font-semibold">Not</th>
                        {showActions ? <th className="px-4 py-3 font-semibold">İşlem</th> : null}
                    </tr>
                    </thead>

                    <tbody>
                    {items.map((item) => (
                        <tr key={item._id} className="border-t border-slate-100">
                            <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                            <td className="px-4 py-3 text-slate-700">{item.type}</td>
                            <td className="px-4 py-3 text-slate-700">{item.measure}</td>
                            <td className="px-4 py-3 text-slate-700">{item.totalStock}</td>
                            <td className="px-4 py-3 text-slate-700">{item.lowStockThreshold}</td>
                            <td className="px-4 py-3 text-slate-700">{item.batchCount}</td>
                            <td className="px-4 py-3 text-slate-700">{item.note || "-"}</td>
                            {showActions ? (
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/medicines/list/edit/${item._id}`}
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
                                Kayıt bulunamadı.
                            </td>
                        </tr>
                    ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
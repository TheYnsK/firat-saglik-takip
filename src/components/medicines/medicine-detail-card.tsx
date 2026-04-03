import { formatDateTR } from "@/lib/date";

type BatchDetail = {
    _id: string;
    barcode: string;
    expiryDate: string;
    stockQuantity: number;
    receivedAt: string;
    note: string;
};

type Props = {
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
    batches: BatchDetail[];
};

export function MedicineDetailCard({ medicine, batches }: Props) {
    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">{medicine.name}</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            {medicine.type} · {medicine.measure}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            {medicine.note || "Not bulunmuyor."}
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold text-slate-500">Toplam Stok</p>
                            <p className="mt-1 text-xl font-black text-slate-900">
                                {medicine.totalStock}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold text-slate-500">
                                Düşük Stok Limiti
                            </p>
                            <p className="mt-1 text-xl font-black text-slate-900">
                                {medicine.lowStockThreshold}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    {medicine.isLowStock ? (
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
              Düşük stok uyarısı aktif
            </span>
                    ) : (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Stok durumu normal
            </span>
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                    <h4 className="text-lg font-bold text-slate-800">Kayıt Detayları</h4>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-left text-slate-600">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Barkod</th>
                            <th className="px-4 py-3 font-semibold">SKT</th>
                            <th className="px-4 py-3 font-semibold">Stok</th>
                            <th className="px-4 py-3 font-semibold">Giriş Tarihi</th>
                            <th className="px-4 py-3 font-semibold">Not</th>
                        </tr>
                        </thead>
                        <tbody>
                        {batches.map((batch) => (
                            <tr key={batch._id} className="border-t border-slate-100">
                                <td className="px-4 py-3 text-slate-700">{batch.barcode}</td>
                                <td className="px-4 py-3 text-slate-700">
                                    {formatDateTR(batch.expiryDate)}
                                </td>
                                <td className="px-4 py-3 text-slate-700">{batch.stockQuantity}</td>
                                <td className="px-4 py-3 text-slate-700">
                                    {formatDateTR(batch.receivedAt)}
                                </td>
                                <td className="px-4 py-3 text-slate-700">{batch.note || "-"}</td>
                            </tr>
                        ))}

                        {batches.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                                    Bu ilaç için kayıt bulunmuyor.
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
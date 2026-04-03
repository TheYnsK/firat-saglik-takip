import {formatDateTR} from "@/lib/date";

type Props = {
    item: {
        _id: string;
        name: string;
        barcode: string;
        type: string;
        stockQuantity: number;
        lowStockThreshold: number;
        hasExpiry: boolean;
        expiryDate: string | null;
        note: string;
        isLowStock: boolean;
        isExpired: boolean;
        isExpiringSoon: boolean;
    };
};

export function ProductDetailCard({ item }: Props) {
    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">{item.name}</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            {item.type} · Barkod: {item.barcode}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            {item.note || "Not bulunmuyor."}
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold text-slate-500">Stok</p>
                            <p className="mt-1 text-xl font-black text-slate-900">
                                {item.stockQuantity}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold text-slate-500">
                                Düşük Stok Limiti
                            </p>
                            <p className="mt-1 text-xl font-black text-slate-900">
                                {item.lowStockThreshold}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {item.isExpired ? (
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
              SKT Geçmiş
            </span>
                    ) : item.isExpiringSoon ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              SKT Yaklaşan
            </span>
                    ) : null}

                    {item.isLowStock ? (
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              Düşük stok uyarısı aktif
            </span>
                    ) : (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Stok durumu normal
            </span>
                    )}

                    {item.hasExpiry && item.expiryDate ? (
                        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
              SKT: formatDateTR(item.expiryDate)
            </span>
                    ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              SKT takibi yok
            </span>
                    )}
                </div>
            </div>
        </div>
    );
}
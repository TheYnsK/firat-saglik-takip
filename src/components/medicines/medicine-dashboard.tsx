import {formatDateTR} from "@/lib/date";

type ExpiryItem = {
    _id: string;
    medicineName: string;
    barcode?: string;
    expiryDate: string;
    stockQuantity: number;
};

type Props = {
    totalMedicineCount: number;
    lowStockCount: number;
    expiringCount: number;
    expiredCount: number;
    lowStockItems: string[];
    expiringList: ExpiryItem[];
    expiredList: ExpiryItem[];
};

export function MedicineDashboard({
                                      totalMedicineCount,
                                      lowStockCount,
                                      expiringCount,
                                      expiredCount,
                                      lowStockItems,
                                      expiringList,
                                      expiredList,
                                  }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Toplam İlaç Sayısı</p>
                    <h3 className="mt-3 text-3xl font-black text-slate-900">
                        {totalMedicineCount}
                    </h3>
                </div>

                <div className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Düşük Stok Uyarısı</p>
                    <h3 className="mt-3 text-3xl font-black text-rose-600">
                        {lowStockCount}
                    </h3>
                </div>

                <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        SKT Yaklaşan Kayıt Sayısı
                    </p>
                    <h3 className="mt-3 text-3xl font-black text-amber-600">
                        {expiringCount}
                    </h3>
                </div>

                <div className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        SKT Geçmiş Kayıt Sayısı
                    </p>
                    <h3 className="mt-3 text-3xl font-black text-rose-700">
                        {expiredCount}
                    </h3>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">
                        Düşük stokta olan ilaçlar
                    </h3>

                    {lowStockItems.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">
                            Düşük stok uyarısı veren ilaç bulunmuyor.
                        </p>
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {lowStockItems.map((item) => (
                                <li
                                    key={item}
                                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">
                        SKT yaklaşan kayıtlar
                    </h3>

                    {expiringList.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">
                            Yaklaşan son kullanma tarihi bulunan kayıt yok.
                        </p>
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {expiringList.map((item) => (
                                <li
                                    key={item._id}
                                    className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                                >
                                    <div className="font-semibold">{item.medicineName}</div>
                                    {item.barcode ? <div>Barkod: {item.barcode}</div> : null}
                                    <div>
                                        SKT: formatDateTR(item.expiryDate)
                                    </div>
                                    <div>Stok: {item.stockQuantity}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">
                        SKT geçmiş kayıtlar
                    </h3>

                    {expiredList.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">
                            Son kullanma tarihi geçmiş kayıt yok.
                        </p>
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {expiredList.map((item) => (
                                <li
                                    key={item._id}
                                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                                >
                                    <div className="font-semibold">{item.medicineName}</div>
                                    {item.barcode ? <div>Barkod: {item.barcode}</div> : null}
                                    <div>
                                        SKT: formatDateTR(item.expiryDate)
                                    </div>
                                    <div>Stok: {item.stockQuantity}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
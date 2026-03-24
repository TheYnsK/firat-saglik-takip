type NamedExpiryItem = {
    _id: string;
    medicineName?: string;
    productName?: string;
    expiryDate: string | null;
    stockQuantity: number;
};

type Props = {
    medicineSummary: {
        totalMedicineCount: number;
        lowStockCount: number;
        expiringCount: number;
        expiredCount: number;
        lowStockItems: string[];
        expiringList: NamedExpiryItem[];
        expiredList: NamedExpiryItem[];
    };
    productSummary: {
        totalProductCount: number;
        lowStockCount: number;
        expiringCount: number;
        expiredCount: number;
        lowStockItems: string[];
        expiringList: NamedExpiryItem[];
        expiredList: NamedExpiryItem[];
    };
};

export function GeneralDashboard({
                                     medicineSummary,
                                     productSummary,
                                 }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Toplam İlaç Sayısı</p>
                    <h3 className="mt-3 text-3xl font-black text-slate-900">
                        {medicineSummary.totalMedicineCount}
                    </h3>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Toplam Ürün Sayısı</p>
                    <h3 className="mt-3 text-3xl font-black text-slate-900">
                        {productSummary.totalProductCount}
                    </h3>
                </div>

                <div className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">İlaçlarda Düşük Stok</p>
                    <h3 className="mt-3 text-3xl font-black text-rose-600">
                        {medicineSummary.lowStockCount}
                    </h3>
                </div>

                <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Ürünlerde Düşük Stok</p>
                    <h3 className="mt-3 text-3xl font-black text-orange-600">
                        {productSummary.lowStockCount}
                    </h3>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">İlaçlarda SKT Yaklaşan</p>
                    <h3 className="mt-3 text-3xl font-black text-amber-600">
                        {medicineSummary.expiringCount}
                    </h3>
                </div>

                <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Ürünlerde SKT Yaklaşan</p>
                    <h3 className="mt-3 text-3xl font-black text-amber-600">
                        {productSummary.expiringCount}
                    </h3>
                </div>

                <div className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">İlaçlarda SKT Geçmiş</p>
                    <h3 className="mt-3 text-3xl font-black text-rose-700">
                        {medicineSummary.expiredCount}
                    </h3>
                </div>

                <div className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Ürünlerde SKT Geçmiş</p>
                    <h3 className="mt-3 text-3xl font-black text-rose-700">
                        {productSummary.expiredCount}
                    </h3>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">İlaçlarda düşük stok</h3>
                    {medicineSummary.lowStockItems.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">
                            Düşük stok uyarısı veren ilaç bulunmuyor.
                        </p>
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {medicineSummary.lowStockItems.map((item) => (
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
                    <h3 className="text-lg font-bold text-slate-900">Ürünlerde düşük stok</h3>
                    {productSummary.lowStockItems.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">
                            Düşük stok uyarısı veren ürün bulunmuyor.
                        </p>
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {productSummary.lowStockItems.map((item) => (
                                <li
                                    key={item}
                                    className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">İlaçlarda SKT yaklaşan</h3>
                    {medicineSummary.expiringList.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">Yaklaşan ilaç partisi yok.</p>
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {medicineSummary.expiringList.map((item) => (
                                <li
                                    key={item._id}
                                    className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                                >
                                    <div className="font-semibold">{item.medicineName}</div>
                                    <div>
                                        SKT: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString("tr-TR") : "-"}
                                    </div>
                                    <div>Stok: {item.stockQuantity}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Ürünlerde SKT yaklaşan</h3>
                    {productSummary.expiringList.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">Yaklaşan ürün yok.</p>
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {productSummary.expiringList.map((item) => (
                                <li
                                    key={item._id}
                                    className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                                >
                                    <div className="font-semibold">{item.productName}</div>
                                    <div>
                                        SKT: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString("tr-TR") : "-"}
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
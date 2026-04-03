import { formatDateTR } from "@/lib/date";

type ProductListItem = {
    _id: string;
    productName: string;
    expiryDate: string | null;
    stockQuantity: number;
};

type Props = {
    totalProductCount: number;
    lowStockCount: number;
    expiringCount: number;
    expiredCount: number;
    lowStockItems: string[];
    expiringList: ProductListItem[];
    expiredList: ProductListItem[];
};

export function ProductDashboard({
                                     totalProductCount,
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
                    <p className="text-sm font-medium text-slate-500">Toplam Ürün Sayısı</p>
                    <h3 className="mt-3 text-3xl font-black text-slate-900">
                        {totalProductCount}
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
                        SKT Yaklaşan Ürün Sayısı
                    </p>
                    <h3 className="mt-3 text-3xl font-black text-amber-600">
                        {expiringCount}
                    </h3>
                </div>

                <div className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        SKT Geçmiş Ürün Sayısı
                    </p>
                    <h3 className="mt-3 text-3xl font-black text-rose-700">
                        {expiredCount}
                    </h3>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Düşük Stoktaki Ürünler</h3>
                    {lowStockItems.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">
                            Düşük stokta ürün bulunmuyor.
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
                    <h3 className="text-lg font-bold text-slate-900">SKT Yaklaşan Ürünler</h3>
                    {expiringList.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">
                            Yaklaşan son kullanma tarihli ürün yok.
                        </p>
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {expiringList.map((item) => (
                                <li
                                    key={item._id}
                                    className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                                >
                                    <div className="font-semibold">{item.productName}</div>
                                    <div>
                                        SKT: {item.expiryDate ? formatDateTR(item.expiryDate) : "-"}
                                    </div>
                                    <div>Stok: {item.stockQuantity}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">SKT Geçmiş Ürünler</h3>
                    {expiredList.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">
                            Son kullanma tarihi geçmiş ürün yok.
                        </p>
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {expiredList.map((item) => (
                                <li
                                    key={item._id}
                                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                                >
                                    <div className="font-semibold">{item.productName}</div>
                                    <div>
                                        SKT: {item.expiryDate ? formatDateTR(item.expiryDate) : "-"}
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
import { ProductStockForm } from "@/components/products/product-stock-form";
import { listProductTransactions } from "@/lib/services/product.service";

export default async function ProductStockPage() {
    const items = await listProductTransactions();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    Stok Takibi
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Ürün bazlı stok girişi, çıkışı ve düzeltme işlemlerini buradan yönetin.
                </p>
            </div>

            <ProductStockForm />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-800">
                    Son Stok Hareketleri
                </h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-left text-slate-600">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Tarih</th>
                            <th className="px-4 py-3 font-semibold">Ürün</th>
                            <th className="px-4 py-3 font-semibold">İşlem</th>
                            <th className="px-4 py-3 font-semibold">Miktar</th>
                            <th className="px-4 py-3 font-semibold">Kullanıcı</th>
                            <th className="px-4 py-3 font-semibold">Açıklama</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item) => (
                            <tr key={item._id} className="border-t border-slate-100">
                                <td className="px-4 py-3 text-slate-700">
                                    {new Date(item.createdAt).toLocaleString("tr-TR")}
                                </td>
                                <td className="px-4 py-3 font-semibold text-slate-900">
                                    {item.productName}
                                </td>
                                <td className="px-4 py-3 text-slate-700">
                                    {item.transactionType === "IN"
                                        ? "Giriş"
                                        : item.transactionType === "OUT"
                                            ? "Çıkış"
                                            : "Düzeltme"}
                                </td>
                                <td className="px-4 py-3 text-slate-700">{item.quantity}</td>
                                <td className="px-4 py-3 text-slate-700">{item.performedBy}</td>
                                <td className="px-4 py-3 text-slate-700">
                                    {item.description || "-"}
                                </td>
                            </tr>
                        ))}

                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                                    Henüz stok hareketi bulunmuyor.
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
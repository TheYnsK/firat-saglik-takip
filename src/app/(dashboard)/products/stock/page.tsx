import { ProductStockForm } from "@/components/products/product-stock-form";
import { listProductTransactionsPaginated } from "@/lib/services/product.service";
import { Pagination } from "@/components/shared/pagination";
import { formatDateTimeTR } from "@/lib/date";
import { AutoSearchForm } from "@/components/shared/auto-search-form";

type Props = {
    searchParams: Promise<{
        page?: string;
        q?: string;
    }>;
};

function getActionBadge(action: string) {
    switch (action) {
        case "IN":
            return "bg-cyan-100 text-cyan-700 border border-cyan-200";
        case "OUT":
            return "bg-orange-100 text-orange-700 border border-orange-200";
        case "ADJUSTMENT":
            return "bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200";
        default:
            return "bg-slate-100 text-slate-700 border border-slate-200";
    }
}

function getActionLabel(action: string) {
    switch (action) {
        case "IN":
            return "Stok Girişi";
        case "OUT":
            return "Stok Çıkışı";
        case "ADJUSTMENT":
            return "Stok Düzeltme";
        default:
            return action;
    }
}

export default async function ProductStockPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = Number(params.page ?? "1");
    const q = params.q ?? "";

    const result = await listProductTransactionsPaginated(page, 20, q);

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


            <AutoSearchForm
                label="Ürün adı, kullanıcı, işlem türü veya açıklama ile ara"
                placeholder=" "
            />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-bold text-slate-800">Son Stok Hareketleri</h3>
                    <p className="text-sm text-slate-500">
                        Toplam kayıt: {result.totalCount} · Sayfa: {result.currentPage}/{result.totalPages}
                    </p>
                </div>

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
                        {result.items.map((item) => (
                            <tr key={item._id} className="border-t border-slate-100">
                                <td className="px-4 py-3 text-slate-700">
                                    {formatDateTimeTR(item.createdAt)}
                                </td>
                                <td className="px-4 py-3 font-semibold text-slate-900">
                                    {item.productName}
                                </td>
                                <td className="px-4 py-3">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getActionBadge(
                            item.transactionType
                        )}`}
                    >
                      {getActionLabel(item.transactionType)}
                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{item.quantity}</td>
                                <td className="px-4 py-3 text-slate-700">{item.performerName}</td>
                                <td className="px-4 py-3 text-slate-700">{item.description || "-"}</td>
                            </tr>
                        ))}

                        {result.items.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                                    Henüz stok hareketi bulunmuyor.
                                </td>
                            </tr>
                        ) : null}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6">
                    <Pagination
                        currentPage={result.currentPage}
                        totalPages={result.totalPages}
                        basePath="/products/stock"
                        query={{ q }}
                    />
                </div>
            </div>
        </div>
    );
}
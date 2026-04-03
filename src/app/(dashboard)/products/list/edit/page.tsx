import { ProductForm } from "@/components/products/product-form";
import { ProductListTable } from "@/components/products/product-list-table";
import { listProductsWithSummaryPaginated } from "@/lib/services/product.service";
import { Pagination } from "@/components/shared/pagination";
import { AutoSearchForm } from "@/components/shared/auto-search-form";

type Props = {
    searchParams: Promise<{
        page?: string;
        q?: string
    }>;
};

export default async function ProductEditPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = Number(params.page ?? "1");
    const q = params.q ?? "";

    const result = await listProductsWithSummaryPaginated(page, 20);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    Ürün Listesini Düzenleme
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Yeni ürün ekleyin, stok limitlerini yönetin ve mevcut kayıtları görüntüleyin.
                </p>
            </div>

            <ProductForm />

            <div>
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-bold text-slate-800">Mevcut Ürünler</h3>
                    <p className="text-sm text-slate-500">
                        Toplam kayıt: {result.totalCount} · Sayfa: {result.currentPage}/{result.totalPages}
                    </p>
                </div>

                <ProductListTable items={result.items} showActions />

                <AutoSearchForm
                    label="Ürün adı, barkod, kullanıcı, işlem türü veya açıklama ile ara"
                    placeholder=" "
                />

                <div className="mt-6">
                    <Pagination
                        currentPage={result.currentPage}
                        totalPages={result.totalPages}
                        basePath="/products/list/edit"
                        query={{ q }}
                    />
                </div>
            </div>
        </div>
    );
}
import Link from "next/link";
import { ProductListTable } from "@/components/products/product-list-table";
import { listProductsWithSummaryPaginated } from "@/lib/services/product.service";
import { Pagination } from "@/components/shared/pagination";

type Props = {
    searchParams: Promise<{
        page?: string;
    }>;
};

export default async function ProductListPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = Number(params.page ?? "1");

    const result = await listProductsWithSummaryPaginated(page, 20);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                        Ürün Listesi
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Sisteme eklenen tüm ürün kartlarını burada görüntüleyin.
                    </p>
                </div>

                <Link
                    href="/products/list/edit"
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 font-bold !text-white no-underline shadow-md transition hover:scale-[1.01] hover:!text-white visited:!text-white"
                >
                    Ürün Listesini Düzenle
                </Link>
            </div>

            <p className="text-sm text-slate-500">
                Toplam kayıt: {result.totalCount} · Sayfa: {result.currentPage}/{result.totalPages}
            </p>

            <ProductListTable items={result.items} />

            <Pagination
                currentPage={result.currentPage}
                totalPages={result.totalPages}
                basePath="/products/list"
            />
        </div>
    );
}
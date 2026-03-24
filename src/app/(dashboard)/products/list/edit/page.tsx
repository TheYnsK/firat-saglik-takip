import { ProductForm } from "@/components/products/product-form";
import { ProductListTable } from "@/components/products/product-list-table";
import { listProductsWithSummary } from "@/lib/services/product.service";

export default async function ProductEditPage() {
    const items = await listProductsWithSummary();

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
                <h3 className="mb-4 text-lg font-bold text-slate-800">Mevcut Ürünler</h3>
                <ProductListTable items={items} showActions />
            </div>
        </div>
    );
}
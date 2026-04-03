import { ProductDashboard } from "@/components/products/product-dashboard";
import { getProductDashboardSummary } from "@/lib/services/product.service";
import { ExcelExportMenu } from "@/components/shared/excel-export-menu";

export default async function ProductsHomePage() {
    const summary = await getProductDashboardSummary();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                        Ürünler Ana Ekran
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Medikal ürünlerin genel durumu, düşük stok ve SKT özeti burada yer alır.
                    </p>
                </div>

                <ExcelExportMenu
                    options={[
                        {
                            label: "Düşük stok ürünleri indir",
                            href: "/api/products/export/low-stock-excel",
                        },
                        {
                            label: "SKT yaklaşan ürünleri indir",
                            href: "/api/products/export/expiring-excel",
                        },
                        {
                            label: "SKT geçmiş ürünleri indir",
                            href: "/api/products/export/expired-excel",
                        },
                        {
                            label: "Ürün stok hareketlerini indir",
                            href: "/api/products/export/transactions-excel",
                        },
                        {
                            label: "Ürün işlem kayıtlarını indir",
                            href: "/api/products/export/logs-excel",
                        },
                    ]}
                />
            </div>

            <ProductDashboard
                totalProductCount={summary.totalProductCount}
                lowStockCount={summary.lowStockCount}
                expiringCount={summary.expiringCount}
                expiredCount={summary.expiredCount}
                lowStockItems={summary.lowStockItems}
                expiringList={summary.expiringList}
                expiredList={summary.expiredList}
            />
        </div>
    );
}
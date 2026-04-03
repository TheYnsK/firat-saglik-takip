import { getMedicineDashboardSummary } from "@/lib/services/dashboard.service";
import { MedicineDashboard } from "@/components/medicines/medicine-dashboard";
import { ExcelExportMenu } from "@/components/shared/excel-export-menu";

export default async function MedicinesHomePage() {
    const summary = await getMedicineDashboardSummary();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                        İlaçlar Ana Ekran
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        İlaçların genel durumu, düşük stok ve SKT özeti burada yer alır.
                    </p>
                </div>

                <ExcelExportMenu
                    options={[
                        {
                            label: "Düşük stok ilaçları indir",
                            href: "/api/medicines/export/low-stock-excel",
                        },
                        {
                            label: "SKT yaklaşan ilaçları indir",
                            href: "/api/medicines/export/expiring-excel",
                        },
                        {
                            label: "SKT geçmiş ilaçları indir",
                            href: "/api/medicines/export/expired-excel",
                        },
                        {
                            label: "İlaç stok hareketlerini indir",
                            href: "/api/medicines/export/transactions-excel",
                        },
                        {
                            label: "İlaç işlem kayıtlarını indir",
                            href: "/api/medicines/export/logs-excel",
                        },
                    ]}
                />
            </div>

            <MedicineDashboard
                totalMedicineCount={summary.totalMedicineCount}
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
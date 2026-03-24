import { GeneralDashboard } from "@/components/shared/general-dashboard";
import { getGeneralDashboardSummary } from "@/lib/services/general-dashboard.service";

export default async function DashboardPage() {
    const summary = await getGeneralDashboardSummary();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    Genel Durum
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    İlaç ve ürün takip sisteminin genel özet bilgileri burada yer alır.
                </p>
            </div>

            <GeneralDashboard
                medicineSummary={summary.medicineSummary}
                productSummary={summary.productSummary}
            />
        </div>
    );
}
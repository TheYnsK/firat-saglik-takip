import { getMedicineDashboardSummary } from "@/lib/services/dashboard.service";
import { getProductDashboardSummary } from "@/lib/services/product.service";

export async function getGeneralDashboardSummary() {
    const [medicineSummary, productSummary] = await Promise.all([
        getMedicineDashboardSummary(),
        getProductDashboardSummary(),
    ]);

    return {
        medicineSummary,
        productSummary,
    };
}
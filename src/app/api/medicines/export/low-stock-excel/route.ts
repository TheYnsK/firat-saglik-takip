import { getCurrentUser } from "@/lib/auth/current-user";
import { exportMedicineLowStockExcel } from "@/lib/exporters/medicine-low-stock-exporter";
import { createExcelResponse } from "@/lib/excel";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return new Response("Yetkisiz erişim.", { status: 401 });
    }

    const buffer = await exportMedicineLowStockExcel();

    return createExcelResponse({
        buffer,
        filename: "ilaclar-dusuk-stok.xlsx",
    });
}
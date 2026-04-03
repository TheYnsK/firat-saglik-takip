import { getCurrentUser } from "@/lib/auth/current-user";
import { exportMedicineLogsExcel } from "@/lib/exporters/medicine-logs-exporter";
import { createExcelResponse } from "@/lib/excel";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return new Response("Yetkisiz erişim.", { status: 401 });
    }

    const buffer = await exportMedicineLogsExcel();

    return createExcelResponse({
        buffer,
        filename: "ilaclar-islem-kayitlari.xlsx",
    });
}
import { getCurrentUser } from "@/lib/auth/current-user";
import { exportMedicineExpiringExcel } from "@/lib/exporters/medicine-expiring-exporter";
import { createExcelResponse } from "@/lib/excel";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return new Response("Yetkisiz erişim.", { status: 401 });
    }

    const buffer = await exportMedicineExpiringExcel();

    return createExcelResponse({
        buffer,
        filename: "ilaclar-skt-yaklasan.xlsx",
    });
}
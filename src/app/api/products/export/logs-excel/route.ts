import { getCurrentUser } from "@/lib/auth/current-user";
import { exportProductLogsExcel } from "@/lib/exporters/product-logs-exporter";
import { createExcelResponse } from "@/lib/excel";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return new Response("Yetkisiz erişim.", { status: 401 });
    }

    const buffer = await exportProductLogsExcel();

    return createExcelResponse({
        buffer,
        filename: "urunler-islem-kayitlari.xlsx",
    });
}
import { getCurrentUser } from "@/lib/auth/current-user";
import { exportProductExpiredExcel } from "@/lib/exporters/product-expired-exporter";
import { createExcelResponse } from "@/lib/excel";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return new Response("Yetkisiz erişim.", { status: 401 });
    }

    const buffer = await exportProductExpiredExcel();

    return createExcelResponse({
        buffer,
        filename: "urunler-skt-gecmis.xlsx",
    });
}
import { getCurrentUser } from "@/lib/auth/current-user";
import { exportProductExpiringExcel } from "@/lib/exporters/product-expiring-exporter";
import { createExcelResponse } from "@/lib/excel";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return new Response("Yetkisiz erişim.", { status: 401 });
    }

    const buffer = await exportProductExpiringExcel();

    return createExcelResponse({
        buffer,
        filename: "urunler-skt-yaklasan.xlsx",
    });
}
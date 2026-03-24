import { getCurrentUser } from "@/lib/auth/current-user";
import { exportProductLowStockExcel } from "@/lib/exporters/product-low-stock-exporter";
import { createExcelResponse } from "@/lib/excel";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return new Response("Yetkisiz erişim.", { status: 401 });
    }

    const buffer = await exportProductLowStockExcel();

    return createExcelResponse({
        buffer,
        filename: "urunler-dusuk-stok.xlsx",
    });
}
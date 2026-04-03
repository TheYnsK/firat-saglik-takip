import { getCurrentUser } from "@/lib/auth/current-user";
import { exportProductTransactionsExcel } from "@/lib/exporters/product-transactions-exporter";
import { createExcelResponse } from "@/lib/excel";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return new Response("Yetkisiz erişim.", { status: 401 });
    }

    const buffer = await exportProductTransactionsExcel();

    return createExcelResponse({
        buffer,
        filename: "urunler-stok-hareketleri.xlsx",
    });
}
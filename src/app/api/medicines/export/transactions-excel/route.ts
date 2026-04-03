import { getCurrentUser } from "@/lib/auth/current-user";
import { exportMedicineTransactionsExcel } from "@/lib/exporters/medicine-transactions-exporter";
import { createExcelResponse } from "@/lib/excel";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return new Response("Yetkisiz erişim.", { status: 401 });
    }

    const buffer = await exportMedicineTransactionsExcel();

    return createExcelResponse({
        buffer,
        filename: "ilaclar-stok-hareketleri.xlsx",
    });
}
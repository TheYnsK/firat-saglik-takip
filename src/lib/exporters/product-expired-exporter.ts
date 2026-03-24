import { getProductDashboardSummary } from "@/lib/services/product.service";
import { createStyledExcelBuffer } from "@/lib/excel";

export async function exportProductExpiredExcel() {
    const summary = await getProductDashboardSummary();

    const rows = summary.expiredList.map((item, index) => ({
        siraNo: index + 1,
        urunAdi: item.productName,
        skt: item.expiryDate
            ? new Date(item.expiryDate).toLocaleDateString("tr-TR")
            : "",
        stok: item.stockQuantity,
    }));

    return createStyledExcelBuffer({
        sheetName: "SKT Geçmiş Ürünler",
        reportTitle: "SKT Geçmiş Ürünler Raporu",
        columns: [
            { header: "Sıra No", key: "siraNo", width: 10 },
            { header: "Ürün Adı", key: "urunAdi", width: 30 },
            { header: "SKT", key: "skt", width: 18 },
            { header: "Stok", key: "stok", width: 12 },
        ],
        rows,
    });
}
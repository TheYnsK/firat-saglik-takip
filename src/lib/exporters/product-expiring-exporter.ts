import { getProductDashboardSummary } from "@/lib/services/product.service";
import { createStyledExcelBuffer } from "@/lib/excel";

export async function exportProductExpiringExcel() {
    const summary = await getProductDashboardSummary();

    const rows = summary.expiringList.map((item, index) => ({
        siraNo: index + 1,
        urunAdi: item.productName,
        skt: item.expiryDate
            ? new Date(item.expiryDate).toLocaleDateString("tr-TR")
            : "",
        stok: item.stockQuantity,
    }));

    return createStyledExcelBuffer({
        sheetName: "SKT Yaklaşan Ürünler",
        reportTitle: "SKT Yaklaşan Ürünler Raporu",
        columns: [
            { header: "Sıra No", key: "siraNo", width: 10 },
            { header: "Ürün Adı", key: "urunAdi", width: 30 },
            { header: "SKT", key: "skt", width: 18 },
            { header: "Stok", key: "stok", width: 12 },
        ],
        rows,
    });
}
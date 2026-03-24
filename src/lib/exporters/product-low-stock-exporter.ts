import { listProductsWithSummary } from "@/lib/services/product.service";
import { createStyledExcelBuffer } from "@/lib/excel";

export async function exportProductLowStockExcel() {
    const items = await listProductsWithSummary();

    const filtered = items.filter((item) => item.isLowStock);

    const rows = filtered.map((item, index) => ({
        siraNo: index + 1,
        urunAdi: item.name,
        barkod: item.barcode,
        tur: item.type,
        stok: item.stockQuantity,
        dusukStokLimiti: item.lowStockThreshold,
        not: item.note || "",
    }));

    return createStyledExcelBuffer({
        sheetName: "Düşük Stok Ürünler",
        reportTitle: "Düşük Stok Ürünler Raporu",
        columns: [
            { header: "Sıra No", key: "siraNo", width: 10 },
            { header: "Ürün Adı", key: "urunAdi", width: 30 },
            { header: "Barkod", key: "barkod", width: 22 },
            { header: "Tür", key: "tur", width: 20 },
            { header: "Stok", key: "stok", width: 12 },
            { header: "Düşük Stok Limiti", key: "dusukStokLimiti", width: 18 },
            { header: "Not", key: "not", width: 30 },
        ],
        rows,
    });
}
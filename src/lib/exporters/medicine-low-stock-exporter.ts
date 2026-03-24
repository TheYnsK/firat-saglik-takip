import { listMedicinesWithSummary } from "@/lib/services/medicine.service";
import { createStyledExcelBuffer } from "@/lib/excel";

export async function exportMedicineLowStockExcel() {
    const items = await listMedicinesWithSummary();

    const filtered = items.filter((item) => item.isLowStock);

    const rows = filtered.map((item, index) => ({
        siraNo: index + 1,
        ilacAdi: item.name,
        tur: item.type,
        olcu: item.measure,
        toplamStok: item.totalStock,
        dusukStokLimiti: item.lowStockThreshold,
        partiSayisi: item.batchCount,
        not: item.note || "",
    }));

    return createStyledExcelBuffer({
        sheetName: "Düşük Stok İlaçlar",
        reportTitle: "Düşük Stok İlaçlar Raporu",
        columns: [
            { header: "Sıra No", key: "siraNo", width: 10 },
            { header: "İlaç Adı", key: "ilacAdi", width: 30 },
            { header: "Tür", key: "tur", width: 18 },
            { header: "Ölçü", key: "olcu", width: 18 },
            { header: "Toplam Stok", key: "toplamStok", width: 14 },
            { header: "Düşük Stok Limiti", key: "dusukStokLimiti", width: 18 },
            { header: "Parti Sayısı", key: "partiSayisi", width: 12 },
            { header: "Not", key: "not", width: 30 },
        ],
        rows,
    });
}
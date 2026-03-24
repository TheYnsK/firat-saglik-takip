import { getMedicineDashboardSummary } from "@/lib/services/dashboard.service";
import { createStyledExcelBuffer } from "@/lib/excel";

export async function exportMedicineExpiringExcel() {
    const summary = await getMedicineDashboardSummary();

    const rows = summary.expiringList.map((item, index) => ({
        siraNo: index + 1,
        ilacAdi: item.medicineName,
        partiNo: item.batchNo,
        skt: item.expiryDate
            ? new Date(item.expiryDate).toLocaleDateString("tr-TR")
            : "",
        stok: item.stockQuantity,
    }));

    return createStyledExcelBuffer({
        sheetName: "SKT Yaklaşan İlaçlar",
        reportTitle: "SKT Yaklaşan İlaçlar Raporu",
        columns: [
            { header: "Sıra No", key: "siraNo", width: 10 },
            { header: "İlaç Adı", key: "ilacAdi", width: 30 },
            { header: "Parti No", key: "partiNo", width: 22 },
            { header: "SKT", key: "skt", width: 18 },
            { header: "Stok", key: "stok", width: 12 },
        ],
        rows,
    });
}
import { getMedicineDashboardSummary } from "@/lib/services/dashboard.service";
import { createStyledExcelBuffer } from "@/lib/excel";

export async function exportMedicineExpiredExcel() {
    const summary = await getMedicineDashboardSummary();

    const rows = summary.expiredList.map((item, index) => ({
        siraNo: index + 1,
        ilacAdi: item.medicineName,
        partiNo: item.batchNo,
        skt: item.expiryDate
            ? new Date(item.expiryDate).toLocaleDateString("tr-TR")
            : "",
        stok: item.stockQuantity,
    }));

    return createStyledExcelBuffer({
        sheetName: "SKT Geçmiş İlaçlar",
        reportTitle: "SKT Geçmiş İlaçlar Raporu",
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
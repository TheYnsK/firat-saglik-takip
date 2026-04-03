import { listMedicineTransactions } from "@/lib/services/medicine.service";
import { createStyledExcelBuffer } from "@/lib/excel";
import { formatDateTimeTR } from "@/lib/date";

export async function exportMedicineTransactionsExcel() {
    const items = await listMedicineTransactions();

    const rows = items.map((item, index) => ({
        siraNo: index + 1,
        tarih: formatDateTimeTR(item.createdAt),
        ilacAdi: item.medicineName,
        barkod: item.barcode ?? "",
        islem:
            item.transactionType === "IN"
                ? "Stok Girişi"
                : item.transactionType === "OUT"
                    ? "Stok Çıkışı"
                    : "Stok Düzeltme",
        miktar: item.quantity,
        kullanici: item.performerName,
        aciklama: item.description || "",
    }));

    return createStyledExcelBuffer({
        sheetName: "İlaç Stok Hareketleri",
        reportTitle: "İlaç Stok Hareketleri Raporu",
        columns: [
            { header: "Sıra No", key: "siraNo", width: 10 },
            { header: "Tarih", key: "tarih", width: 24 },
            { header: "İlaç Adı", key: "ilacAdi", width: 28 },
            { header: "Barkod", key: "barkod", width: 22 },
            { header: "İşlem", key: "islem", width: 18 },
            { header: "Miktar", key: "miktar", width: 12 },
            { header: "Kullanıcı", key: "kullanici", width: 20 },
            { header: "Açıklama", key: "aciklama", width: 36 },
        ],
        rows,
    });
}
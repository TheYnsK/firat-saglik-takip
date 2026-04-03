import { connectToDatabase } from "@/lib/db";
import { AuditLog } from "@/models/AuditLog";
import { MedicineTransaction } from "@/models/MedicineTransaction";
import { createStyledExcelBuffer } from "@/lib/excel";
import { formatDateTimeTR } from "@/lib/date";

function getActionLabel(action: string) {
    switch (action) {
        case "CREATE":
            return "Ekleme";
        case "UPDATE":
            return "Güncelleme";
        case "DELETE":
            return "Çıkarma";
        case "IN":
            return "Stok Girişi";
        case "OUT":
            return "Stok Çıkışı";
        case "ADJUSTMENT":
            return "Stok Düzeltme";
        default:
            return action;
    }
}

export async function exportMedicineLogsExcel() {
    await connectToDatabase();

    const items = await AuditLog.find({
        $or: [
            { module: "İlaçlar" },
            { module: "İlaç Partileri"},
            { module: "İlaç Kayıtleri" },
            { module: "Stok Hareketleri" },
        ],
    })
        .sort({ createdAt: -1 })
        .limit(500)
        .lean();

    const medicineTransactionIds = items
        .filter((item: any) => item.targetType === "MedicineTransaction")
        .map((item: any) => String(item.targetId));

    const medicineTransactions = await MedicineTransaction.find({
        _id: { $in: medicineTransactionIds },
    }).lean();

    const medicineTransactionMap = new Map(
        medicineTransactions.map((item: any) => [String(item._id), item])
    );

    const rows = items.map((item: any, index) => {
        let enrichedMessage = item.messageTr;

        if (item.targetType === "MedicineTransaction") {
            const tx = medicineTransactionMap.get(String(item.targetId));
            if (tx?.description?.trim() && !String(item.messageTr).includes("Not:")) {
                enrichedMessage = `${item.messageTr} Not: ${tx.description.trim()}.`;
            }
        }

        return {
            siraNo: index + 1,
            tarih: formatDateTimeTR(item.createdAt),
            kullanici: item.fullName,
            modul: item.module,
            islem: getActionLabel(item.action),
            aciklama: enrichedMessage,
        };
    });

    return createStyledExcelBuffer({
        sheetName: "İlaç İşlem Kayıtları",
        reportTitle: "İlaç İşlem Kayıtları Raporu",
        columns: [
            { header: "Sıra No", key: "siraNo", width: 10 },
            { header: "Tarih", key: "tarih", width: 24 },
            { header: "Kullanıcı", key: "kullanici", width: 22 },
            { header: "Modül", key: "modul", width: 22 },
            { header: "İşlem", key: "islem", width: 18 },
            { header: "Açıklama", key: "aciklama", width: 50 },
        ],
        rows,
    });
}
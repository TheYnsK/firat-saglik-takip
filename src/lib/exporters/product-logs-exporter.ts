import { connectToDatabase } from "@/lib/db";
import { AuditLog } from "@/models/AuditLog";
import { ProductTransaction } from "@/models/ProductTransaction";
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

export async function exportProductLogsExcel() {
    await connectToDatabase();

    const items = await AuditLog.find({
        $or: [
            { module: "Ürünler" },
            { module: "Ürün Stok Hareketleri" },
        ],
    })
        .sort({ createdAt: -1 })
        .limit(500)
        .lean();

    const productTransactionIds = items
        .filter((item: any) => item.targetType === "ProductTransaction")
        .map((item: any) => String(item.targetId));

    const productTransactions = await ProductTransaction.find({
        _id: { $in: productTransactionIds },
    }).lean();

    const productTransactionMap = new Map(
        productTransactions.map((item: any) => [String(item._id), item])
    );

    const rows = items.map((item: any, index) => {
        let enrichedMessage = item.messageTr;

        if (item.targetType === "ProductTransaction") {
            const tx = productTransactionMap.get(String(item.targetId));
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
        sheetName: "Ürün İşlem Kayıtları",
        reportTitle: "Ürün İşlem Kayıtları Raporu",
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
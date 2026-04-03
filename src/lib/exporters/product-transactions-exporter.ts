import { listProductTransactions } from "@/lib/services/product.service";
import { createStyledExcelBuffer } from "@/lib/excel";
import { formatDateTimeTR } from "@/lib/date";

export async function exportProductTransactionsExcel() {
    const items = await listProductTransactions();

    const rows = items.map((item, index) => ({
        siraNo: index + 1,
        tarih: formatDateTimeTR(item.createdAt),
        urunAdi: item.productName,
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
        sheetName: "Ürün Stok Hareketleri",
        reportTitle: "Ürün Stok Hareketleri Raporu",
        columns: [
            { header: "Sıra No", key: "siraNo", width: 10 },
            { header: "Tarih", key: "tarih", width: 24 },
            { header: "Ürün Adı", key: "urunAdi", width: 30 },
            { header: "İşlem", key: "islem", width: 18 },
            { header: "Miktar", key: "miktar", width: 12 },
            { header: "Kullanıcı", key: "kullanici", width: 20 },
            { header: "Açıklama", key: "aciklama", width: 36 },
        ],
        rows,
    });
}
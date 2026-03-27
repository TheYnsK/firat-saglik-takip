import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { medicineTransactionSchema } from "@/validations/medicine-transaction.schema";
import {
    createMedicineTransaction,
    listMedicineTransactions,
} from "@/lib/services/medicine.service";
import { createLog } from "@/lib/audit/create-log";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const items = await listMedicineTransactions();
        return NextResponse.json({ items });
    } catch {
        return NextResponse.json(
            { message: "Stok hareketleri alınırken hata oluştu." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const body = await request.json();
        const parsed = medicineTransactionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0]?.message ?? "Geçersiz veri." },
                { status: 400 }
            );
        }

        const result = await createMedicineTransaction({
            ...parsed.data,
            username: user.username,
        });

        const actionText =
            parsed.data.transactionType === "IN"
                ? "stok girişi yaptı"
                : parsed.data.transactionType === "OUT"
                    ? "stok çıkışı yaptı"
                    : "stok düzeltmesi yaptı";

        await createLog({
            username: user.username,
            fullName: user.fullName,
            module: "Stok Hareketleri",
            action: parsed.data.transactionType,
            targetType: "MedicineTransaction",
            targetId: String(result.transaction._id),
            messageTr: `${user.fullName}, ${result.medicineName} ilacının barkodlu kaydı için ${parsed.data.quantity} adet ${actionText}. Yeni stok: ${result.newStockQuantity}.`,
        });

        return NextResponse.json({
            ok: true,
            message: "Stok hareketi başarıyla kaydedildi.",
            item: result.transaction,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "PARTI_NOT_FOUND") {
                return NextResponse.json(
                    { message: "Kayıt bulunamadı." },
                    { status: 404 }
                );
            }
            if (error.message === "MEDICINE_NOT_FOUND") {
                return NextResponse.json(
                    { message: "İlaç kaydı bulunamadı." },
                    { status: 404 }
                );
            }
            if (error.message === "MEDICINE_BATCH_MISMATCH") {
                return NextResponse.json(
                    { message: "Seçilen ilaç ile barkodlu kayıt eşleşmiyor." },
                    { status: 400 }
                );
            }
            if (error.message === "INSUFFICIENT_STOCK") {
                return NextResponse.json(
                    { message: "Yetersiz stok. Çıkış işlemi yapılamaz." },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { message: "Stok hareketi kaydedilirken hata oluştu." },
            { status: 500 }
        );
    }
}
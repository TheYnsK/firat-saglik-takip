import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { productTransactionSchema } from "@/validations/product-transaction.schema";
import {
    createProductTransaction,
    listProductTransactions,
} from "@/lib/services/product.service";
import { createLog } from "@/lib/audit/create-log";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const items = await listProductTransactions();
        return NextResponse.json({ items });
    } catch {
        return NextResponse.json(
            { message: "Ürün stok hareketleri alınırken hata oluştu." },
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
        const parsed = productTransactionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0]?.message ?? "Geçersiz veri." },
                { status: 400 }
            );
        }

        const result = await createProductTransaction({
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
            module: "Ürün Stok Hareketleri",
            action: parsed.data.transactionType,
            targetType: "ProductTransaction",
            targetId: String(result.transaction._id),
            messageTr: `${user.fullName}, ${result.productName} ürünü için ${parsed.data.quantity} adet ${actionText}. Yeni stok: ${result.newStockQuantity}.${parsed.data.description?.trim() ? ` Not: ${parsed.data.description.trim()}.` : ""}`,        });

        return NextResponse.json({
            ok: true,
            message: "Ürün stok hareketi başarıyla kaydedildi.",
            item: result.transaction,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "PRODUCT_NOT_FOUND") {
                return NextResponse.json(
                    { message: "Ürün kaydı bulunamadı." },
                    { status: 404 }
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
            { message: "Ürün stok hareketi kaydedilirken hata oluştu." },
            { status: 500 }
        );
    }
}
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { getCurrentUser } from "@/lib/auth/current-user";
import { productSchema } from "@/validations/product.schema";
import { createLog } from "@/lib/audit/create-log";

type Params = {
    params: Promise<{
        productId: string;
    }>;
};

export async function GET(_: Request, { params }: Params) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const { productId } = await params;
        await connectToDatabase();

        const item = await Product.findById(productId).lean();

        if (!item) {
            return NextResponse.json({ message: "Ürün bulunamadı." }, { status: 404 });
        }

        return NextResponse.json({
            item: {
                ...item,
                _id: String(item._id),
            },
        });
    } catch {
        return NextResponse.json(
            { message: "Ürün bilgisi alınırken hata oluştu." },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: Params) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const { productId } = await params;
        const body = await request.json();
        const parsed = productSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0]?.message ?? "Geçersiz veri." },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const updated = await Product.findByIdAndUpdate(
            productId,
            {
                name: parsed.data.name,
                barcode: parsed.data.barcode,
                type: parsed.data.type,
                stockQuantity: parsed.data.stockQuantity,
                lowStockThreshold: parsed.data.lowStockThreshold,
                hasExpiry: parsed.data.hasExpiry,
                expiryDate:
                    parsed.data.hasExpiry && parsed.data.expiryDate
                        ? new Date(parsed.data.expiryDate)
                        : null,
                note: parsed.data.note ?? "",
                updatedBy: user.username,
            },
            { new: true }
        ).lean();

        if (!updated) {
            return NextResponse.json({ message: "Ürün bulunamadı." }, { status: 404 });
        }

        await createLog({
            username: user.username,
            fullName: user.fullName,
            module: "Ürünler",
            action: "UPDATE",
            targetType: "Product",
            targetId: String(updated._id),
            messageTr: `${user.fullName}, ${updated.name} adlı ürünü güncelledi.`,
        });

        return NextResponse.json({
            ok: true,
            message: "Ürün başarıyla güncellendi.",
            item: updated,
        });
    } catch {
        return NextResponse.json(
            { message: "Ürün güncellenirken hata oluştu." },
            { status: 500 }
        );
    }
}

export async function DELETE(_: Request, { params }: Params) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const { productId } = await params;
        await connectToDatabase();

        const product = await Product.findById(productId).lean();
        if (!product) {
            return NextResponse.json({ message: "Ürün bulunamadı." }, { status: 404 });
        }

        await Product.findByIdAndDelete(productId);

        await createLog({
            username: user.username,
            fullName: user.fullName,
            module: "Ürünler",
            action: "DELETE",
            targetType: "Product",
            targetId: String(product._id),
            messageTr: `${user.fullName}, ${product.name} adlı ürünü sildi.`,
        });

        return NextResponse.json({
            ok: true,
            message: "Ürün başarıyla silindi.",
        });
    } catch {
        return NextResponse.json(
            { message: "Ürün silinirken hata oluştu." },
            { status: 500 }
        );
    }
}
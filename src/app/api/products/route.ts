import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { productSchema } from "@/validations/product.schema";
import { createProduct, listProductsWithSummary } from "@/lib/services/product.service";
import { createLog } from "@/lib/audit/create-log";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const items = await listProductsWithSummary();
        return NextResponse.json({ items });
    } catch {
        return NextResponse.json(
            { message: "Ürün listesi alınırken hata oluştu." },
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
        const parsed = productSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0]?.message ?? "Geçersiz veri." },
                { status: 400 }
            );
        }

        const created = await createProduct({
            ...parsed.data,
            username: user.username,
        });

        await createLog({
            username: user.username,
            fullName: user.fullName,
            module: "Ürünler",
            action: "CREATE",
            targetType: "Product",
            targetId: String(created._id),
            messageTr: `${user.fullName}, ${created.name} adlı ürünü sisteme ekledi.`,
        });

        return NextResponse.json({
            ok: true,
            message: "Ürün başarıyla eklendi.",
            item: created,
        });
    } catch {
        return NextResponse.json(
            { message: "Ürün eklenirken hata oluştu." },
            { status: 500 }
        );
    }
}
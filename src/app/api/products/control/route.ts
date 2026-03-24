import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getProductControlResult } from "@/lib/services/product.service";

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q") ?? "";

        const item = await getProductControlResult(q);

        return NextResponse.json({ item });
    } catch {
        return NextResponse.json(
            { message: "Ürün kontrolü sırasında hata oluştu." },
            { status: 500 }
        );
    }
}
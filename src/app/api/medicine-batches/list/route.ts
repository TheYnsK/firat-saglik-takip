import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listMedicineBatches } from "@/lib/services/medicine.service";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const items = await listMedicineBatches();
        return NextResponse.json({ items });
    } catch {
        return NextResponse.json(
            { message: "Kayıt listesi alınırken hata oluştu." },
            { status: 500 }
        );
    }
}
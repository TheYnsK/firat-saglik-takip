import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getMedicineControlResult } from "@/lib/services/medicine.service";

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q") ?? "";

        const result = await getMedicineControlResult(q);

        return NextResponse.json({ item: result });
    } catch {
        return NextResponse.json(
            { message: "İlaç kontrolü sırasında hata oluştu." },
            { status: 500 }
        );
    }
}
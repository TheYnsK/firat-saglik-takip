import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listMedicineOptions } from "@/lib/services/medicine.service";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    const items = await listMedicineOptions();
    return NextResponse.json({ items });
}
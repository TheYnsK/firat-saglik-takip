import { NextResponse } from "next/server";
import { medicineSchema } from "@/validations/medicine.schema";
import { listMedicinesWithSummary, createMedicine } from "@/lib/services/medicine.service";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createLog } from "@/lib/audit/create-log";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const medicines = await listMedicinesWithSummary();
        return NextResponse.json({ items: medicines });
    } catch {
        return NextResponse.json(
            { message: "İlaç listesi alınırken hata oluştu." },
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
        const parsed = medicineSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0]?.message ?? "Geçersiz veri." },
                { status: 400 }
            );
        }

        const created = await createMedicine({
            ...parsed.data,
            username: user.username,
        });

        await createLog({
            username: user.username,
            fullName: user.fullName,
            module: "İlaçlar",
            action: "CREATE",
            targetType: "Medicine",
            targetId: String(created._id),
            messageTr: `${user.fullName}, ${created.name} adlı ilacı sisteme ekledi.`,
        });

        return NextResponse.json({
            ok: true,
            message: "İlaç başarıyla eklendi.",
            item: created,
        });
    } catch {
        return NextResponse.json(
            { message: "İlaç eklenirken hata oluştu." },
            { status: 500 }
        );
    }
}
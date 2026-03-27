import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { medicineBatchSchema } from "@/validations/medicine-batch.schema";
import { connectToDatabase } from "@/lib/db";
import { MedicineBatch } from "@/models/MedicineBatch";
import { Medicine } from "@/models/Medicine";
import { createLog } from "@/lib/audit/create-log";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const body = await request.json();
        const parsed = medicineBatchSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0]?.message ?? "Geçersiz veri." },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const medicine = await Medicine.findById(parsed.data.medicineId).lean();

        if (!medicine) {
            return NextResponse.json({ message: "İlaç bulunamadı." }, { status: 404 });
        }

        const created = await MedicineBatch.create({
            medicineId: parsed.data.medicineId,
            barcode: parsed.data.barcode,
            batchNo: "",
            expiryDate: new Date(parsed.data.expiryDate),
            stockQuantity: parsed.data.stockQuantity,
            receivedAt: new Date(parsed.data.receivedAt),
            note: parsed.data.note ?? "",
            createdBy: user.username,
            updatedBy: user.username,
        });

        await createLog({
            username: user.username,
            fullName: user.fullName,
            module: "İlaç Partileri",
            action: "CREATE",
            targetType: "MedicineBatch",
            targetId: String(created._id),
            messageTr: `${user.fullName}, ${medicine.name} ilacına ait yeni kayıt ekledi.`,
        });

        return NextResponse.json({
            ok: true,
            message: "Kayıt başarıyla eklendi.",
            item: created,
        });
    } catch {
        return NextResponse.json(
            { message: "Kayıt eklenirken hata oluştu." },
            { status: 500 }
        );
    }
}
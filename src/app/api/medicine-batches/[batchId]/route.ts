import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { MedicineBatch } from "@/models/MedicineBatch";
import { Medicine } from "@/models/Medicine";
import { getCurrentUser } from "@/lib/auth/current-user";
import { medicineBatchSchema } from "@/validations/medicine-batch.schema";
import { createLog } from "@/lib/audit/create-log";

type Params = {
    params: Promise<{
        batchId: string;
    }>;
};

export async function GET(_: Request, { params }: Params) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const { batchId } = await params;

        await connectToDatabase();

        const item = await MedicineBatch.findById(batchId).lean();

        if (!item) {
            return NextResponse.json({ message: "Kayıt bulunamadı." }, { status: 404 });
        }

        return NextResponse.json({
            item: {
                ...item,
                _id: String(item._id),
                medicineId: String(item.medicineId),
            },
        });
    } catch {
        return NextResponse.json(
            { message: "Kayıt bilgisi alınırken hata oluştu." },
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

        const { batchId } = await params;
        const body = await request.json();
        const parsed = medicineBatchSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0]?.message ?? "Geçersiz veri." },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const batch = await MedicineBatch.findByIdAndUpdate(
            batchId,
            {
                medicineId: parsed.data.medicineId,
                barcode: parsed.data.barcode,
                expiryDate: new Date(parsed.data.expiryDate),
                stockQuantity: parsed.data.stockQuantity,
                receivedAt: new Date(parsed.data.receivedAt),
                note: parsed.data.note ?? "",
                updatedBy: user.username,
            },
            { new: true }
        ).lean();

        if (!batch) {
            return NextResponse.json({ message: "Kayıt bulunamadı." }, { status: 404 });
        }

        const medicine = await Medicine.findById(parsed.data.medicineId).lean();

        await createLog({
            username: user.username,
            fullName: user.fullName,
            module: "İlaç Partileri",
            action: "UPDATE",
            targetType: "MedicineBatch",
            targetId: String(batch._id),
            messageTr: `${user.fullName}, ${medicine?.name ?? "-"} ilacına ait kaydı güncelledi.`,
        });

        return NextResponse.json({
            ok: true,
            message: "Kayıt başarıyla güncellendi.",
            item: batch,
        });
    } catch {
        return NextResponse.json(
            { message: "Kayıt güncellenirken hata oluştu." },
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

        const { batchId } = await params;

        await connectToDatabase();

        const batch = await MedicineBatch.findById(batchId).lean();
        if (!batch) {
            return NextResponse.json({ message: "Kayıt bulunamadı." }, { status: 404 });
        }

        const medicine = await Medicine.findById(batch.medicineId).lean();

        await MedicineBatch.findByIdAndDelete(batchId);

        await createLog({
            username: user.username,
            fullName: user.fullName,
            module: "İlaç Partileri",
            action: "DELETE",
            targetType: "MedicineBatch",
            targetId: String(batch._id),
            messageTr: `${user.fullName}, ${medicine?.name ?? "-"} ilacına ait kaydı sildi.`,
        });

        return NextResponse.json({
            ok: true,
            message: "Kayıt başarıyla silindi.",
        });
    } catch {
        return NextResponse.json(
            { message: "Kayıt silinirken hata oluştu." },
            { status: 500 }
        );
    }
}
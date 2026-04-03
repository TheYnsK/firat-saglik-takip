import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Medicine } from "@/models/Medicine";
import { MedicineBatch } from "@/models/MedicineBatch";
import { getCurrentUser } from "@/lib/auth/current-user";
import { medicineSchema } from "@/validations/medicine.schema";
import { createLog } from "@/lib/audit/create-log";

type Params = {
    params: Promise<{
        medicineId: string;
    }>;
};

export async function GET(_: Request, { params }: Params) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const { medicineId } = await params;

        await connectToDatabase();

        const item = await Medicine.findById(medicineId).lean();

        if (!item) {
            return NextResponse.json({ message: "İlaç bulunamadı." }, { status: 404 });
        }

        return NextResponse.json({
            item: {
                ...item,
                _id: String(item._id),
            },
        });
    } catch {
        return NextResponse.json(
            { message: "İlaç bilgisi alınırken hata oluştu." },
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

        const { medicineId } = await params;
        const body = await request.json();
        const parsed = medicineSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0]?.message ?? "Geçersiz veri." },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const updated = await Medicine.findByIdAndUpdate(
            medicineId,
            {
                name: parsed.data.name,
                type: parsed.data.type,
                measure: parsed.data.measure,
                note: parsed.data.note ?? "",
                lowStockThreshold: parsed.data.lowStockThreshold,
                updatedBy: user.username,
            },
            { new: true }
        ).lean();

        if (!updated) {
            return NextResponse.json({ message: "İlaç bulunamadı." }, { status: 404 });
        }

        await createLog({
            username: user.username,
            fullName: user.fullName,
            module: "İlaçlar",
            action: "UPDATE",
            targetType: "Medicine",
            targetId: String(updated._id),
            messageTr: `${user.fullName}, ${updated.name} adlı ilacı güncelledi.`,
        });

        return NextResponse.json({
            ok: true,
            message: "İlaç başarıyla güncellendi.",
            item: updated,
        });
    } catch {
        return NextResponse.json(
            { message: "İlaç güncellenirken hata oluştu." },
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

        const { medicineId } = await params;

        await connectToDatabase();

        const medicine = await Medicine.findById(medicineId).lean();
        if (!medicine) {
            return NextResponse.json({ message: "İlaç bulunamadı." }, { status: 404 });
        }

        const batchCount = await MedicineBatch.countDocuments({ medicineId });
        if (batchCount > 0) {
            return NextResponse.json(
                { message: "Bu ilaca bağlı kayıt kayıtları bulunduğu için silinemez." },
                { status: 400 }
            );
        }

        await Medicine.findByIdAndDelete(medicineId);

        await createLog({
            username: user.username,
            fullName: user.fullName,
            module: "İlaçlar",
            action: "DELETE",
            targetType: "Medicine",
            targetId: String(medicine._id),
            messageTr: `${user.fullName}, ${medicine.name} adlı ilacı sildi.`,
        });

        return NextResponse.json({
            ok: true,
            message: "İlaç başarıyla silindi.",
        });
    } catch {
        return NextResponse.json(
            { message: "İlaç silinirken hata oluştu." },
            { status: 500 }
        );
    }
}
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AuditLog } from "@/models/AuditLog";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        await connectToDatabase();

        const items = await AuditLog.find()
            .sort({ createdAt: -1 })
            .limit(200)
            .lean();

        return NextResponse.json({
            items: items.map((item: any) => ({
                _id: String(item._id),
                username: item.username,
                fullName: item.fullName,
                module: item.module,
                action: item.action,
                targetType: item.targetType,
                targetId: item.targetId,
                messageTr: item.messageTr,
                createdAt:
                    item.createdAt instanceof Date
                        ? item.createdAt.toISOString()
                        : new Date(item.createdAt).toISOString(),
            })),
        });
    } catch {
        return NextResponse.json(
            { message: "İşlem kayıtları alınırken hata oluştu." },
            { status: 500 }
        );
    }
}
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { profileSchema } from "@/validations/profile.schema";
import { User } from "@/models/User";
import { createLog } from "@/lib/audit/create-log";
import { createSessionToken } from "@/lib/auth/session";
import { env } from "@/lib/env";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        await connectToDatabase();

        const item = await User.findById(user.userId).lean();

        if (!item) {
            return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        return NextResponse.json({
            item: {
                _id: String(item._id),
                fullName: item.fullName,
                username: item.username,
                role: item.role,
                avatarUrl: item.avatarUrl ?? "",
            },
        });
    } catch {
        return NextResponse.json(
            { message: "Profil bilgileri alınırken hata oluştu." },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const body = await request.json();
        const parsed = profileSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0]?.message ?? "Geçersiz veri." },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existingUsername = await User.findOne({
            username: parsed.data.username,
            _id: { $ne: currentUser.userId },
        }).lean();

        if (existingUsername) {
            return NextResponse.json(
                { message: "Bu kullanıcı adı zaten kullanımda." },
                { status: 400 }
            );
        }

        const updated = await User.findByIdAndUpdate(
            currentUser.userId,
            {
                fullName: parsed.data.fullName,
                username: parsed.data.username,
            },
            { new: true }
        ).lean();

        if (!updated) {
            return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        await createLog({
            username: currentUser.username,
            fullName: currentUser.fullName,
            module: "Profil",
            action: "UPDATE",
            targetType: "User",
            targetId: String(updated._id),
            messageTr: `${currentUser.fullName}, profil bilgilerini güncelledi.`,
        });

        const token = await createSessionToken({
            userId: String(updated._id),
            username: updated.username,
            fullName: updated.fullName,
            role: updated.role,
        });

        const response = NextResponse.json({
            ok: true,
            message: "Profil bilgileri başarıyla güncellendi.",
            item: {
                _id: String(updated._id),
                fullName: updated.fullName,
                username: updated.username,
                role: updated.role,
            },
        });

        response.cookies.set(env.COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch {
        return NextResponse.json(
            { message: "Profil güncellenirken hata oluştu." },
            { status: 500 }
        );
    }
}
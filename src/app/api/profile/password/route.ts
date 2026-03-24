import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { passwordChangeSchema } from "@/validations/profile.schema";
import { User } from "@/models/User";
import { createLog } from "@/lib/audit/create-log";

export async function PUT(request: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const body = await request.json();
        const parsed = passwordChangeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0]?.message ?? "Geçersiz veri." },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const user = await User.findById(currentUser.userId);

        if (!user) {
            return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        const passwordOk = await bcrypt.compare(
            parsed.data.currentPassword,
            user.passwordHash
        );

        if (!passwordOk) {
            return NextResponse.json(
                { message: "Mevcut şifre hatalı." },
                { status: 400 }
            );
        }

        user.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
        await user.save();

        await createLog({
            username: currentUser.username,
            fullName: currentUser.fullName,
            module: "Profil",
            action: "UPDATE",
            targetType: "UserPassword",
            targetId: String(user._id),
            messageTr: `${currentUser.fullName}, hesap şifresini değiştirdi.`,
        });

        return NextResponse.json({
            ok: true,
            message: "Şifre başarıyla güncellendi.",
        });
    } catch {
        return NextResponse.json(
            { message: "Şifre güncellenirken hata oluştu." },
            { status: 500 }
        );
    }
}
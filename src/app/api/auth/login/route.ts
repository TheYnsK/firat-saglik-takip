import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { createSessionToken } from "@/lib/auth/session";
import { env } from "@/lib/env";

const loginSchema = z.object({
    username: z.string().min(1, "Kullanıcı adı zorunludur."),
    password: z.string().min(1, "Şifre zorunludur."),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0]?.message ?? "Geçersiz veri." },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const user = await User.findOne({
            username: parsed.data.username,
            isActive: true,
        }).lean();

        if (!user) {
            return NextResponse.json(
                { message: "Kullanıcı bulunamadı." },
                { status: 401 }
            );
        }

        const passwordOk = await bcrypt.compare(
            parsed.data.password,
            user.passwordHash
        );

        if (!passwordOk) {
            return NextResponse.json(
                { message: "Kullanıcı adı veya şifre hatalı." },
                { status: 401 }
            );
        }

        const token = await createSessionToken({
            userId: String(user._id),
            username: user.username,
            fullName: user.fullName,
            role: user.role,
        });

        const response = NextResponse.json({
            ok: true,
            message: "Giriş başarılı.",
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
            { message: "Beklenmeyen bir hata oluştu." },
            { status: 500 }
        );
    }
}
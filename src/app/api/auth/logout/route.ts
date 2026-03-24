import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST() {
    const response = NextResponse.json({
        ok: true,
        message: "Çıkış yapıldı.",
    });

    response.cookies.set(env.COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
    });

    return response;
}
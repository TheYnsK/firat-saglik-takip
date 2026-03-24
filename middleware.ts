import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth/session";
import { env } from "@/lib/env";

const protectedPaths = ["/dashboard", "/medicines", "/products", "/admin"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const needsAuth = protectedPaths.some((path) => pathname.startsWith(path));

    if (!needsAuth) return NextResponse.next();

    const token = request.cookies.get(env.COOKIE_NAME)?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const session = await verifySessionToken(token);

    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/medicines/:path*", "/products/:path*", "/admin/:path*"],
};
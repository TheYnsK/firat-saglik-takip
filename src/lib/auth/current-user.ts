import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { verifySessionToken } from "@/lib/auth/session";

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(env.COOKIE_NAME)?.value;

    if (!token) return null;

    return verifySessionToken(token);
}
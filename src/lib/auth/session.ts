import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";
import type { SessionPayload } from "@/types/auth";

const secret = new TextEncoder().encode(env.SESSION_SECRET);

export async function createSessionToken(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifySessionToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as SessionPayload;
    } catch {
        return null;
    }
}
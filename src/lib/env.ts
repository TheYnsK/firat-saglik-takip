import { z } from "zod";

const envSchema = z.object({
    APP_NAME: z.string().min(1),
    APP_URL: z.string().url(),
    MONGODB_URI: z.string().min(1),
    MONGODB_DB_NAME: z.string().min(1),
    SESSION_SECRET: z.string().min(32),
    COOKIE_NAME: z.string().min(1).default("fst_session"),
    DEFAULT_TIMEZONE: z.string().min(1).default("Europe/Istanbul"),
});

export const env = envSchema.parse({
    APP_NAME: process.env.APP_NAME,
    APP_URL: process.env.APP_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
    SESSION_SECRET: process.env.SESSION_SECRET,
    COOKIE_NAME: process.env.COOKIE_NAME,
    DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE,
});
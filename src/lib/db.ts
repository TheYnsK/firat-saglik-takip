import mongoose from "mongoose";
import { env } from "@/lib/env";

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache:
        | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
        | undefined;
}

const globalCache = globalThis.mongooseCache ?? {
    conn: null,
    promise: null,
};

globalThis.mongooseCache = globalCache;

export async function connectToDatabase() {
    if (globalCache.conn) return globalCache.conn;

    if (!globalCache.promise) {
        globalCache.promise = mongoose.connect(env.MONGODB_URI, {
            dbName: env.MONGODB_DB_NAME,
        });
    }

    globalCache.conn = await globalCache.promise;
    return globalCache.conn;
}
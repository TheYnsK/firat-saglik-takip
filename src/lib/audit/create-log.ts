import { AuditLog } from "@/models/AuditLog";
import { connectToDatabase } from "@/lib/db";

type CreateLogInput = {
    username: string;
    fullName: string;
    module: string;
    action: string;
    targetType: string;
    targetId: string;
    messageTr: string;
};

export async function createLog(input: CreateLogInput) {
    await connectToDatabase();

    await AuditLog.create({
        username: input.username,
        fullName: input.fullName,
        module: input.module,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        messageTr: input.messageTr,
    });
}
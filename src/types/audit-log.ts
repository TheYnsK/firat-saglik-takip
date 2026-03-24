export type AuditLogItem = {
    _id: string;
    username: string;
    fullName: string;
    module: string;
    action: string;
    targetType: string;
    targetId: string;
    messageTr: string;
    createdAt: string;
};
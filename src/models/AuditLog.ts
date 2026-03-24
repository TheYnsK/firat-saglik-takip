import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const auditLogSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        module: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        targetType: {
            type: String,
            required: true,
        },
        targetId: {
            type: String,
            required: true,
        },
        messageTr: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

auditLogSchema.index({ createdAt: -1 });

export type AuditLogDocument = InferSchemaType<typeof auditLogSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const AuditLog: Model<AuditLogDocument> =
    mongoose.models.AuditLog ||
    mongoose.model<AuditLogDocument>("AuditLog", auditLogSchema);
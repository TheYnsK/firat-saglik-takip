import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["staff", "admin"],
            default: "staff",
            required: true,
        },
        avatarUrl: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const User: Model<UserDocument> =
    mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);
import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const medicineBatchSchema = new Schema(
    {
        medicineId: {
            type: Schema.Types.ObjectId,
            ref: "Medicine",
            required: true,
            index: true,
        },
        barcode: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        batchNo: {
            type: String,
            default: "",
            trim: true,
        },
        expiryDate: {
            type: Date,
            required: true,
            index: true,
        },
        stockQuantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        receivedAt: {
            type: Date,
            required: true,
        },
        note: {
            type: String,
            default: "",
            trim: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        updatedBy: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export type MedicineBatchDocument = InferSchemaType<typeof medicineBatchSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const MedicineBatch: Model<MedicineBatchDocument> =
    mongoose.models.MedicineBatch ||
    mongoose.model<MedicineBatchDocument>("MedicineBatch", medicineBatchSchema);
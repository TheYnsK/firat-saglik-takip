import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const medicineTransactionSchema = new Schema(
    {
        medicineId: {
            type: Schema.Types.ObjectId,
            ref: "Medicine",
            required: true,
            index: true,
        },
        batchId: {
            type: Schema.Types.ObjectId,
            ref: "MedicineBatch",
            required: true,
            index: true,
        },
        transactionType: {
            type: String,
            enum: ["IN", "OUT", "ADJUSTMENT"],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        performedBy: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

medicineTransactionSchema.index({ createdAt: -1 });

export type MedicineTransactionDocument = InferSchemaType<
    typeof medicineTransactionSchema
> & {
    _id: mongoose.Types.ObjectId;
};

export const MedicineTransaction: Model<MedicineTransactionDocument> =
    mongoose.models.MedicineTransaction ||
    mongoose.model<MedicineTransactionDocument>(
        "MedicineTransaction",
        medicineTransactionSchema
    );
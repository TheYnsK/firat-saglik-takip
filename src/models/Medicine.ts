import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const medicineSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            trim: true,
        },
        measure: {
            type: String,
            required: true,
            trim: true,
        },
        note: {
            type: String,
            default: "",
            trim: true,
        },
        lowStockThreshold: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
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

medicineSchema.index({ name: 1 });

export type MedicineDocument = InferSchemaType<typeof medicineSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const Medicine: Model<MedicineDocument> =
    mongoose.models.Medicine ||
    mongoose.model<MedicineDocument>("Medicine", medicineSchema);
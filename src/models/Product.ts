import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        barcode: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        type: {
            type: String,
            required: true,
            trim: true,
        },
        stockQuantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        lowStockThreshold: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        hasExpiry: {
            type: Boolean,
            default: false,
        },
        expiryDate: {
            type: Date,
            default: null,
        },
        note: {
            type: String,
            default: "",
            trim: true,
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

productSchema.index({ name: 1 });

export type ProductDocument = InferSchemaType<typeof productSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const Product: Model<ProductDocument> =
    mongoose.models.Product ||
    mongoose.model<ProductDocument>("Product", productSchema);
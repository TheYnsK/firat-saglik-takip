import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const productTransactionSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
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

productTransactionSchema.index({ createdAt: -1 });

export type ProductTransactionDocument = InferSchemaType<
    typeof productTransactionSchema
> & {
    _id: mongoose.Types.ObjectId;
};

export const ProductTransaction: Model<ProductTransactionDocument> =
    mongoose.models.ProductTransaction ||
    mongoose.model<ProductTransactionDocument>(
        "ProductTransaction",
        productTransactionSchema
    );
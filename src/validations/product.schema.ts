import { z } from "zod";

export const productSchema = z
    .object({
        name: z.string().min(1, "Ürün adı zorunludur."),
        barcode: z.string().min(1, "Barkod zorunludur."),
        type: z.string().min(1, "Ürün türü zorunludur."),
        stockQuantity: z.coerce.number().min(0, "Stok 0 veya daha büyük olmalıdır."),
        lowStockThreshold: z.coerce
            .number()
            .min(0, "Düşük stok limiti 0 veya daha büyük olmalıdır."),
        hasExpiry: z.boolean(),
        expiryDate: z.string().nullable().optional(),
        note: z.string().optional().default(""),
    })
    .superRefine((data, ctx) => {
        if (data.hasExpiry && !data.expiryDate) {
            ctx.addIssue({
                code: "custom",
                path: ["expiryDate"],
                message: "SKT işaretlendiyse son kullanma tarihi girilmelidir.",
            });
        }
    });
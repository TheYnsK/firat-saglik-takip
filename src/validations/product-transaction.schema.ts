import { z } from "zod";

export const productTransactionSchema = z.object({
    productId: z.string().min(1, "Ürün seçimi zorunludur."),
    transactionType: z.enum(["IN", "OUT", "ADJUSTMENT"], {
        message: "İşlem türü zorunludur.",
    }),
    quantity: z.coerce.number().min(0, "Miktar 0 veya daha büyük olmalıdır."),
    description: z.string().optional().default(""),
});
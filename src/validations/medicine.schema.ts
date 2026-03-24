import { z } from "zod";

export const medicineSchema = z.object({
    name: z.string().min(1, "İlaç adı zorunludur."),
    type: z.string().min(1, "İlaç türü zorunludur."),
    measure: z.string().min(1, "Ölçü zorunludur."),
    note: z.string().optional().default(""),
    lowStockThreshold: z.coerce
        .number()
        .min(0, "Düşük stok limiti 0 veya daha büyük olmalıdır."),
});
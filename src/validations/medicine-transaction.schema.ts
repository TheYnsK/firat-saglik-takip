import { z } from "zod";

export const medicineTransactionSchema = z.object({
    medicineId: z.string().min(1, "İlaç seçimi zorunludur."),
    batchId: z.string().min(1, "Kayıt seçimi zorunludur."),
    transactionType: z.enum(["IN", "OUT", "ADJUSTMENT"], {
        message: "İşlem türü zorunludur.",
    }),
    quantity: z.coerce.number().min(0, "Miktar 0 veya daha büyük olmalıdır."),
    description: z.string().optional().default(""),
});
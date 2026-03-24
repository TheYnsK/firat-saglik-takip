import { z } from "zod";

export const medicineBatchSchema = z.object({
    medicineId: z.string().min(1, "İlaç seçimi zorunludur."),
    barcode: z.string().min(1, "Barkod zorunludur."),
    batchNo: z.string().min(1, "Parti numarası zorunludur."),
    expiryDate: z.string().min(1, "SKT zorunludur."),
    stockQuantity: z.coerce.number().min(0, "Stok 0 veya daha büyük olmalıdır."),
    receivedAt: z.string().min(1, "Parti giriş tarihi zorunludur."),
    note: z.string().optional().default(""),
});
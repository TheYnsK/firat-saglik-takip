export type MedicineTransactionItem = {
    _id: string;
    medicineId: string;
    medicineName: string;
    batchId: string;
    batchNo: string;
    transactionType: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    description: string;
    performedBy: string;
    createdAt: string;
};
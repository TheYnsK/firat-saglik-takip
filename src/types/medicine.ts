export type MedicineItem = {
    _id: string;
    name: string;
    type: string;
    measure: string;
    note: string;
    lowStockThreshold: number;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
};

export type MedicineSummaryItem = MedicineItem & {
    totalStock: number;
    batchCount: number;
    nearestExpiry: string | null;
    isLowStock: boolean;
    barcodes: string[];
};
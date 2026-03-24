export type ProductItem = {
    _id: string;
    name: string;
    barcode: string;
    type: string;
    stockQuantity: number;
    lowStockThreshold: number;
    hasExpiry: boolean;
    expiryDate: string | null;
    note: string;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
};

export type ProductSummaryItem = ProductItem & {
    isLowStock: boolean;
    isExpired: boolean;
    isExpiringSoon: boolean;
};
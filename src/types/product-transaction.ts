export type ProductTransactionItem = {
    _id: string;
    productId: string;
    productName: string;
    transactionType: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    description: string;
    performedBy: string;
    createdAt: string;
};
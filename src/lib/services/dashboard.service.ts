import { addDays } from "date-fns";
import { connectToDatabase } from "@/lib/db";
import { Medicine } from "@/models/Medicine";
import { MedicineBatch } from "@/models/MedicineBatch";

export async function getMedicineDashboardSummary() {
    await connectToDatabase();

    const medicines = await Medicine.find({ isActive: true }).lean();
    const batches = await MedicineBatch.find().populate("medicineId").lean();

    const now = new Date();
    const next30Days = addDays(now, 30);

    const totalMedicineCount = medicines.length;

    const stockByMedicine = new Map<string, number>();
    for (const batch of batches) {
        const key = String((batch as any).medicineId?._id ?? batch.medicineId);
        stockByMedicine.set(key, (stockByMedicine.get(key) ?? 0) + batch.stockQuantity);
    }

    let lowStockCount = 0;
    const lowStockItems: string[] = [];

    for (const medicine of medicines) {
        const totalStock = stockByMedicine.get(String(medicine._id)) ?? 0;
        if (totalStock <= medicine.lowStockThreshold) {
            lowStockCount++;
            lowStockItems.push(`${medicine.name} (${totalStock})`);
        }
    }

    const expiringItems = batches.filter(
        (item: any) => item.expiryDate >= now && item.expiryDate <= next30Days
    );

    const expiredItems = batches.filter((item: any) => item.expiryDate < now);

    const expiringList = expiringItems.map((item: any) => ({
        _id: String(item._id),
        medicineName: item.medicineId?.name ?? "-",
        barcode: item.barcode ?? "",
        expiryDate:
            item.expiryDate instanceof Date
                ? item.expiryDate.toISOString()
                : new Date(item.expiryDate).toISOString(),
        stockQuantity: Number(item.stockQuantity ?? 0),
    }));

    const expiredList = expiredItems.map((item: any) => ({
        _id: String(item._id),
        medicineName: item.medicineId?.name ?? "-",
        barcode: item.barcode ?? "",
        expiryDate:
            item.expiryDate instanceof Date
                ? item.expiryDate.toISOString()
                : new Date(item.expiryDate).toISOString(),
        stockQuantity: Number(item.stockQuantity ?? 0),
    }));

    return {
        totalMedicineCount,
        lowStockCount,
        expiringCount: expiringItems.length,
        expiredCount: expiredItems.length,
        lowStockItems,
        expiringList,
        expiredList,
    };
}
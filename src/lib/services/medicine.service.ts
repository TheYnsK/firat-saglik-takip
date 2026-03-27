import { connectToDatabase } from "@/lib/db";
import { Medicine } from "@/models/Medicine";
import { MedicineBatch } from "@/models/MedicineBatch";
import { MedicineTransaction } from "@/models/MedicineTransaction";
import type { MedicineSummaryItem } from "@/types/medicine";
import { Types } from "mongoose";

export async function listMedicinesWithSummary(): Promise<MedicineSummaryItem[]> {
    await connectToDatabase();

    const medicines = await Medicine.find({ isActive: true })
        .sort({ createdAt: -1 })
        .lean();

    const medicineIds = medicines.map((item) => item._id);

    const batchGroups = await MedicineBatch.aggregate([
        {
            $match: {
                medicineId: { $in: medicineIds },
            },
        },
        {
            $group: {
                _id: "$medicineId",
                totalStock: { $sum: "$stockQuantity" },
                batchCount: { $sum: 1 },
                nearestExpiry: { $min: "$expiryDate" },
            },
        },
    ]);

    const batchMap = new Map(
        batchGroups.map((item) => [String(item._id), item])
    );

    return medicines.map((medicine) => {
        const summary = batchMap.get(String(medicine._id));

        const totalStock = Number(summary?.totalStock ?? 0);
        const batchCount = Number(summary?.batchCount ?? 0);
        const nearestExpiry = summary?.nearestExpiry ?? null;

        return {
            _id: String(medicine._id),
            name: medicine.name,
            type: medicine.type,
            measure: medicine.measure,
            note: medicine.note ?? "",
            lowStockThreshold: medicine.lowStockThreshold,
            createdBy: medicine.createdBy,
            updatedBy: medicine.updatedBy,
            createdAt:
                medicine.createdAt instanceof Date
                    ? medicine.createdAt.toISOString()
                    : new Date(medicine.createdAt).toISOString(),
            updatedAt:
                medicine.updatedAt instanceof Date
                    ? medicine.updatedAt.toISOString()
                    : new Date(medicine.updatedAt).toISOString(),
            totalStock,
            batchCount,
            nearestExpiry: nearestExpiry
                ? new Date(nearestExpiry).toISOString()
                : null,
            isLowStock: totalStock <= medicine.lowStockThreshold,
        };
    });
}

export async function createMedicine(input: {
    name: string;
    type: string;
    measure: string;
    note?: string;
    lowStockThreshold: number;
    username: string;
}) {
    await connectToDatabase();

    const created = await Medicine.create({
        name: input.name,
        type: input.type,
        measure: input.measure,
        note: input.note ?? "",
        lowStockThreshold: input.lowStockThreshold,
        isActive: true,
        createdBy: input.username,
        updatedBy: input.username,
    });

    return created;
}

export async function listMedicineBatches() {
    await connectToDatabase();

    const batches = await MedicineBatch.find()
        .populate("medicineId")
        .sort({ expiryDate: 1, createdAt: -1 })
        .lean();

    return batches.map((item: any) => ({
        _id: String(item._id),
        medicineId: String(item.medicineId?._id ?? item.medicineId),
        medicineName: item.medicineId?.name ?? "-",
        medicineType: item.medicineId?.type ?? "-",
        medicineMeasure: item.medicineId?.measure ?? "-",
        barcode: item.barcode,
        expiryDate:
            item.expiryDate instanceof Date
                ? item.expiryDate.toISOString()
                : new Date(item.expiryDate).toISOString(),
        stockQuantity: Number(item.stockQuantity ?? 0),
        receivedAt:
            item.receivedAt instanceof Date
                ? item.receivedAt.toISOString()
                : new Date(item.receivedAt).toISOString(),
        note: item.note ?? "",
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
        createdAt:
            item.createdAt instanceof Date
                ? item.createdAt.toISOString()
                : new Date(item.createdAt).toISOString(),
        updatedAt:
            item.updatedAt instanceof Date
                ? item.updatedAt.toISOString()
                : new Date(item.updatedAt).toISOString(),
    }));
}

export async function getMedicineControlResult(query: string) {
    await connectToDatabase();

    const trimmed = query.trim();
    if (!trimmed) return null;

    let batchMatch = await MedicineBatch.findOne({
        barcode: trimmed,
    })
        .populate("medicineId")
        .lean();

    if (batchMatch?.medicineId) {
        const medicineId = String((batchMatch as any).medicineId._id);
        return getMedicineWithBatchesById(medicineId);
    }

    const medicine = await Medicine.findOne({
        name: { $regex: trimmed, $options: "i" },
        isActive: true,
    }).lean();

    if (!medicine) return null;

    return getMedicineWithBatchesById(String(medicine._id));
}

export async function getMedicineWithBatchesById(medicineId: string) {
    await connectToDatabase();

    const medicine = await Medicine.findById(medicineId).lean();
    if (!medicine) return null;

    const batches = await MedicineBatch.find({ medicineId: medicine._id })
        .sort({ expiryDate: 1, receivedAt: -1 })
        .lean();

    const totalStock = batches.reduce(
        (sum, batch) => sum + Number(batch.stockQuantity ?? 0),
        0
    );

    return {
        medicine: {
            _id: String(medicine._id),
            name: medicine.name,
            type: medicine.type,
            measure: medicine.measure,
            note: medicine.note ?? "",
            lowStockThreshold: medicine.lowStockThreshold,
            totalStock,
            isLowStock: totalStock <= medicine.lowStockThreshold,
        },
        batches: batches.map((batch) => ({
            _id: String(batch._id),
            barcode: batch.barcode,
            expiryDate:
                batch.expiryDate instanceof Date
                    ? batch.expiryDate.toISOString()
                    : new Date(batch.expiryDate).toISOString(),
            stockQuantity: Number(batch.stockQuantity ?? 0),
            receivedAt:
                batch.receivedAt instanceof Date
                    ? batch.receivedAt.toISOString()
                    : new Date(batch.receivedAt).toISOString(),
            note: batch.note ?? "",
        })),
    };
}

export async function listMedicineTransactions() {
    await connectToDatabase();

    const items = await MedicineTransaction.find()
        .populate("medicineId")
        .populate("batchId")
        .sort({ createdAt: -1 })
        .lean();

    return items.map((item: any) => ({
        _id: String(item._id),
        medicineId: String(item.medicineId?._id ?? ""),
        medicineName: item.medicineId?.name ?? "-",
        batchId: String(item.batchId?._id ?? ""),
        barcode: item.batchId?.barcode ?? "-",
        transactionType: item.transactionType,
        quantity: Number(item.quantity ?? 0),
        description: item.description ?? "",
        performedBy: item.performedBy,
        createdAt:
            item.createdAt instanceof Date
                ? item.createdAt.toISOString()
                : new Date(item.createdAt).toISOString(),
    }));
}

export async function createMedicineTransaction(input: {
    medicineId: string;
    batchId: string;
    transactionType: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    description?: string;
    username: string;
}) {
    await connectToDatabase();

    const batch = await MedicineBatch.findById(input.batchId);
    if (!batch) {
        throw new Error("PARTI_NOT_FOUND");
    }

    const medicine = await Medicine.findById(input.medicineId).lean();
    if (!medicine) {
        throw new Error("MEDICINE_NOT_FOUND");
    }

    if (String(batch.medicineId) !== input.medicineId) {
        throw new Error("MEDICINE_BATCH_MISMATCH");
    }

    if (input.transactionType === "IN") {
        batch.stockQuantity += input.quantity;
    } else if (input.transactionType === "OUT") {
        if (batch.stockQuantity < input.quantity) {
            throw new Error("INSUFFICIENT_STOCK");
        }
        batch.stockQuantity -= input.quantity;
    } else if (input.transactionType === "ADJUSTMENT") {
        batch.stockQuantity = input.quantity;
    }

    batch.updatedBy = input.username;
    await batch.save();

    const transaction = await MedicineTransaction.create({
        medicineId: new Types.ObjectId(input.medicineId),
        batchId: new Types.ObjectId(input.batchId),
        transactionType: input.transactionType,
        quantity: input.quantity,
        description: input.description ?? "",
        performedBy: input.username,
    });

    return {
        transaction,
        medicineName: medicine.name,
        barcode: batch.barcode,
        newStockQuantity: batch.stockQuantity,
    };
}
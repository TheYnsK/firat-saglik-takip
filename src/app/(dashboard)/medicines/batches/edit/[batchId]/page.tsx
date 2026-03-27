import { connectToDatabase } from "@/lib/db";
import { MedicineBatch } from "@/models/MedicineBatch";
import { notFound } from "next/navigation";
import { MedicineBatchForm } from "@/components/medicines/medicine-batch-form";

type Params = {
    params: Promise<{
        batchId: string;
    }>;
};

export default async function MedicineBatchEditDetailPage({ params }: Params) {
    const { batchId } = await params;

    await connectToDatabase();

    const batch = await MedicineBatch.findById(batchId).lean();

    if (!batch) {
        notFound();
    }

    const toDateInput = (value: Date | string) =>
        new Date(value).toISOString().split("T")[0];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    Kaydı Düzenle
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Kayıt bilgilerini güncelleyin veya kaydı silin.
                </p>
            </div>

            <MedicineBatchForm
                mode="edit"
                batchId={batchId}
                initialValues={{
                    medicineId: String(batch.medicineId),
                    barcode: batch.barcode,
                    expiryDate: toDateInput(batch.expiryDate),
                    stockQuantity: batch.stockQuantity,
                    receivedAt: toDateInput(batch.receivedAt),
                    note: batch.note ?? "",
                }}
            />
        </div>
    );
}
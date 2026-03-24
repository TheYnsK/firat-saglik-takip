import { connectToDatabase } from "@/lib/db";
import { Medicine } from "@/models/Medicine";
import { notFound } from "next/navigation";
import { MedicineForm } from "@/components/medicines/medicine-form";

type Params = {
    params: Promise<{
        medicineId: string;
    }>;
};

export default async function MedicineEditDetailPage({ params }: Params) {
    const { medicineId } = await params;

    await connectToDatabase();

    const medicine = await Medicine.findById(medicineId).lean();

    if (!medicine) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    İlaç Kaydını Düzenle
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    İlaç bilgilerini güncelleyin veya kaydı silin.
                </p>
            </div>

            <MedicineForm
                mode="edit"
                medicineId={medicineId}
                initialValues={{
                    name: medicine.name,
                    type: medicine.type,
                    measure: medicine.measure,
                    note: medicine.note ?? "",
                    lowStockThreshold: medicine.lowStockThreshold,
                }}
            />
        </div>
    );
}
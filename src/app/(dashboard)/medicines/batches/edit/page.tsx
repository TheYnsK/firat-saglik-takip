import { MedicineBatchForm } from "@/components/medicines/medicine-batch-form";
import { MedicineBatchTable } from "@/components/medicines/medicine-batch-table";
import { listMedicineBatches } from "@/lib/services/medicine.service";

export default async function MedicineBatchesEditPage() {
    const items = await listMedicineBatches();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    İlaç Parti Listesini Düzenleme
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Yeni parti ekleyin ve mevcut parti kayıtlarını görüntüleyin.
                </p>
            </div>

            <MedicineBatchForm />

            <div>
                <h3 className="mb-4 text-lg font-bold text-slate-800">Mevcut Partiler</h3>
                <MedicineBatchTable items={items} showActions />
            </div>
        </div>
    );
}
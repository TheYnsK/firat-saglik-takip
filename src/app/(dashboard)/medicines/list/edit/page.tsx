import { MedicineForm } from "@/components/medicines/medicine-form";
import { listMedicinesWithSummary } from "@/lib/services/medicine.service";
import { MedicineListTable } from "@/components/medicines/medicine-list-table";

export default async function MedicineEditPage() {
    const items = await listMedicinesWithSummary();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    İlaç Listesini Düzenleme
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Yeni ilaç ekleyin, düşük stok limitlerini yönetin ve mevcut kayıtları görüntüleyin.
                </p>
            </div>

            <MedicineForm />

            <div>
                <h3 className="mb-4 text-lg font-bold text-slate-800">Mevcut İlaçlar</h3>
                <MedicineListTable items={items} showActions />
            </div>
        </div>
    );
}
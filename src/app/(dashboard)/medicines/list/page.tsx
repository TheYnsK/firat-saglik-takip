import { listMedicinesWithSummary } from "@/lib/services/medicine.service";
import { MedicineListTable } from "@/components/medicines/medicine-list-table";
import Link from "next/link";

export default async function MedicineListPage() {
    const items = await listMedicinesWithSummary();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                        İlaç Listesi
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Sisteme eklenen tüm ilaç kartlarını burada görüntüleyin.
                    </p>
                </div>

                <Link
                    href="/medicines/list/edit"
                    className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 font-bold text-white shadow-md transition hover:scale-[1.01]"
                >
                    İlaç Listesini Düzenle
                </Link>
            </div>

            <MedicineListTable items={items} />
        </div>
    );
}
import Link from "next/link";
import { listMedicineBatches } from "@/lib/services/medicine.service";
import { MedicineBatchTable } from "@/components/medicines/medicine-batch-table";

export default async function MedicineBatchesPage() {
    const items = await listMedicineBatches();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                        İlaç Parti Listesi
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Eklenmiş ilaçların tüm parti kayıtlarını burada görüntüleyin.
                    </p>
                </div>

                <Link
                    href="/medicines/batches/edit"
                    className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 font-bold text-white shadow-md transition hover:scale-[1.01]"
                >
                    Parti Listesini Düzenle
                </Link>
            </div>

            <MedicineBatchTable items={items} />
        </div>
    );
}
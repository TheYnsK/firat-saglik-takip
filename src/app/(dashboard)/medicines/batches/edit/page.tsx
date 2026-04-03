import { MedicineBatchForm } from "@/components/medicines/medicine-batch-form";
import { MedicineBatchTable } from "@/components/medicines/medicine-batch-table";
import { listMedicineBatchesPaginated } from "@/lib/services/medicine.service";
import { Pagination } from "@/components/shared/pagination";
import { AutoSearchForm } from "@/components/shared/auto-search-form";

type Props = {
    searchParams: Promise<{
        page?: string;
        q?: string;
    }>;
};

export default async function MedicineBatchEditPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = Number(params.page ?? "1");
    const q = params.q ?? "";

    const result = await listMedicineBatchesPaginated(page, 20, q);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    Kayıt Listesini Düzenleme
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Yeni kayıt ekleyin ve mevcut kayıtları yönetin.
                </p>
            </div>

            <MedicineBatchForm />

            <div>
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-bold text-slate-800">Mevcut Kayıtlar</h3>
                    <p className="text-sm text-slate-500">
                        Toplam kayıt: {result.totalCount} · Sayfa: {result.currentPage}/{result.totalPages}
                    </p>
                </div>

                <AutoSearchForm
                    label="İlaç adı veya barkod ile ara"
                    placeholder="Örn: Parol veya barkod numarası"
                />

                <MedicineBatchTable items={result.items} showActions />

                <div className="mt-6">
                    <Pagination
                        currentPage={result.currentPage}
                        totalPages={result.totalPages}
                        basePath="/medicines/batches/edit"
                        query={{ q }}
                    />
                </div>
            </div>
        </div>
    );
}
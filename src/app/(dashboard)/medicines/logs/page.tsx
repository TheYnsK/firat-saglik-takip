import { MedicineLogTable } from "@/components/medicines/medicine-log-table";
import { Pagination } from "@/components/shared/pagination";
import { listMedicineLogsPaginated } from "@/lib/services/audit.service";
import { AutoSearchForm } from "@/components/shared/auto-search-form";

type Props = {
    searchParams: Promise<{
        page?: string;
        q?: string;
    }>;
};

export default async function MedicineLogsPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = Number(params.page ?? "1");
    const q = params.q ?? "";

    const result = await listMedicineLogsPaginated(page, 20, q);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    İşlem Kayıtları
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Sadece ilaç tarafındaki kayıt ve stok işlemleri burada gösterilir.
                </p>
            </div>

            <AutoSearchForm
                label="Kullanıcı, modül, işlem veya açıklama ile ara"
                placeholder=" "
            />

            <div className="rounded-3xl border border-slate-200 bg-transparent">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-slate-500">
                        Toplam kayıt: {result.totalCount} · Sayfa: {result.currentPage}/{result.totalPages}
                    </p>
                </div>

                <MedicineLogTable items={result.items} />

                <div className="mt-6">
                    <Pagination
                        currentPage={result.currentPage}
                        totalPages={result.totalPages}
                        basePath="/medicines/logs"
                        query={{ q }}
                    />
                </div>
            </div>
        </div>
    );
}
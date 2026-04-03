import { MedicineForm } from "@/components/medicines/medicine-form";
import { listMedicinesWithSummaryPaginated } from "@/lib/services/medicine.service";
import { MedicineListTable } from "@/components/medicines/medicine-list-table";
import { Pagination } from "@/components/shared/pagination";
import { AutoSearchForm } from "@/components/shared/auto-search-form";

type Props = {
    searchParams: Promise<{
        page?: string;
        q?: string;
    }>;
};

export default async function MedicineEditPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = Number(params.page ?? "1");
    const q = params.q ?? "";

    const result = await listMedicinesWithSummaryPaginated(page, 20, q);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-slate-900">İlaç Listesini Düzenleme</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Yeni ilaç ekleyin, düşük stok limitlerini yönetin ve mevcut kayıtları görüntüleyin.
                </p>
            </div>

            <MedicineForm />

            <div>
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Mevcut İlaçlar</h3>
                    <p className="text-sm text-slate-500">
                        Toplam kayıt: {result.totalCount} · Sayfa: {result.currentPage}/{result.totalPages}
                    </p>
                </div>

                <AutoSearchForm
                    label="İlaç adı veya barkod ile ara"
                    placeholder="Örn: Parol veya barkod numarası"
                />

                <MedicineListTable items={result.items} showActions />

                <div className="mt-6">
                    <Pagination
                        currentPage={result.currentPage}
                        totalPages={result.totalPages}
                        basePath="/medicines/list/edit"
                        query={{ q }}
                    />
                </div>
            </div>
        </div>
    );
}
import { listMedicinesWithSummaryPaginated } from "@/lib/services/medicine.service";
import { MedicineListTable } from "@/components/medicines/medicine-list-table";
import { Pagination } from "@/components/shared/pagination";
import Link from "next/link";
import { AutoSearchForm } from "@/components/shared/auto-search-form";

type Props = {
    searchParams: Promise<{
        page?: string;
        q?: string;
    }>;
};

export default async function MedicineListPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = Number(params.page ?? "1");
    const q = params.q ?? "";

    const result = await listMedicinesWithSummaryPaginated(page, 20, q);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">İlaç Listesi</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Sisteme eklenen tüm ilaç kartlarını burada görüntüleyin.
                    </p>
                </div>

                <Link
                    href="/medicines/list/edit"
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 font-bold !text-white no-underline shadow-md transition hover:scale-[1.01] hover:!text-white visited:!text-white"
                >
                    İlaç Listesini Düzenle
                </Link>
            </div>

            <AutoSearchForm
                label="İlaç adı veya barkod ile ara"
                placeholder="Örn: Parol veya barkod numarası"
            />

            <p className="text-sm text-slate-500">
                Toplam kayıt: {result.totalCount} · Sayfa: {result.currentPage}/{result.totalPages}
            </p>

            <MedicineListTable items={result.items} />

            <Pagination
                currentPage={result.currentPage}
                totalPages={result.totalPages}
                basePath="/medicines/list"
                query={{ q }}
            />
        </div>
    );
}
import { MedicineControlSearch } from "@/components/medicines/medicine-control-search";

export default function MedicineControlPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    İlaç Kontrolü
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    İlaç adı veya barkod ile sorgulama yaparak ilaç ve parti bilgilerini
                    görüntüleyin.
                </p>
            </div>

            <MedicineControlSearch />
        </div>
    );
}
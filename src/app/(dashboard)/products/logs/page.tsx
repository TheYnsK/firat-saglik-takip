import { connectToDatabase } from "@/lib/db";
import { AuditLog } from "@/models/AuditLog";
import { ProductLogTable } from "@/components/products/product-log-table";

export default async function ProductLogsPage() {
    await connectToDatabase();

    const items = await AuditLog.find({
        module: {
            $in: ["Ürünler", "Ürün Stok Hareketleri"],
        },
    })
        .sort({ createdAt: -1 })
        .limit(200)
        .lean();

    const normalized = items.map((item: any) => ({
        _id: String(item._id),
        fullName: item.fullName,
        module: item.module,
        action: item.action,
        messageTr: item.messageTr,
        createdAt:
            item.createdAt instanceof Date
                ? item.createdAt.toISOString()
                : new Date(item.createdAt).toISOString(),
    }));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    İşlem Kayıtları
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Ürün ekleme, düzenleme, silme ve stok işlemlerini buradan takip edin.
                </p>
            </div>

            <ProductLogTable items={normalized} />
        </div>
    );
}
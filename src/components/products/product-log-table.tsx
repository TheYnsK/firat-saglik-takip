type LogItem = {
    _id: string;
    fullName: string;
    module: string;
    action: string;
    messageTr: string;
    createdAt: string;
};

type Props = {
    items: LogItem[];
};

function getActionMeta(action: string) {
    switch (action) {
        case "CREATE":
            return {
                label: "Ekleme",
                className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
            };
        case "UPDATE":
            return {
                label: "Güncelleme",
                className: "bg-amber-100 text-amber-700 border border-amber-200",
            };
        case "DELETE":
            return {
                label: "Çıkarma",
                className: "bg-rose-100 text-rose-700 border border-rose-200",
            };
        case "IN":
            return {
                label: "Stok Girişi",
                className: "bg-cyan-100 text-cyan-700 border border-cyan-200",
            };
        case "OUT":
            return {
                label: "Stok Çıkışı",
                className: "bg-orange-100 text-orange-700 border border-orange-200",
            };
        case "ADJUSTMENT":
            return {
                label: "Stok Düzeltme",
                className: "bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200",
            };
        default:
            return {
                label: action,
                className: "bg-slate-100 text-slate-700 border border-slate-200",
            };
    }
}

export function ProductLogTable({ items }: Props) {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                        <th className="px-4 py-3 font-semibold">Tarih</th>
                        <th className="px-4 py-3 font-semibold">Kullanıcı</th>
                        <th className="px-4 py-3 font-semibold">Modül</th>
                        <th className="px-4 py-3 font-semibold">İşlem</th>
                        <th className="px-4 py-3 font-semibold">Açıklama</th>
                    </tr>
                    </thead>

                    <tbody>
                    {items.map((item) => {
                        const actionMeta = getActionMeta(item.action);

                        return (
                            <tr key={item._id} className="border-t border-slate-100">
                                <td className="px-4 py-3 text-slate-700">
                                    {new Date(item.createdAt).toLocaleString("tr-TR")}
                                </td>
                                <td className="px-4 py-3 font-semibold text-slate-900">
                                    {item.fullName}
                                </td>
                                <td className="px-4 py-3 text-slate-700">{item.module}</td>
                                <td className="px-4 py-3">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${actionMeta.className}`}
                    >
                      {actionMeta.label}
                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{item.messageTr}</td>
                            </tr>
                        );
                    })}

                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                                Henüz işlem kaydı bulunmuyor.
                            </td>
                        </tr>
                    ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
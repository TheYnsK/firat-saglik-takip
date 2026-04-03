import Link from "next/link";

type Props = {
    currentPage: number;
    totalPages: number;
    basePath: string;
    query?: Record<string, string | undefined>;
};

export function Pagination({
                               currentPage,
                               totalPages,
                               basePath,
                               query = {},
                           }: Props) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    function buildHref(page: number) {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value && value.trim()) {
                params.set(key, value);
            }
        });

        params.set("page", String(page));

        return `${basePath}?${params.toString()}`;
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
                href={buildHref(Math.max(1, currentPage - 1))}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    currentPage === 1
                        ? "pointer-events-none bg-slate-100 text-slate-400"
                        : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
            >
                Önceki
            </Link>

            {pages.map((page) => (
                <Link
                    key={page}
                    href={buildHref(page)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        page === currentPage
                            ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-md"
                            : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                    }`}
                >
                    {page}
                </Link>
            ))}

            <Link
                href={buildHref(Math.min(totalPages, currentPage + 1))}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    currentPage === totalPages
                        ? "pointer-events-none bg-slate-100 text-slate-400"
                        : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
            >
                Sonraki
            </Link>
        </div>
    );
}
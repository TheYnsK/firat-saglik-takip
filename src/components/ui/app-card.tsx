import { cn } from "@/lib/utils";

type AppCardProps = {
    title: string;
    value: string;
    className?: string;
};

export function AppCard({ title, value, className }: AppCardProps) {
    return (
        <div
            className={cn(
                "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md",
                className
            )}
        >
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="mt-3 text-3xl font-black text-slate-900">{value}</h3>
        </div>
    );
}
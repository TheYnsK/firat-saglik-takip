import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    X,
    LayoutDashboard,
    Search,
    List,
    Boxes,
    ArrowRightLeft,
    History,
    Package2,
} from "lucide-react";

type SidebarProps = {
    mobileOpen: boolean;
    onClose: () => void;
};

const generalNav = [
    { label: "Genel Durum", href: "/dashboard", icon: LayoutDashboard },
];

const medicineNav = [
    { label: "Ana Ekran", href: "/medicines", icon: LayoutDashboard },
    { label: "İlaç Kontrolü", href: "/medicines/control", icon: Search },
    { label: "İlaç Listesi", href: "/medicines/list", icon: List },
    { label: "İlaç Kayıt Listesi", href: "/medicines/batches", icon: Boxes },
    { label: "Stok Hareketleri", href: "/medicines/stock-movements", icon: ArrowRightLeft },
    { label: "İşlem Kayıtları", href: "/medicines/logs", icon: History },
];

const productNav = [
    { label: "Ana Ekran", href: "/products", icon: Package2 },
    { label: "Ürün Kontrolü", href: "/products/control", icon: Search },
    { label: "Ürün Listesi", href: "/products/list", icon: List },
    { label: "Stok Takibi", href: "/products/stock", icon: ArrowRightLeft },
    { label: "İşlem Kayıtları", href: "/products/logs", icon: History },
];

function NavLink({
                     href,
                     label,
                     icon: Icon,
                     active,
                     onClick,
                 }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    active: boolean;
    onClick?: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={[
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                    ? "bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 text-cyan-700 ring-1 ring-cyan-200"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
            ].join(" ")}
        >
            <Icon size={18} />
            <span>{label}</span>
        </Link>
    );
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {mobileOpen ? (
                <button
                    type="button"
                    aria-label="Menüyü kapat"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
                />
            ) : null}

            <aside
                className={[
                    "fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-[320px] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:w-80 lg:max-w-none lg:translate-x-0 lg:shadow-none",
                    mobileOpen ? "translate-x-0" : "-translate-x-full",
                ].join(" ")}
            >
                <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-fuchsia-50 p-5">
                    <div className="min-w-0">
                        <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-lg font-black text-transparent">
                            Fırat Sağlık Takip
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Fırat Üniversitesi Sağlık Birimi
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
                        aria-label="Menüyü kapat"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                    <div className="space-y-8">
                        <div>
                            <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-sky-700">
                                GENEL
                            </h3>
                            <div className="space-y-1">
                                {generalNav.map((item) => (
                                    <NavLink
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        icon={item.icon}
                                        active={pathname === item.href}
                                        onClick={onClose}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-cyan-700">
                                İLAÇLAR
                            </h3>
                            <div className="space-y-1">
                                {medicineNav.map((item) => (
                                    <NavLink
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        icon={item.icon}
                                        active={pathname === item.href}
                                        onClick={onClose}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-fuchsia-700">
                                ÜRÜNLER
                            </h3>
                            <div className="space-y-1">
                                {productNav.map((item) => (
                                    <NavLink
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        icon={item.icon}
                                        active={pathname === item.href}
                                        onClick={onClose}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
import {
    LayoutDashboard,
    Pill,
    Package2,
    Search,
    List,
    Boxes,
    ArrowRightLeft,
    FileBarChart2,
    CalendarDays,
    History,
    Settings,
} from "lucide-react";

export const medicineNav = [
    { label: "Ana Ekran", href: "/medicines", icon: LayoutDashboard },
    { label: "İlaç Kontrolü", href: "/medicines/control", icon: Search },
    { label: "İlaç Listesi", href: "/medicines/list", icon: List },
    { label: "İlaç Kayıt Listesi", href: "/medicines/batches", icon: Boxes },
    { label: "Stok Hareketleri", href: "/medicines/stock-movements", icon: ArrowRightLeft },
    { label: "İlaç Raporlama", href: "/medicines/reports", icon: FileBarChart2 },
    { label: "Takvim", href: "/medicines/calendar", icon: CalendarDays },
    { label: "İşlem Kayıtları", href: "/medicines/logs", icon: History },
    { label: "Ayarlar", href: "/medicines/settings", icon: Settings },
];

export const productNav = [
    { label: "Ana Ekran", href: "/products", icon: LayoutDashboard },
    { label: "Ürün Kontrolü", href: "/products/control", icon: Search },
    { label: "Ürün Listesi", href: "/products/list", icon: List },
    { label: "Ürün Stok Takibi", href: "/products/stock", icon: ArrowRightLeft },
    { label: "Ürün Raporlama", href: "/products/reports", icon: FileBarChart2 },
    { label: "Ürün İşlem Kayıtları", href: "/products/logs", icon: History },
];

export const rootQuickLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "İlaçlar", href: "/medicines", icon: Pill },
    { label: "Ürünler", href: "/products", icon: Package2 },
];
"use client";

import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

type TopbarProps = {
    fullName: string;
    username: string;
    onMenuClick: () => void;
};

export function Topbar({ fullName, username, onMenuClick }: TopbarProps) {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur md:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                    aria-label="Menüyü aç"
                >
                    <Menu size={20} />
                </button>

                <div className="min-w-0">
                    <p className="text-xs text-slate-500 sm:text-sm">Hoş geldiniz</p>
                    <h1 className="truncate text-base font-black text-slate-900 sm:text-xl">
                        {fullName}
                    </h1>
                </div>
            </div>

            <button
                type="button"
                onClick={() => router.push("/profile")}
                className="ml-3 flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50/40"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-500 font-black text-white sm:h-11 sm:w-11">
                    {fullName.slice(0, 1).toUpperCase()}
                </div>

                <div className="hidden sm:block text-left">
                    <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
                        {fullName}
                    </p>
                    <p className="max-w-[180px] truncate text-xs text-slate-500">
                        @{username}
                    </p>
                </div>
            </button>
        </header>
    );
}
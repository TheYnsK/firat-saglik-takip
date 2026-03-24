"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, FileSpreadsheet } from "lucide-react";

type ExportOption = {
    label: string;
    href: string;
};

type Props = {
    buttonLabel?: string;
    options: ExportOption[];
};

export function ExcelExportMenu({
                                    buttonLabel = "Excel Çıktısı Al",
                                    options,
                                }: Props) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 font-bold text-white shadow-md transition hover:scale-[1.01]"
            >
                <FileSpreadsheet size={18} />
                <span>{buttonLabel}</span>
                <ChevronDown size={18} />
            </button>

            {open ? (
                <div className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="p-2">
                        {options.map((option) => (
                            <a
                                key={option.href}
                                href={option.href}
                                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                                onClick={() => setOpen(false)}
                            >
                                {option.label}
                            </a>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
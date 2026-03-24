"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmDialog({
                                  open,
                                  title,
                                  description,
                                  confirmText = "Sil",
                                  cancelText = "İptal",
                                  loading = false,
                                  onConfirm,
                                  onCancel,
                              }: ConfirmDialogProps) {
    useEffect(() => {
        if (!open) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !loading) {
                onCancel();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, loading, onCancel]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => {
                if (!loading) onCancel();
            }}
        >
            <div
                className="relative w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    aria-label="Kapat"
                    className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 disabled:opacity-60"
                >
                    <X size={18} />
                </button>

                <div className="flex items-start gap-4 pr-12">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-xl font-black text-rose-700">
                        !
                    </div>

                    <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-900">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-2xl bg-rose-600 px-5 py-3 font-bold text-white shadow-md transition hover:bg-rose-700 disabled:opacity-60"
                    >
                        {loading ? "İşleniyor..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
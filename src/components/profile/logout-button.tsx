"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function LogoutButton() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);

        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });

            router.replace("/login");
            router.refresh();
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white shadow-md transition hover:bg-slate-800"
            >
                Çıkış Yap
            </button>

            <ConfirmDialog
                open={open}
                title="Çıkış yapmak üzeresiniz"
                description="Oturumunuz kapatılacak. Çıkış yapmak istediğinize emin misiniz?"
                confirmText="Evet, çıkış yap"
                cancelText="Vazgeç"
                loading={loading}
                onConfirm={handleLogout}
                onCancel={() => setOpen(false)}
            />
        </>
    );
}
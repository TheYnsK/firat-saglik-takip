"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

type AppShellProps = {
    fullName: string;
    username: string;
    children: React.ReactNode;
};

export function AppShell({
                             fullName,
                             username,
                             children,
                         }: AppShellProps) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setMobileSidebarOpen(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        if (mobileSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [mobileSidebarOpen]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="lg:flex">
                <Sidebar
                    mobileOpen={mobileSidebarOpen}
                    onClose={() => setMobileSidebarOpen(false)}
                />

                <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                    <Topbar
                        fullName={fullName}
                        username={username}
                        onMenuClick={() => setMobileSidebarOpen(true)}
                    />

                    <main className="min-w-0 flex-1 bg-gradient-to-b from-slate-50 to-sky-50/40 px-4 py-4 sm:px-5 md:px-6 lg:px-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
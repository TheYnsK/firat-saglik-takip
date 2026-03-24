import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { AppShell } from "@/components/layout/app-shell";

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <AppShell fullName={user.fullName} username={user.username}>
            {children}
        </AppShell>
    );
}
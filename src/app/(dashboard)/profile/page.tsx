import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { User } from "@/models/User";
import { ProfileForm } from "@/components/profile/profile-form";
import { PasswordForm } from "@/components/profile/password-form";

export default async function ProfilePage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    await connectToDatabase();

    const user = await User.findById(currentUser.userId).lean();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    Profil Ayarları
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Kullanıcı bilgilerinizi ve şifrenizi buradan güncelleyebilirsiniz.
                </p>
            </div>

            <div className="grid gap-8 xl:grid-cols-2">
                <div>
                    <h3 className="mb-4 text-lg font-bold text-slate-800">
                        Kullanıcı Bilgileri
                    </h3>
                    <ProfileForm
                        initialValues={{
                            fullName: user.fullName,
                            username: user.username,
                            role: user.role,
                        }}
                    />
                </div>

                <div>
                    <h3 className="mb-4 text-lg font-bold text-slate-800">
                        Şifre Değiştir
                    </h3>
                    <PasswordForm />
                </div>
            </div>
        </div>
    );
}
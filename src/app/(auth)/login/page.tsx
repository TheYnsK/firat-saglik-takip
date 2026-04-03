import Image from "next/image";
import { appMeta } from "@/config/app-meta";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(217,70,239,0.20),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] px-4 py-10">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="absolute right-[-5rem] top-16 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
                <div className="absolute bottom-[-7rem] left-1/3 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px] opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="grid min-h-[640px] md:min-h-[700px] md:grid-cols-2">
                    <div className="hidden flex-col justify-between bg-gradient-to-br from-cyan-400/15 via-sky-400/10 to-fuchsia-500/15 p-10 md:flex lg:p-12">
                        <div className="space-y-6">
                            <div className="inline-flex w-fit rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-lg shadow-cyan-900/20">
                                Fırat Üniversitesi Sağlık Takip Sistemi
                            </div>

                            <div className="space-y-4">
                                <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/10 shadow-xl">
                                    <Image
                                        src="/logo.ico"
                                        alt="Fırat Üniversitesi Logosu"
                                        width={72}
                                        height={72}
                                        className="h-[72px] w-[72px] object-contain"
                                        priority
                                    />
                                </div>

                                <div className="space-y-3">
                                    <h1 className="text-4xl font-black leading-tight text-white lg:text-5xl">
                                        {appMeta.institution}
                                    </h1>
                                    <p className="text-lg font-semibold text-cyan-100">
                                        Sağlık, Kültür ve Spor Daire Başkanlığı
                                    </p>
                                    <p className="text-base text-slate-200">Sağlık Birimi</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-6 shadow-xl backdrop-blur-xl">
                            <h2 className="text-xl font-bold text-white">
                                İlaç ve Ürün Takip Sistemi
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                İlaç, kayıt, stok, son kullanma tarihi, medikal ürün ve işlem
                                kayıtlarını tek panelden güvenli ve düzenli şekilde yönetin.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
                        <div className="w-full max-w-md">
                            <div className="mb-8 space-y-4 text-center md:text-left">
                                <div>
                                    <h2 className="text-3xl font-black text-white lg:text-4xl">
                                        Giriş Yap
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-300">
                                        Sisteme kullanıcı adı ve şifrenizle giriş yapın.
                                    </p>
                                </div>
                            </div>

                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
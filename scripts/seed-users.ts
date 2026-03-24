import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";

loadEnvConfig(process.cwd());

async function run() {
    const { connectToDatabase } = await import("../src/lib/db");
    const { User } = await import("../src/models/User");

    await connectToDatabase();

    const users = [
        {
            username: "sayimyavuz",
            fullName: "Sayim Yavuz",
            password: "sayimyavuz3205",
            role: "staff",
        },
        {
            username: "gulnihalyalniz",
            fullName: "Gülnihal Yalnız",
            password: "gulnihalyalniz3214",
            role: "staff",
        },
        {
            username: "hicranonalperilioglu",
            fullName: "Hicran Önal Perilioğlu",
            password: "hicranonalperilioglu3213",
            role: "staff",
        },
        {
            username: "adminadmin",
            fullName: "Sistem Yöneticisi",
            password: "admin44admin",
            role: "admin",
        },
    ] as const;

    for (const item of users) {
        const exists = await User.findOne({ username: item.username });

        if (exists) {
            console.log(`${item.username} zaten var, atlandı.`);
            continue;
        }

        const passwordHash = await bcrypt.hash(item.password, 12);

        await User.create({
            username: item.username,
            fullName: item.fullName,
            passwordHash,
            role: item.role,
            isActive: true,
            avatarUrl: "",
        });

        console.log(`${item.username} oluşturuldu.`);
    }

    console.log("Seed tamamlandı.");
    process.exit(0);
}

run().catch((error) => {
    console.error("Seed hatası:", error);
    process.exit(1);
});
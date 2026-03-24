import { z } from "zod";

export const profileSchema = z.object({
    fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır."),
    username: z
        .string()
        .min(3, "Kullanıcı adı en az 3 karakter olmalıdır.")
        .max(50, "Kullanıcı adı çok uzun."),
});

export const passwordChangeSchema = z
    .object({
        currentPassword: z.string().min(1, "Mevcut şifre zorunludur."),
        newPassword: z.string().min(6, "Yeni şifre en az 6 karakter olmalıdır."),
        confirmPassword: z.string().min(1, "Şifre tekrarı zorunludur."),
    })
    .superRefine((data, ctx) => {
        if (data.newPassword !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Yeni şifre ile şifre tekrarı eşleşmiyor.",
            });
        }
    });
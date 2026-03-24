export type SessionPayload = {
    userId: string;
    username: string;
    fullName: string;
    role: "staff" | "admin";
};
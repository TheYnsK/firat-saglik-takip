import { connectToDatabase } from "@/lib/db";
import { AuditLog } from "@/models/AuditLog";
import { MedicineTransaction } from "@/models/MedicineTransaction";
import { ProductTransaction } from "@/models/ProductTransaction";
import { User } from "@/models/User";

export async function listMedicineLogsPaginated(
    page = 1,
    pageSize = 20,
    query = ""
) {
    await connectToDatabase();

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const skip = (safePage - 1) * safePageSize;
    const normalizedQuery = query.trim();

    const usernames = normalizedQuery
        ? (
            await User.find({
                $or: [
                    { username: { $regex: normalizedQuery, $options: "i" } },
                    { fullName: { $regex: normalizedQuery, $options: "i" } },
                ],
            })
                .select("username")
                .lean()
        ).map((x: any) => x.username)
        : [];

    const filter: any = {
        $or: [
            { module: "İlaçlar" },
            { module: "İlaç Partileri" },
            { module: "İlaç Kayıtları" },
            { module: "Stok Hareketleri" },
        ],
    };

    if (normalizedQuery) {
        filter.$and = [
            {
                $or: [
                    { fullName: { $regex: normalizedQuery, $options: "i" } },
                    { username: { $regex: normalizedQuery, $options: "i" } },
                    ...(usernames.length ? [{ username: { $in: usernames } }] : []),
                    { module: { $regex: normalizedQuery, $options: "i" } },
                    { messageTr: { $regex: normalizedQuery, $options: "i" } },
                    { action: { $regex: normalizedQuery, $options: "i" } },
                ],
            },
        ];
    }

    const [totalCount, items] = await Promise.all([
        AuditLog.countDocuments(filter),
        AuditLog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safePageSize)
            .lean(),
    ]);

    const medicineTransactionIds = items
        .filter((item: any) => item.targetType === "MedicineTransaction")
        .map((item: any) => String(item.targetId));

    const usernamesForPage = Array.from(
        new Set(items.map((item: any) => String(item.username || "")).filter(Boolean))
    );

    const [medicineTransactions, users] = await Promise.all([
        MedicineTransaction.find({
            _id: { $in: medicineTransactionIds },
        }).lean(),
        User.find({
            username: { $in: usernamesForPage },
        })
            .select("username fullName")
            .lean(),
    ]);

    const medicineTransactionMap = new Map(
        medicineTransactions.map((item: any) => [String(item._id), item])
    );

    const userMap = new Map(
        users.map((user: any) => [String(user.username), String(user.fullName)])
    );

    return {
        items: items.map((item: any) => {
            let enrichedMessage = item.messageTr;

            if (item.targetType === "MedicineTransaction") {
                const tx = medicineTransactionMap.get(String(item.targetId));
                if (tx?.description?.trim() && !String(item.messageTr).includes("Not:")) {
                    enrichedMessage = `${item.messageTr} Not: ${tx.description.trim()}.`;
                }
            }

            return {
                _id: String(item._id),
                fullName:
                    item.fullName?.trim?.() ||
                    userMap.get(String(item.username)) ||
                    String(item.username ?? "-"),
                module: item.module,
                action: item.action,
                messageTr: enrichedMessage,
                createdAt:
                    item.createdAt instanceof Date
                        ? item.createdAt.toISOString()
                        : new Date(item.createdAt).toISOString(),
            };
        }),
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / safePageSize)),
        currentPage: safePage,
        pageSize: safePageSize,
        query: normalizedQuery,
    };
}

export async function listProductLogsPaginated(
    page = 1,
    pageSize = 20,
    query = ""
) {
    await connectToDatabase();

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const skip = (safePage - 1) * safePageSize;
    const normalizedQuery = query.trim();

    const usernames = normalizedQuery
        ? (
            await User.find({
                $or: [
                    { username: { $regex: normalizedQuery, $options: "i" } },
                    { fullName: { $regex: normalizedQuery, $options: "i" } },
                ],
            })
                .select("username")
                .lean()
        ).map((x: any) => x.username)
        : [];

    const filter: any = {
        $or: [
            { module: "Ürünler" },
            { module: "Ürün Stok Hareketleri" },
        ],
    };

    if (normalizedQuery) {
        filter.$and = [
            {
                $or: [
                    { fullName: { $regex: normalizedQuery, $options: "i" } },
                    { username: { $regex: normalizedQuery, $options: "i" } },
                    ...(usernames.length ? [{ username: { $in: usernames } }] : []),
                    { module: { $regex: normalizedQuery, $options: "i" } },
                    { messageTr: { $regex: normalizedQuery, $options: "i" } },
                    { action: { $regex: normalizedQuery, $options: "i" } },
                ],
            },
        ];
    }

    const [totalCount, items] = await Promise.all([
        AuditLog.countDocuments(filter),
        AuditLog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safePageSize)
            .lean(),
    ]);

    const productTransactionIds = items
        .filter((item: any) => item.targetType === "ProductTransaction")
        .map((item: any) => String(item.targetId));

    const usernamesForPage = Array.from(
        new Set(items.map((item: any) => String(item.username || "")).filter(Boolean))
    );

    const [productTransactions, users] = await Promise.all([
        ProductTransaction.find({
            _id: { $in: productTransactionIds },
        }).lean(),
        User.find({
            username: { $in: usernamesForPage },
        })
            .select("username fullName")
            .lean(),
    ]);

    const productTransactionMap = new Map(
        productTransactions.map((item: any) => [String(item._id), item])
    );

    const userMap = new Map(
        users.map((user: any) => [String(user.username), String(user.fullName)])
    );

    return {
        items: items.map((item: any) => {
            let enrichedMessage = item.messageTr;

            if (item.targetType === "ProductTransaction") {
                const tx = productTransactionMap.get(String(item.targetId));
                if (tx?.description?.trim() && !String(item.messageTr).includes("Not:")) {
                    enrichedMessage = `${item.messageTr} Not: ${tx.description.trim()}.`;
                }
            }

            return {
                _id: String(item._id),
                fullName:
                    item.fullName?.trim?.() ||
                    userMap.get(String(item.username)) ||
                    String(item.username ?? "-"),
                module: item.module,
                action: item.action,
                messageTr: enrichedMessage,
                createdAt:
                    item.createdAt instanceof Date
                        ? item.createdAt.toISOString()
                        : new Date(item.createdAt).toISOString(),
            };
        }),
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / safePageSize)),
        currentPage: safePage,
        pageSize: safePageSize,
        query: normalizedQuery,
    };
}
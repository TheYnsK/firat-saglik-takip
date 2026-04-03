import { addMonths } from "date-fns";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { ProductTransaction } from "@/models/ProductTransaction";
import type { ProductSummaryItem } from "@/types/product";
import { User } from "@/models/User";

export async function listProductsWithSummary(): Promise<ProductSummaryItem[]> {
    await connectToDatabase();

    const items = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .lean();

    const now = new Date();
    const next2Months = addMonths(now, 2);

    return items.map((item) => {
        const expiryDate = item.expiryDate
            ? item.expiryDate instanceof Date
                ? item.expiryDate
                : new Date(item.expiryDate)
            : null;

        const isExpired = !!(item.hasExpiry && expiryDate && expiryDate < now);
        const isExpiringSoon = !!(
            item.hasExpiry &&
            expiryDate &&
            expiryDate >= now &&
            expiryDate <= next2Months
        );

        return {
            _id: String(item._id),
            name: item.name,
            barcode: item.barcode,
            type: item.type,
            stockQuantity: Number(item.stockQuantity ?? 0),
            lowStockThreshold: Number(item.lowStockThreshold ?? 0),
            hasExpiry: Boolean(item.hasExpiry),
            expiryDate: expiryDate ? expiryDate.toISOString() : null,
            note: item.note ?? "",
            createdBy: item.createdBy,
            updatedBy: item.updatedBy,
            createdAt:
                item.createdAt instanceof Date
                    ? item.createdAt.toISOString()
                    : new Date(item.createdAt).toISOString(),
            updatedAt:
                item.updatedAt instanceof Date
                    ? item.updatedAt.toISOString()
                    : new Date(item.updatedAt).toISOString(),
            isLowStock:
                Number(item.stockQuantity ?? 0) <= Number(item.lowStockThreshold ?? 0),
            isExpired,
            isExpiringSoon,
        };
    });
}

export async function createProduct(input: {
    name: string;
    barcode: string;
    type: string;
    stockQuantity: number;
    lowStockThreshold: number;
    hasExpiry: boolean;
    expiryDate?: string | null;
    note?: string;
    username: string;
}) {
    await connectToDatabase();

    const created = await Product.create({
        name: input.name,
        barcode: input.barcode,
        type: input.type,
        stockQuantity: input.stockQuantity,
        lowStockThreshold: input.lowStockThreshold,
        hasExpiry: input.hasExpiry,
        expiryDate:
            input.hasExpiry && input.expiryDate ? new Date(input.expiryDate) : null,
        note: input.note ?? "",
        isActive: true,
        createdBy: input.username,
        updatedBy: input.username,
    });

    return created;
}

export async function getProductDashboardSummary() {
    const products = await listProductsWithSummary();

    return {
        totalProductCount: products.length,
        lowStockCount: products.filter((p) => p.isLowStock).length,
        expiringCount: products.filter((p) => p.isExpiringSoon).length,
        expiredCount: products.filter((p) => p.isExpired).length,
        lowStockItems: products
            .filter((p) => p.isLowStock)
            .map((p) => `${p.name} (${p.stockQuantity})`),
        expiringList: products
            .filter((p) => p.isExpiringSoon)
            .map((p) => ({
                _id: p._id,
                productName: p.name,
                expiryDate: p.expiryDate,
                stockQuantity: p.stockQuantity,
            })),
        expiredList: products
            .filter((p) => p.isExpired)
            .map((p) => ({
                _id: p._id,
                productName: p.name,
                expiryDate: p.expiryDate,
                stockQuantity: p.stockQuantity,
            })),
    };
}

export async function getProductControlResult(query: string) {
    await connectToDatabase();

    const trimmed = query.trim();
    if (!trimmed) return null;

    const item = await Product.findOne({
        $or: [
            { barcode: trimmed },
            { name: { $regex: trimmed, $options: "i" } },
        ],
        isActive: true,
    }).lean();

    if (!item) return null;

    const expiryDate = item.expiryDate
        ? item.expiryDate instanceof Date
            ? item.expiryDate
            : new Date(item.expiryDate)
        : null;

    const now = new Date();
    const next2Months = addMonths(now, 2);

    return {
        _id: String(item._id),
        name: item.name,
        barcode: item.barcode,
        type: item.type,
        stockQuantity: Number(item.stockQuantity ?? 0),
        lowStockThreshold: Number(item.lowStockThreshold ?? 0),
        hasExpiry: Boolean(item.hasExpiry),
        expiryDate: expiryDate ? expiryDate.toISOString() : null,
        note: item.note ?? "",
        isLowStock:
            Number(item.stockQuantity ?? 0) <= Number(item.lowStockThreshold ?? 0),
        isExpired: !!(item.hasExpiry && expiryDate && expiryDate < now),
        isExpiringSoon: !!(
            item.hasExpiry &&
            expiryDate &&
            expiryDate >= now &&
            expiryDate <= next2Months
        ),
    };
}

export async function listProductTransactions() {
    await connectToDatabase();

    const items = await ProductTransaction.find()
        .populate("productId")
        .sort({ createdAt: -1 })
        .lean();

    const usernames = Array.from(
        new Set(items.map((item: any) => String(item.performedBy || "")).filter(Boolean))
    );

    const users = await User.find({
        username: { $in: usernames },
    })
        .select("username fullName")
        .lean();

    const userMap = new Map(
        users.map((user: any) => [String(user.username), String(user.fullName)])
    );

    return items.map((item: any) => ({
        _id: String(item._id),
        productId: String(item.productId?._id ?? ""),
        productName: item.productId?.name ?? "-",
        transactionType: item.transactionType,
        quantity: Number(item.quantity ?? 0),
        description: item.description ?? "",
        performedBy: item.performedBy,
        performerName: userMap.get(String(item.performedBy)) ?? String(item.performedBy ?? "-"),
        createdAt:
            item.createdAt instanceof Date
                ? item.createdAt.toISOString()
                : new Date(item.createdAt).toISOString(),
    }));
}

export async function createProductTransaction(input: {
    productId: string;
    transactionType: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    description?: string;
    username: string;
}) {
    await connectToDatabase();

    const product = await Product.findById(input.productId);
    if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
    }

    if (input.transactionType === "IN") {
        product.stockQuantity += input.quantity;
    } else if (input.transactionType === "OUT") {
        if (product.stockQuantity < input.quantity) {
            throw new Error("INSUFFICIENT_STOCK");
        }
        product.stockQuantity -= input.quantity;
    } else if (input.transactionType === "ADJUSTMENT") {
        product.stockQuantity = input.quantity;
    }

    product.updatedBy = input.username;
    await product.save();

    const transaction = await ProductTransaction.create({
        productId: product._id,
        transactionType: input.transactionType,
        quantity: input.quantity,
        description: input.description ?? "",
        performedBy: input.username,
    });

    return {
        transaction,
        productName: product.name,
        newStockQuantity: product.stockQuantity,
    };
}


export async function listProductTransactionsPaginated(
    page = 1,
    pageSize = 20,
    query = ""
) {
    await connectToDatabase();

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const skip = (safePage - 1) * safePageSize;
    const normalizedQuery = query.trim();

    const productNameMatches = normalizedQuery
        ? await Product.find({
            $or: [
                { name: { $regex: normalizedQuery, $options: "i" } },
                { barcode: { $regex: normalizedQuery, $options: "i" } },
            ],
        })
            .select("_id")
            .lean()
        : [];

    const productIds = productNameMatches.map((x: any) => x._id);

    const userMatches = normalizedQuery
        ? await User.find({
            $or: [
                { username: { $regex: normalizedQuery, $options: "i" } },
                { fullName: { $regex: normalizedQuery, $options: "i" } },
            ],
        })
            .select("username")
            .lean()
        : [];

    const usernames = userMatches.map((x: any) => x.username);

    const filter: any = {};

    if (normalizedQuery) {
        const transactionTypes: string[] = [];
        const lower = normalizedQuery.toLocaleLowerCase("tr-TR");

        if ("giriş".includes(lower) || "stok girişi".includes(lower) || lower === "in") {
            transactionTypes.push("IN");
        }
        if ("çıkış".includes(lower) || "stok çıkışı".includes(lower) || lower === "out") {
            transactionTypes.push("OUT");
        }
        if (
            "düzeltme".includes(lower) ||
            "stok düzeltme".includes(lower) ||
            lower === "adjustment"
        ) {
            transactionTypes.push("ADJUSTMENT");
        }

        filter.$or = [
            ...(productIds.length ? [{ productId: { $in: productIds } }] : []),
            ...(usernames.length ? [{ performedBy: { $in: usernames } }] : []),
            { description: { $regex: normalizedQuery, $options: "i" } },
            ...(transactionTypes.length
                ? [{ transactionType: { $in: transactionTypes } }]
                : []),
        ];
    }

    const [totalCount, items] = await Promise.all([
        ProductTransaction.countDocuments(filter),
        ProductTransaction.find(filter)
            .populate("productId")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safePageSize)
            .lean(),
    ]);

    const usernamesForPage = Array.from(
        new Set(items.map((item: any) => String(item.performedBy || "")).filter(Boolean))
    );

    const users = await User.find({
        username: { $in: usernamesForPage },
    })
        .select("username fullName")
        .lean();

    const userMap = new Map(
        users.map((user: any) => [String(user.username), String(user.fullName)])
    );

    return {
        items: items.map((item: any) => ({
            _id: String(item._id),
            productId: String(item.productId?._id ?? ""),
            productName: item.productId?.name ?? "-",
            transactionType: item.transactionType,
            quantity: Number(item.quantity ?? 0),
            description: item.description ?? "",
            performedBy: item.performedBy,
            performerName:
                userMap.get(String(item.performedBy)) ?? String(item.performedBy ?? "-"),
            createdAt:
                item.createdAt instanceof Date
                    ? item.createdAt.toISOString()
                    : new Date(item.createdAt).toISOString(),
        })),
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / safePageSize)),
        currentPage: safePage,
        pageSize: safePageSize,
        query: normalizedQuery,
    };
}

export async function listProductsWithSummaryPaginated(page = 1, pageSize = 20) {
    await connectToDatabase();

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const skip = (safePage - 1) * safePageSize;

    const [totalCount, items] = await Promise.all([
        Product.countDocuments({ isActive: true }),
        Product.find({ isActive: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safePageSize)
            .lean(),
    ]);

    const now = new Date();
    const next2Months = addMonths(now, 2);

    return {
        items: items.map((item) => {
            const expiryDate = item.expiryDate
                ? item.expiryDate instanceof Date
                    ? item.expiryDate
                    : new Date(item.expiryDate)
                : null;

            const isExpired = !!(item.hasExpiry && expiryDate && expiryDate < now);
            const isExpiringSoon = !!(
                item.hasExpiry &&
                expiryDate &&
                expiryDate >= now &&
                expiryDate <= next2Months
            );

            return {
                _id: String(item._id),
                name: item.name,
                barcode: item.barcode,
                type: item.type,
                stockQuantity: Number(item.stockQuantity ?? 0),
                lowStockThreshold: Number(item.lowStockThreshold ?? 0),
                hasExpiry: Boolean(item.hasExpiry),
                expiryDate: expiryDate ? expiryDate.toISOString() : null,
                note: item.note ?? "",
                createdBy: item.createdBy,
                updatedBy: item.updatedBy,
                createdAt:
                    item.createdAt instanceof Date
                        ? item.createdAt.toISOString()
                        : new Date(item.createdAt).toISOString(),
                updatedAt:
                    item.updatedAt instanceof Date
                        ? item.updatedAt.toISOString()
                        : new Date(item.updatedAt).toISOString(),
                isLowStock:
                    Number(item.stockQuantity ?? 0) <= Number(item.lowStockThreshold ?? 0),
                isExpired,
                isExpiringSoon,
            };
        }),
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / safePageSize)),
        currentPage: safePage,
        pageSize: safePageSize,
    };
}
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { ProductForm } from "@/components/products/product-form";

type Params = {
    params: Promise<{
        productId: string;
    }>;
};

export default async function ProductEditDetailPage({ params }: Params) {
    const { productId } = await params;

    await connectToDatabase();

    const product = await Product.findById(productId).lean();

    if (!product) {
        notFound();
    }

    const toDateInput = (value: Date | string | null | undefined) => {
        if (!value) return "";
        return new Date(value).toISOString().split("T")[0];
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    Ürün Kaydını Düzenle
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Ürün bilgilerini güncelleyin veya kaydı silin.
                </p>
            </div>

            <ProductForm
                mode="edit"
                productId={productId}
                initialValues={{
                    name: product.name,
                    barcode: product.barcode,
                    type: product.type,
                    stockQuantity: product.stockQuantity,
                    lowStockThreshold: product.lowStockThreshold,
                    hasExpiry: product.hasExpiry,
                    expiryDate: toDateInput(product.expiryDate),
                    note: product.note ?? "",
                }}
            />
        </div>
    );
}
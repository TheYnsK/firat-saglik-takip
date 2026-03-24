import { ProductControlSearch } from "@/components/products/product-control-search";

export default function ProductControlPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="bg-gradient-to-r from-sky-700 via-cyan-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    Ürün Kontrolü
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Ürün adı veya barkod ile sorgulama yaparak ürün bilgilerini görüntüleyin.
                </p>
            </div>

            <ProductControlSearch />
        </div>
    );
}
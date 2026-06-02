import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductAction from "@/components/ProductAction";

export default async function ProductDetail({
    params
}: {
    params : Promise<{ slug: string}>
}) {
    const { slug } = await params;

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        return <div className="p-10">Gagal ambil data: {error.message}</div>
    }

    return(
        <main className="px-8 md:px-20 py-10">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* Product Image */}
                    <div>
                        <div className="bg-gray-200 h-48 rounded-md flex items-center justify-center text-gray-500 overflow-hidden relative">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover rounded-md" />
                            ) : (
                                "No Image"
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-xl text-gray-600 mt-2">Rp{product.price.toLocaleString('id-ID')}</p>
                        <p className="text-gray-700 mt-4"><span className="font-bold">Kategori: </span>{product.category}</p>
                        <p className="text-gray-700 mt-4 font-semibold">{product.description}</p>

                        {/* Panggil Komponen Interaktif di Sini dengan Mengirim Data Produk */}
                        <ProductAction product={product} />
                    </div>
                </div>
            </div>
        </main>
    )
}
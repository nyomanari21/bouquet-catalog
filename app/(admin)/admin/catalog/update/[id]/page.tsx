import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CatalogForm from "@/components/admin/CatalogForm";

export default async function DashboardPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            id,
            name,
            description,
            price,
            category,
            image_url
        `)
        .eq('id', id)
        .maybeSingle()
    
    if (error) {
        return <div className="p-10">Gagal ambil data: {error.message}</div>
    }

    if (!product) {
        return notFound();
    }

    return (
        <div className="space-y-6 sm:top-20">
            {/* Header Catalog */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Edit Data Katalog Buket</h1>
                    <p className="text-xs text-slate-400 mt-1">Halaman untuk edit produk buket di katalog</p>
                </div>
            </div>

            {/* Create Form */}
            <CatalogForm initialData={product}  />
        </div>
    );
}
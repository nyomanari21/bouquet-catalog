import { supabase } from "@/lib/supabase";
import CatalogTable from "@/components/admin/CatalogTable";

export default async function DashboardPage() {
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return <div className="p-10">Gagal ambil data: {error.message}</div>
    }

    return (
        <div className="space-y-6 sm:top-20">
            {/* Header Catalog */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Katalog Buket</h1>
                    <p className="text-xs text-slate-400 mt-1">Selamat datang kembali di panel manajemen Bouquet by Dila.</p>
                </div>
            </div>

            {/* Table */}
            <CatalogTable initialProducts={products || []} />
        </div>
    );
}
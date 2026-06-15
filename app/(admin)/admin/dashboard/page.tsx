import { supabase } from "@/lib/supabase";
import LogoutButton from "@/components/admin/LogoutButton";
import DashboardContent from "@/components/admin/DashboardContent";

export default async function DashboardPage() {
    // Get order data
    const { data: orderData, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return <div className="p-10">Gagal ambil data: {error.message}</div>
    }

    return (
        <div className="space-y-6 sm:top-20">
            {/* Header Dashboard */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard Utama</h1>
                    <p className="text-xs text-slate-400 mt-1">Selamat datang kembali di panel manajemen Bouquet by Dila.</p>
                </div>
                <LogoutButton />
            </div>

            {/* Main Content */}
            <DashboardContent orderData={orderData} />
        </div>
    );
}
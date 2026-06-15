'use client';

interface Order {
    id: string;
    order_code: string;
    customer_name: string;
    customer_whatsapp: string;
    customer_address: string;
    order_type: string;
    total_price: number;
    status: string;
    delivery_date: Date;
}

interface DashboardContentProps {
    orderData: Order[];
}

export default function DashboardContent({ orderData }: DashboardContentProps) {
    // Count orders based on status
    const pendingOrders = orderData.filter(order => order.status?.toLowerCase() === 'pending').length;
    const processingOrders = orderData.filter(order => order.status?.toLowerCase() === 'processing').length;
    const completedOrders = orderData.filter(order => order.status?.toLowerCase() === 'completed').length;
    const cancelledOrders = orderData.filter(order => order.status?.toLowerCase() === 'cancelled').length;

    // Count total revenue
    const totalRevenue = orderData
    .filter(order => order.status?.toLowerCase() === 'completed')
    .reduce((accumulator, currentOrder) => {
        return accumulator + (Number(currentOrder.total_price) || 0);
    }, 0);

    return (
        <div className="space-y-6">
            {/* Statistic Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-[#e75888]/10 text-[#e75888] rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5M5.25 7.5h13.5m-12 9h10.5M5.25 13.5h13.5m-12-3h10.5" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400">Total Pendapatan</p>
                        <p className="text-xl font-bold text-slate-800 mt-0.5">Rp{totalRevenue.toLocaleString('id-ID')}</p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/xl" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400">Pesanan Pending</p>
                        <p className="text-xl font-bold text-slate-800 mt-0.5">{pendingOrders} Pesanan</p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 16.15a4.8 4.8 0 11.525-.625M17.25 12h4.5m0 0l-1.5-1.5M21.75 12l-1.5 1.5M12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400">Sedang Diproses</p>
                        <p className="text-xl font-bold text-slate-800 mt-0.5">{processingOrders} Pesanan</p>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400">Pesanan Selesai</p>
                        <p className="text-xl font-bold text-slate-800 mt-0.5">{completedOrders} Pesanan</p>
                    </div>
                </div>
            </div>

            {/* Main Container */}
            <div className="p-12 bg-white border border-slate-100 rounded-2xl shadow-sm text-center text-sm text-slate-400">
                Statistik grafik dan tabel pesanan terbaru bakal kita pasang di sini, Gan!
            </div>
        </div>
    )
}
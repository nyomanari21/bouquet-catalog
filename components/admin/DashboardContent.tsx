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
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
                            <path d="M0 0h48v48H0z" fill="none" />
                            <g fill="currentColor">
                                <path fill-rule="evenodd" d="M12.098 8.711C14.533 7.491 18.648 6 23.165 6c4.433 0 8.448 1.437 10.872 2.643l.121.06c.653.33 1.184.641 1.568.897l-2.62 3.829l-1.48.768c-5.096 2.571-11.93 2.571-17.027 0l-1.303-.52l-2.77-4.077a14 14 0 0 1 .956-.567q.287-.156.616-.322m1.724 1.177c.924.29 1.904.544 2.9.728c2.159.398 4.333.457 6.193-.08c2.364-.684 4.845-1.239 7.17-1.567c-1.984-.653-4.383-1.169-6.92-1.169c-3.662 0-7.062 1.075-9.343 2.088" clip-rule="evenodd" />
                                <path d="m32.437 15.804l.245-.124c2.507 2.678 4.854 6.117 6.252 9.62A9.95 9.95 0 0 0 34 24a10 10 0 0 0-8.561 4.83A4 4 0 0 0 23 28v-4c.87 0 1.611.555 1.887 1.333a1 1 0 1 0 1.885-.666A4 4 0 0 0 23 22v-1h-2v1a4 4 0 0 0 0 8v4c-.87 0-1.611-.555-1.887-1.333a1 1 0 1 0-1.885.666A4 4 0 0 0 21 36v1h2v-1q.61-.002 1.167-.173a10 10 0 0 0 3.534 5.94c-1.376.15-2.886.23-4.536.23c-24.461 0-18.031-17.07-9.61-26.31l.234.117c5.606 2.828 13.042 2.828 18.648 0" />
                                <path d="M23 30c.623 0 1.18.285 1.546.732a10 10 0 0 0-.542 2.998c-.295.172-.638.27-1.004.27zm-4-4a2 2 0 0 1 2-2v4a2 2 0 0 1-2-2" />
                                <path fill-rule="evenodd" d="M34 42a8 8 0 1 0 0-16a8 8 0 0 0 0 16m1-7.58l1.19-1.067l1.335 1.49L34 38.001l-3.525-3.16l1.335-1.489L33 34.42V30h2z" clip-rule="evenodd" />
                            </g>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path fill="currentColor" d="M8.625 8.5h-4.5a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v3.5h3.5a1 1 0 0 1 0 2" />
                            <path fill="currentColor" d="M21 13a1 1 0 0 1-1-1A7.995 7.995 0 0 0 5.08 8.001a1 1 0 0 1-1.731-1.002A9.995 9.995 0 0 1 22 12a1 1 0 0 1-1 1m-1.125 9a1 1 0 0 1-1-1v-3.5h-3.5a1 1 0 0 1 0-2h4.5a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1" />
                            <path fill="currentColor" d="M12 22A10.01 10.01 0 0 1 2 12a1 1 0 0 1 2 0a7.995 7.995 0 0 0 14.92 3.999a1 1 0 0 1 1.731 1.002A10.03 10.03 0 0 1 12 22" />
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
                Statistik grafik dan tabel pesanan terbaru.
            </div>
        </div>
    )
}
'use client';

import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface OrderData {
    order_code: string;
    customer_name: string;
    status: string;
    total_price: number;
    delivery_date: string;
    order_type: string;
}

export default function TrackOrderAction() {
    const [orderCode, setOrderCode] = useState('');
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, seterrorMessage] = useState("");

    const handleTrackOrder = async () => {
        setIsLoading(true);
        setOrderData(null);
        seterrorMessage('');

        try {
            const { data, error } = await supabase
                .from('orders')
                .select('order_code, customer_name, status, total_price, delivery_date, order_type')
                .eq('order_code', orderCode)
                .maybeSingle();

            if (error) throw error;

            if (!data) {
                seterrorMessage('Kode pesanan tidak ditemukan. Periksa kembali kode pesananmu ya.');
            } else {
                setOrderData(data);
            }
        } catch (error) {
            seterrorMessage(`Gagal melacak pesanan: ${error}`);
        } finally {
            setIsLoading(false);
        }
    }

    // Status badge
    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-semibold">Menunggu Pembayaran</span>;
            case 'processing':
                return <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">Sedang Diproses</span>;
            case 'shipped':
                return <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-semibold">Dalam Pengiriman</span>;
            case 'completed':
                return <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">Selesai</span>;
            case 'cancelled':
                return <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-semibold">Dibatalkan</span>;
            default:
                return <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-semibold">{status}</span>;
        }
    }

    return (
        <div className="p-4">
            {/* Form */}
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <input
                    type="text"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    className="w-full bg-gray-50 p-3 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:bg-white transition-all placeholder:normal-case"
                    placeholder="Masukkan Kode Pesanan"
                    required
                />
                <button 
                    onClick={handleTrackOrder}
                    disabled={isLoading}
                    className="w-full mt-4 bg-[#e75888] text-white p-3 rounded-lg font-medium hover:bg-[#d44a7a] transition-colors cursor-pointer text-sm shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? "Mencari..." : "Lacak Pesanan"}
                </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
                    {errorMessage}
                </div>
            )}

            {/* Order Detail */}
            {orderData && (
                <div className="mt-6 bg-[#e75888]/5 border border-[#e75888]/10 rounded-xl p-4 text-left space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Kode Pesanan:</span>
                        <span className="font-mono font-bold text-gray-800">{orderData.order_code}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-gray-100 pt-2">
                        <span className="text-gray-500">Nama Pemesan:</span>
                        <span className="font-medium text-gray-700">{orderData.customer_name}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-gray-100 pt-2">
                        <span className="text-gray-500">Tipe Pemesanan:</span>
                        <span className="font-medium text-gray-700 capitalize">{orderData.order_type} Buket</span>
                    </div>
                    {orderData.total_price ? (
                        <div className="flex justify-between text-xs border-t border-gray-100 pt-2">
                            <span className="text-gray-500">Total Pembayaran:</span>
                            <span className="font-bold text-[#e75888]">Rp{orderData.total_price.toLocaleString('id-ID')}</span>
                        </div>
                    ) : 
                    (
                        <div className="flex justify-between text-xs border-t border-gray-100 pt-2">
                            <span className="text-gray-500">Total Pembayaran:</span>
                            <span className="font-bold text-[#e75888]">Tunggu Kalkulasi Harga</span>
                        </div>
                    )}
                    <div className="flex justify-between text-xs border-t border-gray-100 pt-2">
                        <span className="text-gray-500">Status:</span>
                        <span className="font-semibold text-[#e75888] capitalize">{getStatusBadge(orderData.status)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
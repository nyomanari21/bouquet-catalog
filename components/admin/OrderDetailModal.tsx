'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Calendar, User, Phone, MapPin, ShoppingBag } from "lucide-react";

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string | null;
    orderType: 'catalog' | 'custom' | null;
    customerName: string;
}

export default function OrderDetailModal({ 
    isOpen, 
    onClose, 
    orderId, 
    orderType,
    customerName 
}: OrderDetailModalProps) {
  
    const [isLoading, setIsLoading] = useState(false);
    const [details, setDetails] = useState<any[]>([]);

    useEffect(() => {
        // Hanya lakukan fetch data jika modal dalam posisi TERBUKA dan orderId ADA
        // Fetch the data if all the conditions are met
        if (!isOpen || !orderId || !orderType) return;

        const fetchOrderDetails = async () => {
        setIsLoading(true);
        setDetails([]); // Clean old details data

        // Normalize order type
        const normalizedType = orderType.toLowerCase().trim();

        try {
            if (normalizedType === 'catalog') {
                // Get the data from table 'order_items' if the order type is 'catalog'
                const { data, error } = await supabase
                    .from('order_items')
                    .select('id, quantity, price, products(name, image_url)')
                    .eq('order_id', orderId);

                if (error) throw error;
                setDetails(data || []);
            } else {
                // Get the data from table 'custom_order_details' if the order type is 'custom'
                const { data, error } = await supabase
                    .from('custom_order_details')
                    .select('*')
                    .eq('order_id', orderId);

                if (error) throw error;
                setDetails(data || []);
            }
        } catch (err: any) {
            console.error("Gagal mengambil detail pesanan:", err.message);
        } finally {
            setIsLoading(false);
        }
        };

        fetchOrderDetails();
    }, [isOpen, orderId, orderType]);

    // Don't render anything if the modal is closed
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* Main Container */}
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Detail Item Pesanan</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Pemesan: <span className="font-semibold text-gray-700">{customerName}</span></p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                    {isLoading ? (
                        <div className="py-12 text-center text-sm text-gray-400 font-medium">
                            Memuat detail item dari database...
                        </div>
                    ) : details.length > 0 ? (
                        <div className="space-y-3">
                            {orderType === 'catalog' ? (
                                // Show list of items from the catalog
                                details.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.products?.image_url && (
                                                <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{item.products?.name}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{item.quantity} x Rp{Number(item.price).toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#e75888]">Rp{Number(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Show specification details for custom request bouquet
                                details.map((item) => (
                                    <div key={item.id} className="space-y-3 text-sm text-slate-600 bg-amber-50/40 p-4 border border-amber-100/60 rounded-xl">
                                        <div className="flex justify-between border-b border-amber-100/40 pb-2">
                                            <span className="font-semibold text-amber-800">Spesifikasi Buket Custom:</span>
                                        </div>
                                            <p><span className="font-medium text-slate-400">Warna Dominan:</span> {item.main_color || "-"}</p>
                                            <p><span className="font-medium text-slate-400">Jenis Bunga:</span> {item.flower_type || "-"}</p>
                                            <p><span className="font-medium text-slate-400">Warna Kertas Wrappers:</span> {item.wrapper_color || "-"}</p>
                                            <p><span className="font-medium text-slate-400">Catatan Tambahan / Kartu Ucapan:</span></p>
                                        <div className="bg-white p-2.5 rounded-lg border border-amber-100 text-xs text-slate-500 italic">
                                            "{item.notes || "Tidak ada catatan ucapan."}"
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-xs text-gray-400">
                            Tidak ada data item penunjang untuk pesanan ini.
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-slate-50 bg-slate-50/50 text-right">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                        Tutup Detail
                    </button>
                </div>
            </div>
        </div>
    );
}
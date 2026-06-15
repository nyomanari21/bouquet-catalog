'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Calendar, User, Phone, MapPin, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string | null;
    orderType: 'catalog' | 'custom' | null;
    customerName: string;
    currentStatus: string;
    currentTotalPrice: number;
}

export default function OrderDetailModal({ 
    isOpen, 
    onClose, 
    orderId, 
    orderType,
    customerName,
    currentStatus,
    currentTotalPrice
}: OrderDetailModalProps) {
  
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [details, setDetails] = useState<any[]>([]);

    // State for update action
    const [statusInput, setStatusInput] = useState(currentStatus);
    const [priceInput, setPriceInput] = useState(currentTotalPrice ? String(currentTotalPrice) : "");

    // Fetch current status and total price
    useEffect(() => {
        if (isOpen) {
        setStatusInput(currentStatus);
        setPriceInput(currentTotalPrice ? String(currentTotalPrice) : "");
        }
    }, [isOpen, currentStatus, currentTotalPrice]);

    // Fetch detail item
    useEffect(() => {
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

    // Update handler
    const handleOrderUpdate = async () => {
        if (!orderId) return;
        setIsUpdating(true);

        try {
            // Data object for updating 'order' table
            const updateData: any = {
                status: statusInput
            };

            // Give permission to update total_price if order type is 'custom'
            if (orderType?.toLowerCase().trim() === 'custom') {
                updateData.total_price = (priceInput === "" ? null : Number(priceInput));
            }

            // Update the data
            const { error } = await supabase
                .from('orders')
                .update(updateData)
                .eq('id', orderId);

            if (error) throw error;

            // Close modal and refresh the page
            alert("Data pesanan berhasil diperbarui!");
            router.refresh();
            onClose();
        } catch (err: any) {
            alert(`Gagal memperbarui pesanan: ${err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    // Don't render anything if the modal is closed
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* Main Container */}
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Detail Item Pesanan</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Pemesan: <span className="font-semibold text-gray-700">{customerName}</span></p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                    {/* Order Status */}
                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status Progres Pesanan</label>
                        <select 
                            value={statusInput}
                            onChange={(e) => setStatusInput(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-green-500 transition-colors cursor-pointer"
                        >
                            <option value="pending">Pending (Menunggu Pembayaran)</option>
                            <option value="processing">Diproses (Perakitan Buket)</option>
                            <option value="shipped">Dalam Pengiriman</option>
                            <option value="completed">Selesai</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>
                    </div>

                    {/* Custom Order Price */}
                    {orderType?.toLowerCase().trim() === 'custom' && (
                        <div className="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                            <label className="text-xs font-bold text-amber-800 uppercase tracking-wider">Penentuan Harga Buket Custom</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-sm font-semibold text-amber-600">Rp</span>
                                <input 
                                    type="number"
                                    value={priceInput ?? 0}
                                    onChange={(e) => setPriceInput(e.target.value)}
                                    className="w-full bg-white border border-amber-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-700 font-bold outline-none focus:border-amber-500 transition-colors"
                                    placeholder="Masukkan nominal harga deal..."
                                />
                            </div>
                            <p className="text-[10px] text-amber-600/80 italic">Note: Buket custom dihitung manual berdasarkan request kerumitan bunga dan budget pembeli.</p>
                        </div>
                    )}

                    {/* Detail Order */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rincian Komponen / Produk:</h3>
                        
                        {isLoading ? (
                        <div className="py-6 text-center text-sm text-gray-400 font-medium">Memuat detail...</div>
                        ) : details.length > 0 ? (
                        orderType?.toLowerCase().trim() === 'catalog' ? (
                            details.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100">
                                <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shrink-0">
                                {item.products?.image_url && <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0 text-sm">
                                <p className="font-semibold text-slate-800 truncate">{item.products?.name}</p>
                                <p className="text-xs text-slate-400">{item.quantity} x Rp{Number(item.price).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                            ))
                        ) : (
                            details.map((item) => (
                            <div key={item.id} className="text-xs space-y-2 text-slate-600 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
                                <p><span className="font-semibold text-gray-400">Warna Utama:</span> {item.main_color || "-"}</p>
                                <p><span className="font-semibold text-gray-400">Tipe Bunga:</span> {item.flower_type || "-"}</p>
                                <p><span className="font-semibold text-gray-400">Warna Kertas:</span> {item.wrapper_color || "-"}</p>
                                <p className="bg-slate-50 p-2 rounded border text-slate-500 italic">"{item.notes || "Tanpa ucapan."}"</p>
                            </div>
                            ))
                        )
                        ) : (
                        <div className="text-center text-xs text-gray-400 py-4">Data kosong.</div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
                    <button 
                        onClick={onClose}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                        Tutup
                    </button>
                    <button 
                        onClick={handleOrderUpdate}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
                    >
                        {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </div>
        </div>
    );
}
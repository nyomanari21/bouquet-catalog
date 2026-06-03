'use client';

import { useState, FormEvent, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartList() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    // const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();

    // Form data state
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_whatsapp: "",
        customer_address: "",
        delivery_date: "",
    });

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Generate unique order code
    const generateOrderCode = () => {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `BKT-${dateStr}-${randomStr}`;
    };

    // Checkout handler
    const handleCheckout = async (e: FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setIsLoading(true);
        const orderCode = generateOrderCode();

        try {
        // Insert order data to 'order' table
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                order_code: orderCode,
                customer_name: formData.customer_name,
                customer_whatsapp: formData.customer_whatsapp,
                customer_address: formData.customer_address,
                order_type: 'catalog',
                total_price: totalPrice,
                status: 'pending',
                delivery_date: formData.delivery_date
            })
            .select('id')
            .single();

        if (orderError) throw orderError;

        const newOrderId = orderData.id;

        // List of every item in cart with order_id reference
        const orderItemsToInsert = cart.map((item) => ({
            order_id: newOrderId,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
        }));

        // Bulk insert items to 'order_items' table
        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsToInsert);

        if (itemsError) throw itemsError;

        // WhatsApp template text
        let itemDetailsText = "";
        cart.forEach((item, index) => {
            itemDetailsText += `${index + 1}. ${item.name} (x${item.quantity}) - Rp${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
        });

        // Clear cart & redirect to success page
        clearCart();
        router.push(`/order-success?code=${orderCode}`);

        } catch (err: any) {
            alert(`Waduh, checkout gagal: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     setIsHydrated(true);
    // }, []);

    // if (!isHydrated) {
    //     return (
    //         <div className="text-center py-10 text-gray-500 text-sm">
    //             Memuat keranjang...
    //         </div>
    //     );
    // }

    if (cart.length === 0) {
    return (
        <div className="text-center py-16 bg-white rounded-lg p-6 border border-gray-100">
        <p className="text-gray-500 mb-4">Keranjang belanjaanmu masih kosong nih.</p>
        <Link href="/product" className="text-[#e75888] font-semibold hover:underline">
            &larr; Lihat Katalog Buket
        </Link>
        </div>
    );
    }

    return (
        <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* List Items */}
            <div className="md:col-span-2 space-y-4">
                {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex justify-start gap-4">
                            <div className="bg-gray-200 w-20 h-20 rounded-md flex items-center justify-center text-gray-500 overflow-hidden relative">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover rounded-md" />
                                ) : (
                                    "No Image"
                                )}
                            </div>
                            <div className="">
                                <p className="text-sm font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-600 mt-2">Rp{item.price.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-end items-end gap-4">
                            {/* Total Item Price */}
                            <p className="text-sm text-gray-600">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</p>

                            <div className="flex items-center gap-4">
                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => removeFromCart(item.id)}
                                    className="hover:text-red-600 mt-2 underline cursor-pointer block transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M0 0h24v24H0z" fill="none" />
                                        <path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
                                    </svg>
                                </button>

                                {/* Quantity Controls */}
                                <div className="flex items-center border border-gray-300 rounded-lg p-1.5 gap-0 w-fit">
                                    <button 
                                        type="button"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-1.5 font-bold text-gray-600 hover:text-[#e75888] transition-colors cursor-pointer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                            <path d="M0 0h24v24H0z" fill="none" />
                                            <path fill="currentColor" d="M19 12.998H5v-2h14z" />
                                        </svg>
                                    </button>
                                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                    <button 
                                        type="button"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-1.5 font-bold text-gray-600 hover:text-[#e75888] transition-colors cursor-pointer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                            <path d="M0 0h24v24H0z" fill="none" />
                                            <path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary & Form */}
            <div className="space-y-4">
                {/* Summary */}
                <div className="bg-white border border-gray-100 p-6 rounded-xl h-fit shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Ringkasan Belanja</h3>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-2">
                        <span className="text-gray-500 text-sm">Total Barang</span>
                        <span className="font-medium text-gray-800 text-sm">{totalItems} Buket</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-800 text-sm">Total Harga</span>
                        <span className="font-bold text-[#e75888] text-base">Rp{totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-[#e75888]/5 border border-[#e75888]/20 p-6 rounded-xl shadow-sm space-y-4">
                    <h3 className="font-bold text-base text-gray-800">Data Pengiriman</h3>
                    
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Nama Penerima <span className="text-red-400">*</span></label>
                        <input type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} placeholder="Masukkan nama" className="w-full bg-white p-2 rounded-lg text-xs border border-gray-200 outline-none focus:border-[#e75888]" required />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Nomor WhatsApp <span className="text-red-400">*</span></label>
                        <input type="tel" name="customer_whatsapp" value={formData.customer_whatsapp} onChange={handleInputChange} placeholder="Contoh: 0812345678" className="w-full bg-white p-2 rounded-lg text-xs border border-gray-200 outline-none focus:border-[#e75888]" required />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Alamat Pengiriman <span className="text-red-400">*</span></label>
                        <textarea name="customer_address" value={formData.customer_address} onChange={handleInputChange} rows={2} placeholder="Alamat lengkap" className="w-full bg-white p-2 rounded-lg text-xs border border-gray-200 outline-none focus:border-[#e75888]" required />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Tanggal Pengiriman <span className="text-red-400">*</span></label>
                        <input type="date" name="delivery_date" value={formData.delivery_date} onChange={handleInputChange} className="w-full bg-white p-2 rounded-lg text-xs border border-gray-200 outline-none focus:border-[#e75888]" required />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-[#e75888] text-white py-2.5 rounded-lg font-medium hover:bg-[#d44a7a] transition-colors cursor-pointer text-sm shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Memproses Pesanan..." : "Pesan Sekarang via WA"}
                    </button>
                </div>
            </div>

        </form>
    );
}
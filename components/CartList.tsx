'use client';

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";

export default function CartList() {
    const { cart, removeFromCart, updateQuantity } = useCartStore();

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-lg p-6">
                <p className="text-gray-500 mb-4">Keranjang belanjaanmu masih kosong nih.</p>
                <Link href="/product" className="text-[#e75888] font-semibold hover:underline">
                    &larr; Lihat Katalog Buket
                </Link>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

            {/* Order Summary */}
            <div className="bg-[#e75888]/5 border border-[#e75888]/20 p-6 rounded-xl h-fit shadow-sm">
                 <h3 className="font-bold text-lg text-gray-800 mb-4">Ringkasan Belanja</h3>
                 <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                     <span className="text-gray-600 text-sm">Total Harga</span>
                     <span className="font-bold text-[#e75888] text-base">Rp{totalPrice.toLocaleString('id-ID')}</span>
                 </div>
                 <button className="w-full bg-[#e75888] text-white py-2.5 rounded-lg font-medium hover:bg-[#d44a7a] transition-colors cursor-pointer text-sm shadow-sm">
                     Lanjut ke Pengisian Data
                 </button>
             </div>
        </div>
    )
}
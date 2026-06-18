'use client';

import { useState } from "react";
import { ShoppingBag, Calendar, MessageSquare, Paintbrush, FileText, CheckCircle } from "lucide-react";

export default function HowToOrder() {
    // State to track active tab
    const [activeTab, setActiveTab] = useState<'catalog' | 'custom'>('catalog');

    // Order steps from catalog content
    const catalogSteps = [
        {
            icon: <ShoppingBag className="w-5 h-5" />,
            title: "1. Pilih Produk",
            desc: "Jelajahi halaman katalog dan pilih desain buket siap pakai yang paling kamu sukai."
        },
        {
            icon: <Calendar className="w-5 h-5" />,
            title: "2. Atur Tanggal",
            desc: "Masukkan tanggal pengiriman atau pengambilan buket serta isi formulir data diri lengkap."
        },
        {
            icon: <MessageSquare className="w-5 h-5" />,
            title: "3. Konfirmasi WA",
            desc: "Sistem otomatis membuat link rincian pesanan ke WhatsApp admin untuk pembayaran & deal."
        }
    ];

    // Order steps from custom bouquet content
    const customSteps = [
        {
            icon: <Paintbrush className="w-5 h-5" />,
            title: "1. Isi Kustomisasi",
            desc: "Masuk ke form custom, tentukan warna pembungkus (wrapper), jenis bunga, dan budget-mu."
        },
        {
            icon: <FileText className="w-5 h-5" />,
            title: "2. Tulis Catatan Tambahan",
            desc: "Tulis catatan tambahan untuk buketmu. Kamu juga bisa tulis pesan untuk kartu ucapan yang ingin dicetak."
        },
        {
            icon: <MessageSquare className="w-5 h-5" />,
            title: "3. Deal Harga & Bayar",
            desc: "Kirim data ke WhatsApp. Admin akan menghitung total harga sesuai kerumitan lalu merakitnya."
        }
    ];

    const currentSteps = activeTab === 'catalog' ? catalogSteps : customSteps;

    return (
        <section className="px-8 md:px-20 lg:px-32 py-16 bg-white">
            <div className="max-w-4xl mx-auto space-y-10">
                
                {/* Header Section */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-slate-800">Langkah Mudah Memesan</h2>
                    <p className="text-xs text-slate-400">Pahami alur belanja praktis di Bouquet by Dila hanya dengan 3 langkah</p>
                </div>

                {/* Tab Switcher Controller */}
                <div className="flex justify-center">
                    <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setActiveTab('catalog')}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === 'catalog'
                                ? "bg-white text-[#e75888] shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            🛍️ Pesan via Katalog
                        </button>
                        <button
                            onClick={() => setActiveTab('custom')}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === 'custom'
                                ? "bg-white text-[#e75888] shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            🎨 Request Buket Custom
                        </button>
                    </div>
                </div>

                {/* Render Kartu Langkah Alur yang Aktif */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {currentSteps.map((step, index) => (
                        <div 
                            key={index} 
                            className="bg-slate-50/60 p-6 rounded-2xl border border-slate-100/80 hover:border-pink-200 hover:bg-pink-50/10 transition-all flex flex-col items-center text-center space-y-4 group relative"
                        >
                            {/* Number */}
                            <div className="w-12 h-12 bg-white text-[#e75888] group-hover:bg-[#e75888] group-hover:text-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 transition-colors">
                                {step.icon}
                            </div>
                            
                            {/* Title and Description */}
                            <div className="space-y-1.5">
                                <h4 className="font-bold text-slate-800 text-sm md:text-base">{step.title}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-60">{step.desc}</p>
                            </div>

                            {/* Arrow */}
                            {index < 2 && (
                                <div className="hidden md:block absolute top-1/2 -right-5.5 -translate-y-1/2 z-10 text-slate-300 pointer-events-none font-bold text-lg">
                                    &rarr;
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
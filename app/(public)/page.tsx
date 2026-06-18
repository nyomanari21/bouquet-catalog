import Image from "next/image";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/public/ProductCard";
import Link from "next/link";
import { Award, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import HowToOrder from "@/components/public/HowToOrder";

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    return <div className="p-10">Gagal ambil data: {error.message}</div>;
  }

  return (
    <main className="text-slate-700 min-h-screen">
      
      {/* HERO SECTION */}
      <section className="px-8 md:px-20 lg:px-32 py-20 bg-linear-to-b from-[#E75888]/5 to-transparent grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <span className="text-[#e75888] text-sm font-bold tracking-wider uppercase bg-[#e75888]/10 px-3 py-1 rounded-full">Simpel • Modern</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
            Ungkapkan Perasaan Lewat Rangkaian <span className="text-[#e75888]">Buket Cantik</span>
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Sempurnakan momen berhargamu dengan Bouquet by Dila. Menyediakan berbagai pilihan buket premium untuk wisuda, ulang tahun, hingga custom request sesuai selera dan budget-mu.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/product" className="bg-[#e75888] hover:bg-[#c94371] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-md shadow-pink-100 flex items-center gap-2">
              Lihat Katalog <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/custom" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm px-6 py-3 rounded-xl transition-colors">
              Request Custom
            </Link>
          </div>
        </div>
        <div className="hidden md:flex justify-center">
          {/* Bouquet Image */}
          <div className="w-80 h-96 bg-slate-200 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center text-slate-400">
            [ Tempat Foto Buket Utama ]
          </div>
        </div>
      </section>

      {/* VALUE SECTION */}
      <section className="px-8 md:px-20 lg:px-32 py-16 bg-white">
        {/* <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">Mengapa Memilih Bouquet By Dila?</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-3">
            <div className="w-10 h-10 bg-pink-50 text-[#e75888] rounded-xl flex items-center justify-center mx-auto"><Heart className="w-5 h-5" /></div>
            <h3 className="font-bold text-slate-800 text-base">Desain Kekinian</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Rangkaian bunga dan warna wrappers estetik mengikuti tren buket modern masa kini.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-3">
            <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mx-auto"><ShieldCheck className="w-5 h-5" /></div>
            <h3 className="font-bold text-slate-800 text-base">Bisa Atur Tanggal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Bebas tentukan jadwal hari H pengiriman atau pengambilan pesanan tanpa khawatir telat.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mx-auto"><Award className="w-5 h-5" /></div>
            <h3 className="font-bold text-slate-800 text-base">Bebas Kustomisasi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Admin ramah siap merakit buket impianmu menyesuaikan budget kantong mahasiswa.</p>
          </div>
        </div>
      </section>

      {/* HOW TO ORDER SECTION */}
      <HowToOrder />

      {/* NEW PRODUCTS SECTION */}
      <section className="flex flex-col bg-[#E75888]/5 px-8 md:px-20 lg:px-32 py-16">
        <div className="text-center mb-10 space-y-1">
          <h2 className="text-2xl font-bold text-slate-800">Katalog Produk Terbaru</h2>
          <p className="text-xs text-slate-400">Rekomendasi racikan produk terbaru siap pesan minggu ini</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {products?.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {/* CUSTOM BOUQUET CALLOUT BANNER */}
      <section className="px-8 md:px-20 lg:px-32 py-16 bg-white text-center">
        <div className="bg-linear-to-r from-[#E75888] to-[#f07fa6] text-white p-8 md:p-12 rounded-3xl shadow-lg space-y-4 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold">Punya Konsep Buket Sendiri?</h2>
          <p className="text-sm text-white/80 max-w-md mx-auto leading-relaxed">
            Jangan ragu! Ceritakan jenis bunga, warna kertas pembungkus, hingga budget yang kamu punya. Kami siap rakit spesial buat kamu.
          </p>
          <div className="pt-2">
            <Link href="/custom" className="bg-white text-[#e75888] font-bold text-xs px-6 py-3 rounded-xl shadow hover:bg-slate-50 transition-colors inline-block">
              Mulai Konsultasi Custom Buket
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
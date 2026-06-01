import Image from "next/image";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

export default async function Home() {

  // Tarik data dari tabel 'products'
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  // Cek kalau ada error
  if (error) {
    return <div className="p-10">Gagal ambil data: {error.message}</div>
  }

  return (
    <main className="py-10">

      {/* Hero Section */}
      <div className="min-h-screen px-8 md:px-20">
        <h3>Selamat Datang di Bouquet by Dila</h3>
      </div>

      {/* Latest Products */}
      <div className="flex flex-col mt-8 bg-[#E75888]/10 px-8 md:px-20 lg:px-32 py-10">
        <h2 className="text-2xl font-bold mb-5 text-center text-[#E75888]">Produk Terbaru</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {products?.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>

    </main>
  );
}

import Image from "next/image";
import { supabase } from "@/lib/supabase";

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
            <div key={item.id} className="cursor-pointer flex">
              <div className="flex flex-col w-full p-2">
                {/* Pakai tag img biasa dulu buat tes, atau Next Image kalau udah ada URL-nya */}
                <div className="bg-gray-200 h-48 rounded-md flex items-center justify-center text-gray-500">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover rounded-md" />
                  ) : (
                    "No Image"
                  )}
                </div>
                <div className="mt-4">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <p className="text-gray-500 font-sm italic">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                  {item.is_customizable && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full mt-2 inline-block w-">
                      Bisa Custom
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}

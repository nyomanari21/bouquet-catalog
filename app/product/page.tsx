import { supabase } from "@/lib/supabase";
import Link from "next/link";
import FilterDropdown from "@/components/FilterDropdown";

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function Product({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || '';

  const { data: allProducts } = await supabase
    .from('products')
    .select('category')

  const uniqueCategories = Array.from(
    new Set(allProducts?.map((p) => p.category).filter(Boolean))
  ) as string[];

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (selectedCategory) {
    query = query.eq('category', selectedCategory);
  }

  const { data: products, error } = await query;

  if (error) {
    return <div className="p-10">Gagal ambil data: {error.message}</div>
  }

  return (
    <main className="min-h-screen px-8 md:px-20 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Filter Area */}
        <div className="mb-8 flex flex-col">
          <FilterDropdown categories={uniqueCategories} />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {products?.map((item) => (
            <Link href={`/product/${item.slug}`} key={item.id} className="cursor-pointer flex">
              <div className="flex flex-col w-full p-4 rounded-lg hover:scale-102 hover:shadow-lg transition-all duration-300">
                <div className="bg-gray-200 h-48 rounded-md flex items-center justify-center text-gray-500 overflow-hidden relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover rounded-md" />
                  ) : (
                    "No Image"
                  )}
                </div>
                <div className="mt-4">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <p className="text-[#e75888] font-semibold">
                    Rp{item.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products?.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Tidak ada produk di kategori "{selectedCategory}".
          </div>
        )}
        
      </div>
    </main>
  );
}
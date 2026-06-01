import { supabase } from "@/lib/supabase";
import FilterDropdown from "@/components/FilterDropdown";
import ProductCard from "@/components/ProductCard";

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
            <ProductCard key={item.id} product={item} />
          ))}
        </div>

        {products?.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Tidak ada produk di kategori `{selectedCategory}`.
          </div>
        )}
        
      </div>
    </main>
  );
}
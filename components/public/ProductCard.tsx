'use client';
import Link from "next/link";

interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string | null;
    slug: string;
    category: string;
    is_customizable: boolean;
}

interface ProductCardProps {
    product: ProductProps;
}

export default function ProductCard({ product }: ProductCardProps ) {
    return (
        <Link href={`/product/${product.slug}`} className="cursor-pointer flex group">
            <div className="flex flex-col w-full p-4 rounded-lg group-hover:scale-102 group-hover:shadow-[#e75888]/20 group-hover:shadow-lg transition-all duration-300">
                <div className="bg-gray-200 h-48 rounded-md flex items-center justify-center text-gray-500 overflow-hidden relative">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover rounded-md" />
                    ) : (
                        "No Image"
                    )}
                </div>
                <div className="mt-4">
                    <h2 className="font-semibold text-lg group-hover:text-[#e75888] transition-colors">{product.name}</h2>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-[#e75888] font-semibold">
                        Rp{product.price.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>
        </Link>
    )
}
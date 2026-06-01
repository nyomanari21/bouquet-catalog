'use client';

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

interface ProductActionProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    slug: string;
  };
}

export default function ProductAction({ product }: ProductActionProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      slug: product.slug,
    }, quantity);

    alert(`Berhasil menambahkan ${quantity} ${product.name} ke keranjang!`);
  };

  return (
    <>
      {/* Tombol Quantity */}
      <div className="inline-flex justify-between items-center mt-4 border border-gray-500 rounded-lg p-2 gap-4">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))} 
          className="cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" d="M19 12.998H5v-2h14z" />
          </svg>
        </button>
        
        <p className="w-4 text-center font-semibold">{quantity}</p>
        
        <button 
          onClick={() => setQuantity(quantity + 1)} 
          className="cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
          </svg>
        </button>
      </div>

      {/* Tombol Tambah Ke Keranjang */}
      <div className="mt-6">
        <button 
          onClick={handleAddToCart}
          className="bg-[#e75888] text-white py-2 px-4 rounded-md hover:bg-[#d44a7a] transition-colors cursor-pointer font-medium"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </>
  );
}
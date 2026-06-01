import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  slug: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, qty: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (product, qty) => set((state) => {
        const existingItem = state.cart.find((item) => item.id === product.id);

        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + qty }
                : item
            ),
          };
        }

        return { cart: [...state.cart, { ...product, quantity: qty }] };
      }),

      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id),
      })),

      updateQuantity: (id, qty) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
        ),
      })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'bouquet-cart-storage',
    }
  )
);
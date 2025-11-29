// client/src/store.ts
import { create } from 'zustand';
import { Product } from './type';

interface CartItem extends Product {
  id: number;
  price: number;
  quantity: number;
}
interface CartStore {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean; // <--- NUEVO
  openCart: () => void; // <--- NUEVO
  closeCart: () => void; // <--- NUEVO
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void; // Útil para limpiar después de comprar
  exchangeRate: number; // <--- 1. AGREGA ESTO
  setExchangeRate: (rate: number) => void; // <--- 2. AGREGA ESTO
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false, // Por defecto cerrado

  // Acciones para abrir/cerrar
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      let newCart;
      if (existingItem) {
        newCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { ...product, quantity: 1 }];
      }
      // Calcular el total correctamente basándose en todos los items
      const newTotalPrice = newCart.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = item.quantity || 0;
        return sum + (price * quantity);
      }, 0);
      const newTotalItems = newCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      
      return {
        cart: newCart,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const itemToRemove = state.cart.find((item) => item.id === productId);
      if (!itemToRemove) return state;
      
      const newCart = state.cart.filter((item) => item.id !== productId);
      // Calcular el total correctamente basándose en todos los items restantes
      const newTotalPrice = newCart.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = item.quantity || 0;
        return sum + (price * quantity);
      }, 0);
      const newTotalItems = newCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      
      return {
        cart: newCart,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      };
    }),

  clearCart: () => set({ cart: [], totalItems: 0, totalPrice: 0 }),

  exchangeRate: 45, // Valor inicial por defecto (tasa razonable)
  setExchangeRate: (rate) => set({ exchangeRate: rate }),
}));
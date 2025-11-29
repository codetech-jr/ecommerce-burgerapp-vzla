'use client';

import { ShoppingCart, Plus } from "lucide-react";
import { useCartStore } from "@/store"; // Ajusta la ruta a tu store si es distinta
import { Product } from "@/type";
import { useState } from "react";

interface Props {
  product: Product;
  large?: boolean; // <--- Nueva propiedad opcional
}

export default function AddToCartButton({ product, large = false }: Props) {
  // Aquí asumo que usas Zustand o Context. Ajusta según tu lógica real.
  const { addToCart } = useCartStore(); 
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    // Esto evita que si hay un Link padre, se active
    e.preventDefault();
    e.stopPropagation();

    addToCart(product);

    // Efecto visual temporal de "¡Listo!"
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  // --- DISEÑO 1: MODO GRANDE (Página de Detalle) ---
  if (large) {
    return (
      <button
        onClick={handleAdd}
        className={`
          w-full h-full flex items-center justify-center gap-2 text-lg font-bold transition-all active:scale-95
          ${isAdded ? "bg-green-500 text-white" : "bg-primary hover:bg-orange-600 text-white"}
        `}
      >
        {isAdded ? (
           <>¡Agregado! 🎉</>
        ) : (
           <>
             <span>Agregar al Pedido</span>
             <ShoppingCart size={20} strokeWidth={2.5} />
           </>
        )}
      </button>
    );
  }

  // --- DISEÑO 2: MODO PEQUEÑO (Home / Cards) ---
  // (Este es el diseño que ya tenías para el home)
  return (
    <button
      onClick={handleAdd}
      className={`
        rounded-full flex items-center justify-center transition-all shadow-sm border
        size-8 lg:size-10 
        ${isAdded 
            ? "bg-green-500 border-green-500 text-white rotate-180" 
            : "bg-slate-50 border-slate-200 text-primary hover:bg-primary hover:text-white hover:border-primary"
        }
      `}
    >
      {isAdded ? <Plus size={18} className="rotate-45" /> : <Plus size={20} strokeWidth={3} />}
    </button>
  );
}
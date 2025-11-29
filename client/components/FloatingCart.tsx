"use client";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Para saber si ocultarlo

export default function FloatingCart() {
  const { cart, totalPrice, openCart } = useCartStore();
  const [bump, setBump] = useState(false);
  const pathname = usePathname();

  // ANIMACIÓN: Cada vez que cambia el 'cart.length', hacemos un efecto de rebote
  useEffect(() => {
    if (cart.length === 0) return;
    let raf = 0;
    // schedule the state change on the next frame to avoid synchronous setState inside the effect
    raf = requestAnimationFrame(() => setBump(true));
    const timer = setTimeout(() => setBump(false), 300);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [cart.length]);

  // LOGICA VISUAL: 
  // 1. Si no hay items, no mostramos nada (limpieza).
  // 2. Si estamos en /producto/[id], quizás quieras ocultarlo para que no tape el botón de comprar,
  //    O subirlo un poco más arriba (bottom-24). Vamos a subirlo.
  
  if (cart.length === 0) return null;

  // Si la URL empieza con "/producto/", subimos el botón para no tapar el footer fijo
  const isProductPage = pathname.startsWith("/producto/");
  const positionClass = isProductPage ? "bottom-24 md:bottom-10" : "bottom-4 md:bottom-8";

  return (
    <button
      onClick={openCart}
      className={`
        fixed right-4 z-40 flex items-center justify-between gap-3 
        bg-slate-900 text-white px-4 py-3 rounded-full shadow-2xl shadow-orange-500/20
        border border-slate-700 transition-all duration-300 hover:scale-105 active:scale-95
        ${positionClass} ${bump ? "scale-110" : "scale-100"}
      `}
    >
      {/* Icono con Badge */}
      <div className="relative">
        <ShoppingBag size={20} />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-slate-900">
          {cart.length}
        </span>
      </div>

      {/* Total $$ */}
      <span className="font-bold text-sm border-l border-slate-600 pl-3">
        ${Number(totalPrice).toFixed(2)}
      </span>
    </button>
  );
}
'use client'; // <--- OBLIGATORIO: Convertimos a Cliente para poder usar click

import { useState } from "react";
import { useCartStore } from "@/store"; // Tu store de Zustand
import { ShoppingBag, Check } from "lucide-react"; // Iconos para feedback visual
import Image from "next/image";
import dobleShack from "@/public/doble-shack.png"; // Asegúrate de tener esta imagen en /public

export default function PromoBanner() {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isAdded, setIsAdded] = useState(false);

  // DEFINIMOS EL PRODUCTO PROMOCIONAL (Datos hardcodeados para la promo)
  const promoProduct = {
    id: 999, // ID alto para no chocar con los de la DB
    name: "Doble Shack Special",
    description: "Doble carne smashed, doble queso cheddar, tocineta y salsa especial.",
    price: 8.50, // Pon el precio de la oferta
    category: "Promociones",
    image: dobleShack.src, // La misma URL que usas en la imagen
    prepTime: "10-15 min", // tiempo de preparación en minutos (añadido para cumplir con el tipo Product)
    ingredients: ["Carne Smash", "Queso Cheddar x2", "Tocineta", "Salsa Secreta"],  // lista de ingredientes (añadido para cumplir con el tipo Product)
  };

  const handleAdd = () => {
    addToCart(promoProduct);

    // Animación de Feedback
    setIsAdded(true);
    
    // Vibración táctil (Haptic feedback para móvil)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Restaurar botón después de 2 segundos
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section className="w-full px-4 mb-12 md:mb-20">
      <div className="relative bg-primary w-full rounded-[2.5rem] shadow-2xl shadow-orange-900/20 overflow-hidden md:min-h-[380px] flex flex-col md:flex-row group">
        
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')] pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        {/* CONTENIDO */}
        <div className="relative z-10 flex-1 p-8 pt-12 md:pl-16 md:py-16 flex flex-col justify-center items-start text-left">
            
            <span className="inline-block bg-yellow-400 text-orange-900 text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest mb-4 shadow-sm">
              ⭐ FAVORITA DE LA CASA
            </span>
            
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white leading-[1.1] mb-5 drop-shadow-md">
               ¿Probaste la <br/>
               <span className="text-yellow-300">Doble Shack?</span>
            </h2>
            
            <p className="text-orange-50 text-sm md:text-lg font-medium mb-8 max-w-md leading-relaxed">
               Doble carne smashed, doble queso cheddar fundido y tocineta crispy. 
               <strong className="block text-white mt-2 text-lg">La burger definitiva.</strong>
            </p>
            
            {/* --- BOTÓN ACTIVO CON LÓGICA --- */}
            <button 
               onClick={handleAdd}
               disabled={isAdded} // Evita doble clic accidental
               className={`
                 px-8 py-3.5 rounded-full font-bold shadow-lg flex items-center gap-2 transition-all duration-300 active:scale-95
                 ${isAdded 
                   ? "bg-green-500 text-white cursor-default scale-105" // Estado: Agregado
                   : "bg-white text-orange-600 hover:bg-orange-50 hover:shadow-xl hover:-translate-y-1" // Estado: Normal
                 }
               `}
            >
               {isAdded ? (
                 <>
                   ¡Agregado! <Check size={20} />
                 </>
               ) : (
                 <>
                   Agregar al pedido ($8.50) <ShoppingBag size={20} />
                 </>
               )}
            </button>
            {/* ------------------------------ */}

        </div>

        {/* IMAGEN */}
        <div className="flex-1 relative h-64 md:h-auto w-full flex items-end justify-center md:justify-end z-10 overflow-hidden pb-0 md:pb-0">
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:right-10 w-64 h-64 bg-white opacity-20 blur-[80px] rounded-full"></div>
             <img 
               src={promoProduct.image} // Usamos la imagen de la constante
               alt="Doble Shack Burger"
               className="w-auto h-[90%] object-contain md:mr-10 drop-shadow-2xl md:group-hover:scale-110 transition-transform duration-500 ease-out origin-bottom"
            />
        </div>
      </div>
    </section>
  );
}
'use client';

import { Share2, Check, Link as LinkIcon } from "lucide-react";
import { toast } from 'sonner';
import { useState } from "react";

interface Props {
  productName: string;
  text?: string;
}

export default function ShareButton({ productName, text = "¡Mira esto que rico! 🤤" }: Props) {
  const [status, setStatus] = useState<'idle' | 'copied'>('idle');

const handleShare = async () => {
    const url = window.location.href;
    const title = `BurgerApp - ${productName}`;
    const text = `¡Mira esta delicia! ${productName} en BurgerApp 🍔`;

    const shareData = { title, text, url };

    // 1. INTENTA SHARE NATIVO (Móviles)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // Opcional: toast.success("¡Menú compartido!"); 
      } catch (err) {
        console.log("Usuario cerró el menú compartir");
      }
    } 
    // 2. FALLBACK: COPIAR AL PORTAPAPELES (PC)
    else {
      try {
        await navigator.clipboard.writeText(url);
        // Aquí está el cambio "Pro"
        toast.success("Enlace copiado", {
            description: "Listo para pegar en WhatsApp o redes.",
            icon: <Check size={18} />,
            duration: 2000,
        });
      } catch (err) {
        toast.error("No pudimos copiar el enlace", {
            description: "Intenta copiar la URL del navegador manualmente."
        });
      }
    }
  };


  return (
    <button 
      onClick={handleShare}
      className={`
        bg-white/90 backdrop-blur p-2.5 rounded-full shadow-sm 
        transition-all active:scale-90 pointer-events-auto cursor-pointer
        ${status === 'copied' ? 'text-green-600 bg-green-50' : 'text-slate-700 hover:bg-white'}
      `}
      aria-label="Compartir producto"
    >
      {status === 'copied' ? (
        <Check size={24} /> // Icono de "Listo"
      ) : (
        <Share2 size={24} /> // Icono normal
      )}
      
      {/* Tooltip flotante solo para PC cuando se copia */}
      {status === 'copied' && (
        <span className="absolute top-full right-0 mt-2 text-[10px] font-bold bg-black text-white px-2 py-1 rounded shadow-lg whitespace-nowrap animate-fade-in">
          ¡Link copiado!
        </span>
      )}
    </button>
  );
}
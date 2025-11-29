"use client";

import { useState } from "react"; 
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { MapPin, Menu, X } from "lucide-react"; 

const NAV_LINKS = [
  { name: "Menú", href: "/" },
  { name: "Nosotros", href: "/nosotros" },
  { name: "Zonas", href: "/zonas" },
  { name: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* CORRECCIÓN: z-50 para que siempre esté encima de todo */}
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* SECCIÓN IZQUIERDA: Menú y Logo */}
          <div className="flex items-center gap-4"> 
            
            {/* 1. BOTÓN HAMBURGUESA MEJORADO */}
            {/* Le quité el margen negativo (-ml-2) y le puse fondo gris suave para que se vea donde está */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-primary transition-all active:scale-95 bg-slate-50 border border-slate-100 shadow-sm"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
               {/* Usamos condición: Si está abierto muestra X, si no el Menú */}
               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* 2. LOGO (Le agregué z-index relativo por si acaso) */}
            <Link href="/" className="flex items-center gap-2 select-none group relative z-10" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="size-10 bg-primary rounded-xl flex items-center justify-center text-white font-heading font-extrabold text-xl shadow-lg shadow-orange-200 transform group-hover:rotate-3 transition-all shrink-0">
                  B
                </span>
                <div className="hidden min-[360px]:flex flex-col leading-none">
                  <span className="font-heading font-bold text-lg text-slate-900">BurgerApp</span>
                  <span className="text-[9px] font-bold uppercase text-primary tracking-widest">Charallave</span>
                </div>
            </Link>

            {/* 3. UBICACIÓN (Visible Desktop) */}
            <div className="hidden xl:flex items-center gap-2 pl-6 border-l border-slate-100">
                 <div className="bg-slate-50 p-2 rounded-full text-primary">
                   <MapPin size={16} />
                 </div>
                 <div className="flex flex-col leading-none">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Tu ubicación</span>
                    <span className="text-xs font-bold text-slate-800">Centro, Charallave</span>
                 </div>
            </div>
          </div>

          {/* CENTRO: NAVEGACIÓN DESKTOP */}
          <div className="hidden md:flex items-center gap-1 bg-slate-50/50 p-1 rounded-xl border border-slate-100">
             {NAV_LINKS.map((link) => {
               const isActive = pathname === link.href;
               return (
                 <Link 
                   key={link.href} 
                   href={link.href}
                   className={`
                     px-4 py-1.5 rounded-lg text-sm font-bold transition-all
                     ${isActive 
                       ? "bg-white text-primary shadow-sm" 
                       : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                     }
                   `}
                 >
                   {link.name}
                 </Link>
               )
             })}
          </div>

          {/* DERECHA: STATUS */}
          <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100 shadow-sm shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-bold hidden sm:inline">Abierto</span>
               </div>
          </div>
        </div>
      </nav>

      {/* --- PANEL DESPLEGABLE MÓVIL --- */}
      {/* Lógica: Solo se muestra si isMobileMenuOpen es true */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
            {/* Capa oscura de fondo para cerrar al dar clic fuera */}
            <div 
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Panel Blanco */}
            <div className="absolute top-[64px] sm:top-[80px] left-0 w-full bg-white border-b border-t border-slate-100 shadow-xl animate-in slide-in-from-top-2 p-4 rounded-b-3xl">
                <div className="flex flex-col gap-2">
                  {NAV_LINKS.map((link) => {
                     const isActive = pathname === link.href;
                     return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            flex items-center p-4 rounded-xl font-bold text-lg transition-all
                            ${isActive 
                              ? "bg-orange-50 text-primary translate-x-2" 
                              : "text-slate-600 hover:bg-slate-50"
                            }
                          `}
                        >
                          {link.name}
                        </Link>
                     )
                  })}
                  
                  <div className="h-px bg-slate-100 my-2"></div>
                  
                  <div className="p-4 bg-slate-50 rounded-xl flex gap-3 items-center text-slate-500">
                    <MapPin size={20} />
                    <span className="text-sm font-medium">Ubicación: <b>Charallave Centro</b></span>
                  </div>
                </div>
            </div>
        </div>
      )}
    </>
  );
}
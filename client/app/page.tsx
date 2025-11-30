// client/app/page.tsx
import React from "react";
import FloatingCart from "@/components/FloatingCart";
import CartSidebar from "@/components/CartSidebar";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";   
import Footer from "@/components/Footer";
import Hero from "@/components/Hero"; 
import ExchangeRateUpdater from "@/components/ExchangeRateUpdater";
import PromoBanner from "@/components/PromoBanner";
import Testimonials from "@/components/Testimonials"; 
import InstagramFeed from "@/components/InstagramFeed"; 
import Features from "@/components/Features";
import MenuInterface from "@/components/MenuInterface"; 
import { API_URL } from "@/lib/config"; // <--- 1. IMPORTAR CONFIG

// <--- 2. FORZAR ACTUALIZACIÓN SIEMPRE (Rompe el caché del servidor)
export const dynamic = "force-dynamic"; 

// --- DATA FETCHING ---
async function getProducts() {
  try {
    // <--- 3. USAR API_URL EN VEZ DE LOCALHOST
    const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
    
    if (!res.ok) {
        console.error("Error status fetching products:", res.status);
        return [];
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getExchangeRate() {
  try {
    // <--- 3. USAR API_URL AQUÍ TAMBIÉN
    const res = await fetch(`${API_URL}/config`, { cache: "no-store" });
    
    if (!res.ok) return 45; 
    const data = await res.json();
    return data?.tasa ?? 45;
  } catch (e) {
    return 45;
  }
}

// --- COMPONENTE PRINCIPAL ---
export default async function Home() {
  const products = await getProducts();
  const tasaDelDia = await getExchangeRate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <ExchangeRateUpdater rate={tasaDelDia} />

      {/* HERO */}
      <div className="bg-slate-900 pb-32 pt-4 md:pt-8 relative overflow-hidden">
        <Hero />
      </div>


      {/* CONTENEDOR DOCKED (-mt-24) */}
      <main className="flex-1 relative z-20 -mt-24 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-12">
          <HowItWorks />
        </div>

        {/* 1. TODA LA LÓGICA DEL MENÚ */}
        <div id="menu">
          <MenuInterface initialProducts={products} />
        </div>

        {/* 2. BANNER PROMOCIONAL */}
        <div className="max-w-6xl mx-auto mt-12 mb-12">
          <PromoBanner />
        </div>

        {/* 3. TESTIMONIOS */}
        <div className="max-w-6xl mx-auto mt-12 mb-12">
          <Testimonials />
        </div>
          
        {/* 4. REDES SOCIALES */}
        <div className="max-w-6xl mx-auto mt-12 mb-12">
          <InstagramFeed />
        </div>
      </main>

      {/* EXTRAS */}
      <Features />
      <Footer />
      <FloatingCart />
      <CartSidebar />

      {/* Widget de Tasa Flotante Discreto */}
      <div className="fixed bottom-2 left-2 z-50 text-[10px] bg-black/80 text-white px-2 py-1 rounded pointer-events-none opacity-50">
        BCV: Bs. {tasaDelDia}
      </div>
    </div>
  );
}
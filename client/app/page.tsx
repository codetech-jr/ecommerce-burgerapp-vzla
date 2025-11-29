// client/app/page.tsx

// --- IMPORTS ---
import React from "react";
import FloatingCart from "@/components/FloatingCart";
import CartSidebar from "@/components/CartSidebar";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";   // <--- 1. NUEVO
import Footer from "@/components/Footer";
import Hero from "@/components/Hero"; // Nota: Tu componente Hero ya tiene el título y fondo, lo ajustaremos desde el padre.
import ExchangeRateUpdater from "@/components/ExchangeRateUpdater";
import PromoBanner from "@/components/PromoBanner";
import Testimonials from "@/components/Testimonials"; // <--- 2. NUEVO
import InstagramFeed from "@/components/InstagramFeed"; // <--- 3. NUEVO
import Features from "@/components/Features";
import MenuInterface from "@/components/MenuInterface"; // IMPORTA EL NUEVO

// --- DATA FETCHING ---
async function getProducts() {
  try {
    const res = await fetch("http://localhost:3000/products", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

async function getExchangeRate() {
  try {
    const res = await fetch("http://localhost:3000/config", { next: { revalidate: 3600 } });
    if (!res.ok) return 45; // Fallback seguro
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

        {/* 1. TODA LA LÓGICA DEL MENÚ + BUSCADOR + CATEGORÍAS */}
        {/* Le pasamos los productos brutos y él los filtra dentro */}
        <div id="menu">
          <MenuInterface initialProducts={products} />
        </div>
        {/* 2. BANNER PROMOCIONAL */}
        {/* Lo puse DEBAJO del buscador y grid intencionalmente para el flujo: */}
        {/* Buscar -> Ver comida. Pero si quieres el banner ANTES del grid, muévelo DENTRO de MenuInterface.tsx */}
        <div className="max-w-6xl mx-auto mt-12 mb-12">
          <PromoBanner />
        </div>

        {/* 3. TESTIMONIOS DE CLIENTES */}
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

      <div className="fixed bottom-2 right-2 z-50 ...">
        BCV: Bs. {tasaDelDia}
      </div>
    </div>
  );
}
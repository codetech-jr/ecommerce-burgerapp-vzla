import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Flame, Info } from "lucide-react"; // Agregué Info
import AddToCartButton from "@/components/AddToCartButton";
import FloatingCart from "@/components/FloatingCart";
import CartSidebar from "@/components/CartSidebar";
import ShareButton from "@/components/ShareButton"; 
import { Product } from "@/type";
import Link from "next/link";

// API Fetcher seguro
async function getProduct(slug: string): Promise<Product | null> {
  try {
    // Usa variables de entorno en el futuro: process.env.NEXT_PUBLIC_API_URL
    const res = await fetch(`http://127.0.0.1:3000/products/${slug}`, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

// --- SEO ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; 
  const product = await getProduct(slug);
  if (!product) return { title: "Producto no encontrado" };
  
  return {
    title: `${product.name} | BurgerApp 🍔`,
    description: `Pide ${product.name} por $${product.price}. Delivery rápido en Charallave.`,
    openGraph: {
        images: [product.image || '/placeholder.jpg']
    }
  };
}

// --- COMPONENTE PÁGINA ---
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  // SAFEGUARD PARA INGREDIENTES
  // Si es string lo cortamos, si es null devolvemos array vacío
const safeIngredients = product.ingredients || [];

  return (
    // bg-slate-50 para dar contraste con la tarjeta blanca
    <div className="min-h-screen bg-slate-50 pb-32 md:pb-24">
      
      {/* HEADER DE NAVEGACIÓN (Flotante y Glassmorphism) */}
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-between px-4 py-4 pointer-events-none max-w-4xl mx-auto">
        <Link 
            href="/" 
            className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm border border-white/20 text-slate-700 hover:bg-slate-900 hover:text-white transition-all pointer-events-auto active:scale-90"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </Link>
        <div className="pointer-events-auto">
           <ShareButton productName={product.name} />
        </div>
      </div>

      {/* ZONA DE IMAGEN (HERO) */}
      <div className="w-full h-[40vh] md:h-[50vh] relative bg-slate-200 z-0"> 
        {product.image ? (
             <img 
             src={product.image} 
             alt={product.name} 
             className="w-full h-full object-cover"
           />
        ) : (
            // Si el producto (Sushi) no tiene foto en la DB, se verá esto:
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold flex-col gap-2">
                <span>📷</span>
                <span>Sin Imagen</span>
            </div>
        )}
        {/* Degradado inferior opcional */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>


      {/* TARJETA DE CONTENIDO (Sheet Effect) */}
      <div className="relative -mt-10 bg-white rounded-t-[2.5rem] px-6 pt-10 pb-6 shadow-[0_-10px_60px_-15px_rgba(0,0,0,0.3)] max-w-3xl mx-auto min-h-[60vh]">
        
        {/* Pestaña visual decorativa (Pull indicator) */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>

        <div className="flex items-start justify-between mb-2 gap-4">
            <h1 className="font-heading text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>
            {/* El precio aquí lo oculto porque ya sale en la barra fija abajo */}
            {/* <span className="font-heading text-3xl font-bold text-primary">${product.price.toFixed(2)}</span> */}
        </div>
        
        <div className="text-sm text-slate-400 font-medium mb-6 uppercase tracking-wide">
            {product.category || "Plato Principal"}
        </div>

        {/* TAGS DINÁMICOS */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-slate-100 pb-8">
          {/* Tag Popular */}
          <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <Flame size={14} fill="currentColor" /> Popular
          </div>
            
          {/* Tag Tiempo */}
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full text-xs font-bold">
            <Clock size={14} /> {product.prepTime || "15-20 min"}
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div className="space-y-3 mb-8">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
             <Info size={18} className="text-slate-400"/> Descripción
          </h3>
          <p className="text-slate-600 leading-relaxed text-lg font-medium">
            {product.description}
          </p>
        </div>

        {/* INGREDIENTES (ESTILO CHIPS/CAPSULAS) - ¡NUEVO DISEÑO! */}
        {safeIngredients.length > 0 && (
          <div className="mb-8 animate-fade-in-up">
            <h3 className="font-bold text-slate-900 text-lg mb-4">
               🥩 Ingredientes:
            </h3>
            <div className="flex flex-wrap gap-2">
                {safeIngredients.map((ing, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-bold shadow-sm flex items-center gap-2 hover:border-orange-200 hover:text-orange-600 transition-colors cursor-default"
                    >
                      {/* Un puntito de color aleatorio o fijo queda lindo */}
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      {ing.trim()}
                    </span>
                ))}
            </div>
          </div>
        )}

      </div>

        {/* --- STICKY FOOTER --- */}
        <div className="fixed bottom-4 left-4 right-4 z-30 md:bottom-8">
          <div className="max-w-3xl mx-auto bg-slate-900 text-white p-2 pr-2 rounded-2xl shadow-2xl shadow-slate-900/40 flex items-center justify-between border border-slate-800">
              
            {/* PRECIO TOTAL (Izquierda) */}
            <div className="pl-6 flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Total</span>
              <span className="font-heading text-2xl font-black text-white">
              ${Number(product.price).toFixed(2)}
              </span>
            </div>
              
            {/* BOTÓN AGREGAR (Derecha) */}
            {/* Fíjate: Quitamos el fondo naranja del div padre y dejamos que el componente haga el trabajo */}
            <div className="h-12 sm:h-14 min-w-[180px] w-1/2 overflow-hidden rounded-xl">
              <AddToCartButton product={product} large={true} /> 
            </div>

          </div>
        </div>

      {/* Componentes Globales */}
      <CartSidebar />
      <FloatingCart /> 
    </div>
  );
}
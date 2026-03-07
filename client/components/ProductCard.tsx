/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Product } from "@/type";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import { ImageOff } from "lucide-react"; // Necesitarás instalar: npm install lucide-react 
import Link from "next/link";

interface Props {
  product: Product;
}

// Sub-componente visual para el estado vacío (Más limpio)
const PlaceholderImage = () => (
  <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-300 border border-slate-100">
    {/* Icono vectorizado en lugar de texto simple */}
    <ImageOff size={24} strokeWidth={1.5} className="mb-1 opacity-50" />
    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Sin Foto</span>
  </div>
);

export default function ProductCard({ product }: Props) {
  // Build a slug to use in the URL: prefer product.slug, then id, then a slugified name fallback.
  const productSlug = (() => {
    const slug = (product as any).slug;
    if (typeof slug === "string" && slug.length > 0) return slug;
    if (product.id !== undefined) return String(product.id);
    return encodeURIComponent(((product.name as string) || "product").toLowerCase().replace(/\s+/g, "-"));
  })();

  return (
    <Link href={`/product/${productSlug}`} className="block h-full cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-2xl">
      <article
        className="
          group bg-white border-2 border-slate-100 shadow-md rounded-2xl overflow-hidden
          hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 
          transition-all duration-300 ease-out
          /* BASE (Móvil - Horizontal) */
          flex items-stretch gap-3 p-2.5 pr-3
          /* DESKTOP (lg - Vertical) */
          lg:flex-col lg:gap-0 lg:p-0 lg:h-full
        "
      >

        {/* 1. ZONA DE IMAGEN */}
        <div
          className="
            relative shrink-0 overflow-hidden rounded-xl border border-slate-50
            bg-slate-50
            /* BASE: Tamaño más grande cuadradito */
            w-28 h-28 sm:w-36 sm:h-36
            /* DESKTOP: Full width, más altura, sin bordes internos */
            lg:w-full lg:h-56 lg:rounded-none lg:border-none
          "
        >
          {product.image ? (
            <Image
              src={product.image.startsWith("photo-") ? `https://images.unsplash.com/${product.image}` : product.image}
              alt={product.name || "Producto BurgerApp"}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 150px, 300px"
            />
          ) : (
            <PlaceholderImage />
          )}

          {/* Badge "Hot" interactivo */}
          <div className="absolute top-2 left-2 lg:top-3 lg:left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 hidden lg:block">
            <span className="bg-primary text-white text-[10px] uppercase font-black px-2 py-1 rounded-full shadow-md tracking-wider">
              Recomendado
            </span>
          </div>
        </div>

        {/* 2. ZONA DE CONTENIDO */}
        <div
          className="
            flex flex-col grow justify-between
            /* BASE */
            py-1
            /* DESKTOP */
            lg:p-6 lg:pt-5
          "
        >

          <div className="flex flex-col gap-1.5">
            {/* Título */}
            <h3 className="font-heading font-black text-slate-900 leading-tight text-base lg:text-xl group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>

            {/* Descripción */}
            <p className="text-xs lg:text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium opacity-90">
              {product.description || "Delicioso sabor casero preparado al momento para ti."}
            </p>
          </div>

          {/* Footer Card: Precio + Botón */}
          <div className="flex items-center justify-between mt-3 lg:mt-5 pt-3 lg:border-t-2 lg:border-slate-50">
            <div className="flex flex-col leading-none">
              {/* El "Precio" textual lo eliminamos en Desktop para limpieza visual, solo el número importa */}
              <span className="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total</span>
              <div className="flex items-center gap-0.5 text-slate-900 font-heading font-black text-xl lg:text-2xl drop-shadow-sm">
                <span className="text-sm lg:text-base text-primary align-top font-bold">$</span>
                {Number(product.price).toFixed(2)}
              </div>
            </div>

            {/* Botón de acción: Usamos tu componente lógico pero encapsulado visualmente */}
            <div className="origin-right transform active:scale-90 transition-transform lg:scale-110">
              <AddToCartButton product={product} />
            </div>
          </div>

        </div>
      </article>
    </Link>
  );
}
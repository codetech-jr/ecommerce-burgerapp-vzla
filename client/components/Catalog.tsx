"use client";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/type";
import { PackageOpen } from "lucide-react"; // Si no tienes este ícono, usa Search

interface Props {
  initialProducts: Product[];
  // Nota: Aunque se llama 'initial', en realidad ahora recibirá 
  // la lista YA FILTRADA desde MenuInterface.
}

export default function Catalog({ initialProducts }: Props) {

  // 1. DETECCIÓN DE ESTADO VACÍO
  // Si el filtro de arriba no encuentra nada, initialProducts será [].
  if (!initialProducts || initialProducts.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
        <div className="bg-slate-50 p-4 rounded-full mb-3 text-slate-400">
          {/* Icono visual de 'caja vacía' */}
          <PackageOpen size={48} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-1">Uups... no hay nada por aquí</h3>
        <p className="text-slate-400 text-sm">
          Intenta seleccionar otra categoría arriba ☝️
        </p>
      </div>
    );
  }

  // 2. RENDERIZADO PURO (GRID)
  // Aquí ya no filtramos nada, confiamos ciegamente en lo que nos manda el padre.
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Grid responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {initialProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
}
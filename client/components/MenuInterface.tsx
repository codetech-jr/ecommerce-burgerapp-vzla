"use client";
import { useState, useMemo } from "react";
import { Search, X } from "lucide-react"; // Asegúrate de tener lucide-react
import { Product } from "@/type"; // Tu tipo de dato
import Catalog from "./Catalog";  // Tu catálogo existente
import Image from "next/image";

// 1. DEFINIR LAS CATEGORÍAS (Asegúrate que los 'id' coincidan con lo que viene de tu DB si es posible)
const CATEGORIES = [
    { id: "Todo", label: "Todo", img: "https://cdn-icons-png.flaticon.com/512/3405/3405802.png" },
    { id: "Hamburguesas", label: "Hamburguesas", img: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
    { id: "Tequeños", label: "Tequeños", img: "https://cdn-icons-png.flaticon.com/512/5787/5787016.png" },
    { id: "Pizzas", label: "Pizzas", img: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png" },
    { id: "Bebidas", label: "Bebidas", img: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png" },
    { id: "Combos", label: "Combos", img: "https://cdn-icons-png.flaticon.com/512/1356/1356594.png" },
];

interface Props {
    initialProducts: Product[];
}

export default function MenuInterface({ initialProducts }: Props) {
    // ESTADOS DE FILTRADO
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("Todo");

    // LÓGICA DE FILTRADO (Memorizada para rendimiento)
    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            // 1. Filtro por Texto (Nombre o Descripción)
            const matchSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase());

            // 2. Filtro por Categoría (Si no es "Todo", debe coincidir)
            // OJO: Aquí asumo que tu producto tiene una propiedad `category`. 
            // Si no, ajusta esta lógica.
            const matchCategory =
                activeCategory === "Todo" ||
                // Si tu DB guarda categorias en mayusculas/minusculas, normalizamos:
                (product.category && product.category.toLowerCase() === activeCategory.toLowerCase()) ||
                // O búsqueda laxa si no tienes categorías estrictas:
                product.name.toLowerCase().includes(activeCategory.toLowerCase().slice(0, -1));

            return matchSearch && matchCategory;
        });
    }, [searchTerm, activeCategory, initialProducts]);

    return (
        <>
            {/* --- ZONA DE CONTROL (LA TARJETA BLANCA FLOTANTE) --- */}
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-900/10 overflow-hidden border border-slate-100 mb-10 relative z-30">

                {/* A. BUSCADOR */}
                <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row items-center gap-6">
                    <div className="text-center md:text-left shrink-0">
                        <h2 className="text-2xl font-heading font-bold text-slate-800 flex items-center justify-center md:justify-start gap-2">
                            ¿Qué te provoca? <span className="text-3xl animate-pulse">😋</span>
                        </h2>
                        <p className="text-slate-400 text-sm">
                            {filteredProducts.length} resultados encontrados
                        </p>
                    </div>

                    <div className="w-full relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar 'Hamburguesa doble'..."
                            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl py-3.5 pl-12 pr-10 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* B. CATEGORÍAS INTERACTIVAS (CATEGORY RAIL) */}
                <div className="bg-white pb-4 pt-2">
                    <div className="flex gap-4 md:gap-8 overflow-x-auto px-6 pb-4 no-scrollbar snap-x items-center md:justify-center justify-start">
                        {CATEGORIES.map((cat) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`group flex flex-col items-center gap-2 snap-start min-w-[80px] transition-transform active:scale-95 focus:outline-none`}
                                >
                                    {/* Círculo Icono: Cambia de color si está activo */}
                                    <div className={`
                      w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center p-4 relative overflow-hidden border-2 transition-all duration-300
                      ${isActive
                                            ? "border-primary bg-orange-50 shadow-md shadow-orange-200 scale-110"
                                            : "border-slate-100 bg-white group-hover:border-orange-200"
                                        }
                    `}>
                                        <img src={cat.img} alt={cat.label} className="w-full h-full object-contain relative z-10" />
                                    </div>
                                    <span className={`text-xs font-bold transition-colors ${isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-800"}`}>
                                        {cat.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* C. RESULTADOS (CATÁLOGO FILTRADO) */}
            {/* Nota: Aquí asumimos que PromoBanner va fuera de este filtrado, en el padre */}
            <div className="max-w-7xl mx-auto px-4">
                {/* Cabecera de resultados */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-heading font-bold text-slate-900">
                            {activeCategory === 'Todo' ? 'Menú Completo' : activeCategory} 🍔
                        </h2>
                        {searchTerm && <span className="text-slate-500 text-sm">Buscando: "{searchTerm}"</span>}
                    </div>

                    {/* Botón Reset si hay filtros activos */}
                    {(activeCategory !== "Todo" || searchTerm) && (
                        <button
                            onClick={() => { setActiveCategory("Todo"); setSearchTerm("") }}
                            className="text-sm font-bold text-red-500 hover:underline"
                        >
                            Borrar filtros
                        </button>
                    )}
                </div>

                {/* Componente Grid Renderizando Lista Filtrada */}
                {filteredProducts.length > 0 ? (
                    <Catalog initialProducts={filteredProducts} />
                ) : (
                    /* EMPTY STATE BONITO */
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="text-6xl mb-4">🥑</div>
                        <h3 className="font-heading font-bold text-xl text-slate-800">No encontramos eso</h3>
                        <p className="text-slate-500">Intenta buscar otra cosa o cambia la categoría.</p>
                        <button
                            onClick={() => { setActiveCategory("Todo"); setSearchTerm("") }}
                            className="mt-4 px-6 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition"
                        >
                            Ver todo el menú
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
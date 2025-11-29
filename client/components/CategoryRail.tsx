//src/client/components/CategoryRail.tsx

import Image from "next/image";

// Simulación de categorias (puedes traerlas de tu DB)
const categories = [
    { id: 1, name: "Hamburguesas", img: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
    { id: 2, name: "Tequeños", img: "https://cdn-icons-png.flaticon.com/512/5787/5787016.png" }, // Busca iconos flat bonitos
    { id: 3, name: "Pizzas", img: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png" },
    { id: 4, name: "Bebidas", img: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png" },
    { id: 5, name: "Combos", img: "https://cdn-icons-png.flaticon.com/512/1356/1356594.png" },
];

export default function CategoryRail() {
    return (
        <section className="pt-8 pb-4">
            <h3 className="font-bold text-lg text-slate-900 px-4 mb-4">Categorías Populares</h3>

            {/* Scroll Horizontal Container */}
            <div className="flex gap-6 overflow-x-auto px-4 pb-6 no-scrollbar snap-x">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className="group flex flex-col items-center gap-2 snap-start min-w-[80px] focus:outline-none"
                    >
                        {/* Círculo Icono */}
                        <div className="w-20 h-20 rounded-full bg-white border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-orange-200 group-hover:-translate-y-1 transition-all flex items-center justify-center p-4 relative overflow-hidden">
                            {/* Efecto gradiente sutil en hover */}
                            <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <img src={cat.img} alt={cat.name} className="w-full h-full object-contain relative z-10" />
                        </div>
                        <span className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors">
                            {cat.name}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}
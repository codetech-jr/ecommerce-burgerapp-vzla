import { Instagram, ExternalLink } from "lucide-react";
import Image from "next/image";

// NOTA: Para el ejemplo uso imágenes de Unsplash de comida.
// TÚ DEBES CAMBIAR ESTAS URLS por fotos reales de tus hamburguesas (aunque sean fotos caseras bonitas).
const PHOTOS = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", // Burger
    "https://images.unsplash.com/photo-1594046243098-0fceea9d451e?w=500&q=80", // Alitas/Pollo
    "https://images.unsplash.com/photo-1593504049359-74330189a345?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Bebida
    "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&q=80", // Pollo frito
];

export default function InstagramFeed() {
  return (
    <section className="py-2 px-2 md:px-0 md:py-10">
        <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2">
                
                {/* Lado Izquierdo: Llamada a la Acción */}
                <div className="p-10 md:p-20 flex flex-col justify-center items-start text-white relative">
                     {/* Icono Gigante Fondo */}
                    <Instagram className="absolute -bottom-10 -left-10 w-64 h-64 text-white opacity-5 -rotate-12" />
                    
                    <div className="flex items-center gap-2 text-orange-400 font-bold tracking-wider text-sm uppercase mb-4">
                        <Instagram size={18} /> Síguenos en Redes
                    </div>
                    <h2 className="text-4xl md:text-6xl font-heading font-black leading-none mb-6">
                        Nos gusta <br/>
                        presumir <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">nuestro sabor.</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-md">
                        Sube tu foto etiquetándonos @BurgerApp y podrías ganar cupones de descuento sorpresa 🎁.
                    </p>
                    <a 
                       href="https://instagram.com" 
                       target="_blank" 
                       className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-orange-400 hover:text-white transition-all group"
                    >
                       Ir a Instagram <ExternalLink size={18} className="group-hover:rotate-45 transition-transform"/>
                    </a>
                </div>

                {/* Lado Derecho: Grid de Fotos */}
                <div className="grid grid-cols-2 gap-1 md:gap-4 p-1 md:p-8 bg-slate-900/50">
                    {PHOTOS.map((url, i) => (
                        <div key={i} className={`relative aspect-square rounded-2xl overflow-hidden group cursor-pointer ${i%2===0 ? 'translate-y-4' : ''}`}>
                             <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors z-10"></div>
                             <img 
                                src={url} 
                                alt="Instagram Post" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                             />
                             <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Instagram className="text-white drop-shadow-md" size={32} />
                             </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    </section>
  );
}
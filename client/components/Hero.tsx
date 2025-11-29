import Link from "next/link";
import HeroImage from "@/public/burger-banner.jpg";
import { ArrowRight, Clock, Star } from "lucide-react"; // Asegúrate de tener estos iconos

export default function Hero() {
    return (
        <div className="relative w-full bg-[#0B1120] overflow-hidden min-h-[600px] flex items-center">
            
            {/* --- FONDO (AMBIENT LIGHTING) --- */}
            {/* Mancha de luz naranja detrás del texto */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
            {/* Mancha de luz azul detrás de la imagen */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>
            {/* Patrón de cuadrícula sutil */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12 flex flex-col-reverse md:flex-row items-center justify-between gap-12">

                {/* 1. TEXTO Y CTA */}
                <div className="flex-1 text-center md:text-left space-y-8">
                    
                    {/* Badge de Calidad (Estilo Pill) */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md shadow-xl mx-auto md:mx-0 animate-fade-in">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-orange-300 text-xs font-bold uppercase tracking-widest">
                            La favorita de Charallave
                        </span>
                    </div>

                <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white leading-[1.1]">
                    El verdadero <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                        Sabor a Calle
                    </span>
                </h1>

                    <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
                        Carne 100% smashed, pan de papa artesanal y salsas que te volarán la cabeza. 🤯
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                        <Link 
                            href="#menu" 
                            className="group relative bg-[#FF5F1F] hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-orange-500/40 transition-all hover:scale-105 flex items-center gap-3"
                        >
                            PEDIR AHORA
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-400 font-bold">
                            <div className="bg-white/10 p-2 rounded-full">
                                <Clock size={18} className="text-green-400"/>
                            </div>
                            <span>Entrega en <br/> 30-45 min</span>
                        </div>
                    </div>
                </div>

                {/* 2. ZONA DE IMAGEN (HERO) */}
                <div className="flex-1 relative w-full flex justify-center items-center perspective-1000">
                    
                    {/* Círculo decorativo detrás para enmarcar la foto */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-3xl scale-75 animate-pulse-slow"></div>

                    {/* IMAGEN PRINCIPAL */}
                    <div className="relative z-10 w-full max-w-[550px] transform transition-transform duration-500 hover:rotate-2 hover:scale-105">
                        <img
                            src={HeroImage.src}
                            alt="Hamburguesa BurgerApp"
                            // CLAVE: Usamos mask-image para difuminar los bordes si es una imagen cuadrada con fondo
                            className="w-full h-auto object-cover rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] border border-white/5"
                            style={{
                                maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                            }}
                        />
                        
                        {/* TARJETA FLOTANTE DE PRECIO */}
                        <div className="absolute -bottom-6 -left-6 md:bottom-10 md:-left-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl animate-bounce-slow">
                            <span className="block text-xs text-orange-300 font-bold uppercase">Desde</span>
                            <span className="block text-3xl font-heading font-black text-white">$5.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
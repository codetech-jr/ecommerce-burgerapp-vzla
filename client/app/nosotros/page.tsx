import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Nosotros() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION DE LA PÁGINA */}
        <section className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h1 className="font-heading text-4xl md:text-6xl font-extrabold mb-4">
                    Más que comida rápida,<br/>
                    <span className="text-primary">Comida Real.</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Nacimos en las calles de Charallave con una misión simple: demostrar que una hamburguesa puede ser una experiencia gourmet sin perder su esencia callejera.
                </p>
            </div>
        </section>

        {/* HISTORIA / CARACTERÍSTICAS */}
        <section className="py-16 md:py-24 max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* FOTO TIPO "NUESTRA COCINA" */}
                <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500">
                     <img 
                       src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop" 
                       alt="Cocinando burger"
                       className="w-full h-full object-cover"
                     />
                </div>

                {/* TEXTO */}
                <div className="space-y-6">
                    <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 font-bold text-xs rounded-full uppercase">
                        Nuestra Historia
                    </div>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900">
                        Del carrito a tu casa.
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                        Todo comenzó en 2019 con una pequeña plancha y muchas ganas. Hoy, BurgerApp es sinónimo de calidad. 
                        <br/><br/>
                        Nuestra carne es 100% de res molida a diario (nunca congelada), nuestros vegetales vienen del mercado local cada mañana y nuestro pan es horneado artesanalmente.
                    </p>

                    {/* STATS */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                        <div>
                            <span className="block text-3xl font-black text-primary">15k+</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Burgers vendidas</span>
                        </div>
                        <div>
                            <span className="block text-3xl font-black text-primary">30m</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Tiempo entrega</span>
                        </div>
                         <div>
                            <span className="block text-3xl font-black text-primary">4.9</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Estrellas App</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Clock, Truck } from "lucide-react";

export default function Zonas() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 md:py-20 max-w-7xl mx-auto px-4 w-full">
        
        {/* CABECERA SIMPLE */}
        <div className="text-center mb-16">
             <h1 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                ¿Dónde estamos? 📍
             </h1>
             <p className="text-slate-500 max-w-lg mx-auto">
                Hacemos delivery a gran parte de los Valles del Tuy y tenemos punto de Pick-up en el centro.
             </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMNA IZQ: INFO */}
            <div className="space-y-6">
                {/* CARD HORARIO */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Horarios de Atención</h3>
                        <p className="text-slate-500 text-sm mt-1">Lun - Jue: 11:00am - 09:00pm</p>
                        <p className="text-slate-500 text-sm">Vie - Dom: 12:00pm - 11:00pm</p>
                    </div>
                </div>

                {/* CARD ZONAS DELIVERY */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                    <div className="bg-orange-50 p-3 rounded-xl text-primary">
                        <Truck size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Rutas de Delivery</h3>
                        <ul className="mt-2 space-y-2 text-sm text-slate-500 list-disc pl-4">
                             <li>Charallave Casco Central (Gratis)</li>
                             <li>La Estrella / Vista Linda ($1.5)</li>
                             <li>Cúa (Centro) ($3.00)</li>
                             <li>Matalinda ($2.00)</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* COLUMNA DER: MAPA GRANDE (IFRAME) */}
            {/* Puedes buscar tu latitud/longitud en google maps, darle a 'Compartir' -> 'Insertar mapa' */}
            <div className="lg:col-span-2 h-[400px] lg:h-auto bg-slate-200 rounded-3xl overflow-hidden border border-slate-200 shadow-lg relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15704.341542385455!2d-66.86584915!3d10.2386795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2a8c7150988741%3A0x98462678054a645f!2sCharallave%2C%20Miranda!5e0!3m2!1ses-419!2sve!4v1716300000000!5m2!1ses-419!2sve" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                ></iframe>
                
                {/* Un parchecito visual para que se vea más integrado */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg text-xs font-bold pointer-events-none">
                    📍 Centro, Charallave
                </div>
            </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
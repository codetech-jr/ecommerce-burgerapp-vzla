import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle, ChevronDown } from "lucide-react";

// Datos de las preguntas (Esto luego podrías sacarlo de un JSON si quieres)
const FAQS = [
  {
    q: "¿Cuáles son los métodos de pago?",
    a: "Aceptamos pagos en Bolívares vía Pago Móvil y Transferencia Bancaria. En Divisas aceptamos Efectivo (contra entrega), Zelle y Binance Pay."
  },
  {
    q: "¿Hasta dónde llega el delivery?",
    a: "Cubrimos todo el casco central de Charallave totalmente gratis. Zonas como La Estrella, Matalinda y Cúa tienen un recargo adicional que varía entre $1.5 y $3.00 dependiendo de la distancia."
  },
  {
    q: "¿Cuánto tardan en entregar?",
    a: "Nuestro tiempo promedio es de 30 a 45 minutos desde que confirmamos tu pago. Si es fin de semana y hay alta demanda, te avisaremos al confirmar el pedido."
  },
  {
    q: "¿Puedo agendar un pedido para más tarde?",
    a: "¡Sí! En el carrito de compras verás una opción para 'Programar Entrega'. Puedes pedir en la mañana para recibir en la cena sin problemas."
  },
];

const telefono = "584129725334";
const url = `https://api.whatsapp.com/send?phone=${telefono}&text=Hola,%20quiero%20hacer%20una%20consulta%20sobre%20mi%20pedido.`

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto">
            
            {/* CABECERA */}
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <HelpCircle size={32} />
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    Preguntas Frecuentes
                </h1>
                <p className="text-slate-500">
                    Todo lo que necesitas saber antes de pedir tu burger favorita.
                </p>
            </div>

            {/* LISTA ACORDEÓN (HTML Nativo <details> para no usar JS complejo) */}
            <div className="space-y-4">
                {FAQS.map((faq, i) => (
                    <details key={i} className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-slate-900 hover:bg-slate-50 transition-colors">
                            <h3 className="font-bold text-base md:text-lg">{faq.q}</h3>
                            <div className="shrink-0 text-slate-400 group-open:text-primary group-open:rotate-180 transition-transform duration-300">
                                <ChevronDown size={20} />
                            </div>
                        </summary>
                        
                        <div className="px-6 pb-6 text-slate-500 leading-relaxed border-t border-slate-50 pt-4 text-sm md:text-base animate-in fade-in slide-in-from-top-2 duration-200">
                           {faq.a}
                        </div>
                    </details>
                ))}
            </div>
            
            {/* CONTACTO EXTRA */}
            <div className="mt-12 text-center">
                <p className="text-slate-400 text-sm">
                    ¿No encuentras tu duda? Escríbenos al <a href={url} className="text-primary font-bold hover:underline">WhatsApp</a>
                </p>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
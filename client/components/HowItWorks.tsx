import { ShoppingBag, CreditCard, Map } from "lucide-react";

const STEPS = [
  {
    icon: <ShoppingBag size={32} />,
    title: "1. Llena el carrito",
    desc: "Elige tus hamburguesas favoritas. Sin hablar con nadie, a tu ritmo."
  },
  {
    icon: <CreditCard size={32} />,
    title: "2. Paga directo",
    desc: "Selecciona Pago Móvil, Zelle o Efectivo e ingresa tu referencia aquí mismo."
  },
  {
    icon: <Map size={32} />, // Cambiamos ícono a Mapa para el Tracking
    title: "3. Tracking en vivo",
    desc: "¡Mira cómo cocinamos y enviamos tu pedido en tiempo real desde tu pantalla!"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-12 bg-white border-b border-slate-50 relative z-20 rounded-t-[2.5rem] -mt-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-10">
            <span className="text-orange-500 font-bold text-[10px] uppercase tracking-widest border border-orange-100 bg-orange-50 px-3 py-1 rounded-full">
               NUEVO SISTEMA AUTOMATIZADO ⚡
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-slate-900 mt-4">
              Pide sin esperas en <span className="text-primary">3 pasos</span>
            </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Línea conectora visual (Solo Desktop) */}
            <div className="hidden md:block absolute top-10 left-[16%] w-[68%] h-0.5 bg-linear-to-r from-slate-200 via-orange-200 to-slate-200 -z-10 border-t border-dashed border-slate-300"></div>

            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center bg-white p-2 group hover:-translate-y-1 transition-transform duration-300">
                 <div className="w-20 h-20 bg-slate-50 text-slate-700 group-hover:bg-slate-900 group-hover:text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 transition-colors duration-300">
                    {step.icon}
                 </div>
                 <h3 className="text-xl font-black text-slate-900 mb-3">{step.title}</h3>
                 <p className="text-slate-500 leading-relaxed text-sm max-w-xs mx-auto font-medium">
                    {step.desc}
                 </p>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
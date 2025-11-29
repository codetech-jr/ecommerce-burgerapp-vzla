//src/client/components/Features.tsx

import { Clock, ShieldCheck, Truck } from "lucide-react";

const features = [
    {
        icon: <Clock size={32} />,
        title: "Entrega Rápida",
        desc: "En tu puerta en 30-45 mins garantizados."
    },
    {
        icon: <ShieldCheck size={32} />,
        title: "Pagos Seguros",
        desc: "Aceptamos Zelle, Pago Móvil y Cash."
    },
    {
        icon: <Truck size={32} />,
        title: "Delivery Gratis",
        desc: "En todo el casco central de Charallave."
    }
];

export default function Features() {
    return (
        <section className="py-12 border-t border-slate-100 bg-white">
            <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((f, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-4">
                        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-primary flex items-center justify-center mb-4">
                            {f.icon}
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">{f.title}</h4>
                        <p className="text-slate-500 text-sm max-w-[200px]">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
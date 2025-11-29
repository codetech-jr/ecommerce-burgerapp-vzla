/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { CheckCircle2, ChefHat, Bike, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Definimos los pasos visuales fuera para que no se recreen en cada render
const STEPS = [
  { status: "PAGADO", label: "Recibido", icon: <CheckCircle2 /> },
  { status: "COCINANDO", label: "Preparando", icon: <ChefHat /> },
  { status: "DELIVERY", label: "En camino", icon: <Bike /> },
  { status: "ENTREGADO", label: "Entregado", icon: <Home /> },
];

// 1. COMPONENTE INTERNO (Contiene toda tu lógica original)
function OrderTrackingContent() {
  const params = useSearchParams();
  const orderId = params.get("id");

  const [order, setOrder] = useState<any>(null);
  
  useEffect(() => {
    if (!orderId) return;

    // Importante: En producción, 'http://localhost:3000' fallará si no es el mismo host.
    // Es recomendable usar rutas relativas '/api/orders...' o variables de entorno.
    const fetchStatus = async () => {
        try {
            // Usamos ruta relativa por seguridad, asumiendo que el back está en el mismo Next.js
            // Si tienes un back separado, mantén tu URL completa.
            const res = await fetch(`http://localhost:3000/orders/${orderId}`); 
            if(res.ok) setOrder(await res.json());
        } catch (e) {
            console.error("Error al obtener estado de la orden:", e);
        }
    };

    fetchStatus(); // Primera llamada
    const interval = setInterval(fetchStatus, 5000); // Repetir
    return () => clearInterval(interval);
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-slate-400" size={40} />
      </div>
    );
  }

  // CALCULAR EL PROGRESO VISUAL
  const currentStepIndex = STEPS.findIndex(s => s.status === order.status);
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center">
       
       <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mt-8">
           {/* HEADER CON ID */}
           <div className="bg-slate-900 p-6 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Orden #{order.id}</p>
                <h1 className="text-2xl font-black text-white">
                    {order.status === "PENDIENTE_VERIFICACION" ? "Verificando Pago..." : "Seguimiento en Vivo"}
                </h1>
           </div>
           
           <div className="p-8">
               {/* LINEA DE TIEMPO (STEPS) */}
               <div className="relative flex justify-between mb-12">
                    <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 -z-10"></div>
                    <div 
                        className="absolute top-5 left-0 h-1 bg-green-500 z-0 transition-all duration-1000" 
                        style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
                    ></div>
                    {STEPS.map((step, idx) => {
                        const isActive = idx <= activeIndex;
                        const isCurrent = idx === activeIndex;
                        return (
                            <div key={step.status} className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? "bg-green-500 text-white scale-110 shadow-lg shadow-green-200" : "bg-slate-200 text-slate-400"}`}>
                                    {step.icon}
                                </div>
                                <span className={`text-[10px] font-bold uppercase ${isCurrent ? "text-green-600" : "text-slate-300"}`}>
                                    {step.label}
                                </span>
                            </div>
                        )
                    })}
               </div>
               
               {/* MENSAJE CENTRAL GRANDE */}
               <div className="text-center space-y-2">
                    {order.status === "PENDIENTE_VERIFICACION" && (
                         <p className="text-slate-500 animate-pulse">El local está revisando tu referencia... 🕐</p>
                    )}
                    {order.status === "PAGADO" && (
                        <p className="text-green-600 font-bold">¡Pago confirmado! En cola de cocina 👨‍🍳</p>
                    )}
                    {order.status === "COCINANDO" && (
                        <p className="text-orange-500 font-bold">¡Fuego! Tu comida se está preparando 🔥</p>
                    )}
                    {order.status === "DELIVERY" && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                             <p className="text-blue-700 font-bold text-lg">🛵 Tu pedido va en camino</p>
                             <p className="text-blue-400 text-sm">Atento al timbre en: {order.address}</p>
                        </div>
                    )}
                    {order.status === "ENTREGADO" && (
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                             <p className="text-green-700 font-bold text-lg">✅ ¡Pedido Entregado!</p>
                             <p className="text-green-400 text-sm">Gracias por tu compra</p>
                        </div>
                    )}
               </div>
           </div>
           
           <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
               <Link href="/" className="text-sm text-slate-400 font-bold hover:text-slate-900">← Volver al Menú</Link>
           </div>
       </div>
    </div>
  )
}

// 2. COMPONENTE PADRE EXPORTADO (Añadimos Suspense aquí)
export default function SuccessPage() {
  return (
    // El fallback es un pequeño loader que se muestra solo un instante mientras se leen los params
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" size={40} />
      </div>
    }>
      <OrderTrackingContent />
    </Suspense>
  );
}
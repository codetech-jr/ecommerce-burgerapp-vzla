"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from 'sonner';
import { X, Trash2, Send, ShoppingBag, Smartphone, CreditCard, Banknote, Bitcoin, User, MapPin, Phone, AlertCircle, Store, Bike, Clock, CalendarClock } from "lucide-react"; // Iconos nuevos
import { useCartStore } from "@/store";

const PAYMENT_METHODS = [
  { id: 'pago_movil', label: 'Pago Móvil', icon: <Smartphone size={16} />, requiresRef: true },
  { id: 'zelle', label: 'Zelle', icon: <CreditCard size={16} />, requiresRef: true },
  { id: 'binance', label: 'Binance', icon: <Bitcoin size={16} />, requiresRef: true },
  { id: 'efectivo', label: 'Efectivo', icon: <Banknote size={16} />, requiresRef: false },
];

export default function CartSidebar() {
  const { cart, totalPrice, isOpen, closeCart, removeFromCart, clearCart, exchangeRate } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- ESTADOS DEL CLIENTE ---
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  // --- NUEVOS ESTADOS: MODO ENTREGA Y FECHA ---
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState("");

  const [isScheduled, setIsScheduled] = useState(false); // ¿Quiere programar?
  const [scheduledTime, setScheduledTime] = useState(""); // Hora seleccionada

  const [paymentMethod, setPaymentMethod] = useState('pago_movil');
  const [paymentRef, setPaymentRef] = useState("");

  useEffect(() => setIsMounted(true), []);

const handleCheckout = async () => {
    // 1. VALIDACIONES CON TOAST
    if (!customerName.trim() || !phone.trim()) {
      toast.warning("Faltan Datos", {
        description: "Por favor escribe tu Nombre y Teléfono.",
      });
      return; // Detiene la función
    }

    const methodConfig = PAYMENT_METHODS.find(m => m.id === paymentMethod);
    if (methodConfig?.requiresRef && paymentRef.length < 4) {
        toast.info("Referencia requerida", {
            description: "Por favor ingresa los últimos dígitos de tu pago o nombre del titular."
        });
        return;
    }

    setIsSubmitting(true);
    // Mensaje de carga inicial
    const toastId = toast.loading("Procesando pedido...");

    try {
      const orderData = {
        customerName, phone, address: address || "Retiro en Local",
        total: parseFloat(Number(totalPrice).toFixed(2)), 
        paymentMethod, items: cart, 
        paymentRef: paymentRef || "N/A"
      };

      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Error al crear orden");
      const savedOrder = await res.json();

      // ÉXITO
      toast.dismiss(toastId); // Quitamos el "Cargando"
      toast.success("¡Pedido Recibido!", {
          description: "Redirigiendo al seguimiento...",
          duration: 2000, // Dura 2 segundos antes de cambiar de pagina
      });

      clearCart();
      
      // Un pequeño delay para que el usuario vea el check verde antes de irse
      setTimeout(() => {
          window.location.href = `/order-success?id=${savedOrder.id}`;
      }, 1000);

    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Error de conexión", {
          description: "No pudimos contactar al servidor. Intenta de nuevo."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted || !isOpen) return null;
  const totalBs = Number(totalPrice) * exchangeRate;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity" onClick={closeCart} />

      <aside className="fixed top-0 right-0 z-[70] w-full max-w-[400px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" /> Tu Pedido
          </h2>
          <button onClick={closeCart} className="p-2 hover:bg-slate-50 rounded-full"><X size={20} className="text-slate-400" /></button>
        </div>

        {/* LISTA CARRITO */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40 gap-2">
              <ShoppingBag size={48} />
              <p className="font-bold">Tu carrito está vacío :(</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="group flex gap-3 bg-white p-3 pr-4 rounded-2xl border border-slate-100 shadow-sm relative hover:border-orange-200 transition-colors">
                <div className="relative w-16 h-16 shrink-0 bg-slate-100 rounded-xl overflow-hidden">
                  {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px]">FOTO</div>}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{item.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">x{item.quantity}</p>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <button onClick={() => removeFromCart(item.id)} className="text-red-300 hover:text-red-500 mb-1"><Trash2 size={14} /></button>
                  <span className="font-black text-slate-900 text-sm">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- FORMULARIO FINAL --- */}
        <div className="bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-5 z-20">

          {/* SWITCH: DELIVERY vs RETIRO (NUEVO) */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
            <button
              onClick={() => setDeliveryMode('delivery')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${deliveryMode === 'delivery' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Bike size={16} /> Delivery
            </button>
            <button
              onClick={() => setDeliveryMode('pickup')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${deliveryMode === 'pickup' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Store size={16} /> Retiro
            </button>
          </div>

          {/* INPUTS DE DATOS */}
          <div className="space-y-3 mb-4">
            <div className="flex gap-2">
              <input placeholder="Tu Nombre" value={customerName} onChange={e => setCustomerName(e.target.value)} className="flex-1 p-2.5 bg-slate-50 rounded-lg text-xs border outline-none focus:border-primary" />
              <input placeholder="Teléfono" value={phone} onChange={e => setPhone(e.target.value)} className="w-[40%] p-2.5 bg-slate-50 rounded-lg text-xs border outline-none focus:border-primary" />
            </div>

            {/* INPUT DIRECCIÓN (Solo si es Delivery) */}
            {deliveryMode === 'delivery' && (
              <div className="relative animate-in slide-in-from-top-2">
                <MapPin size={14} className="absolute top-3 left-3 text-slate-400" />
                <input
                  placeholder="Dirección Exacta (Calle, Casa...)"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full pl-8 p-2.5 bg-slate-50 rounded-lg text-xs border outline-none focus:border-primary"
                />
              </div>
            )}
          </div>

          {/* PROGRAMACIÓN DE HORA (NUEVO) */}
          <div className="mb-4 p-3 border border-slate-100 rounded-xl bg-slate-50/50">
            <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setIsScheduled(!isScheduled)}>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                <CalendarClock size={16} /> ¿Programar pedido?
              </span>
              <div className={`w-8 h-4 rounded-full transition-colors ${isScheduled ? 'bg-primary' : 'bg-slate-300'} relative`}>
                <div className={`w-2 h-2 bg-white rounded-full absolute top-1 transition-all ${isScheduled ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>

            {isScheduled && (
              <div className="animate-in fade-in mt-2">
                <input
                  type="datetime-local"
                  className="w-full p-2 text-xs border rounded-lg bg-white outline-none focus:border-primary"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
                <p className="text-[9px] text-orange-500 mt-1">* Sujeto a confirmación del local</p>
              </div>
            )}
          </div>

          {/* MÉTODOS DE PAGO */}
          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
            {PAYMENT_METHODS.map(m => (
              <button key={m.id} onClick={() => { setPaymentMethod(m.id); setPaymentRef(""); }}
                className={`px-3 py-2 rounded-lg border text-[10px] font-bold whitespace-nowrap flex items-center gap-2 transition-all ${paymentMethod === m.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          {/* CAMPOS CONDICIONALES DE PAGO (Con Zelle agregado) */}
          <div className="mb-4 min-h-[100px] md:min-h-[120px]">
            {/* Pago Móvil */}
            {paymentMethod === 'pago_movil' && (
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-100 animate-in fade-in">
                <p className="text-[10px] md:text-xs text-blue-800 font-mono mb-2 md:mb-3 border-l-2 border-blue-300 pl-2 md:pl-3 leading-relaxed">
                  Pago Móvil: 0412-9725334 • CI: 20.555.999 • Banco Vzla
                </p>
                <input placeholder="Últimos 4 dígitos REF" value={paymentRef} onChange={e => setPaymentRef(e.target.value)} className="w-full p-2 md:p-2.5 bg-white rounded text-xs md:text-sm outline-none border border-blue-200 focus:border-blue-500" />
              </div>
            )}
            {/* Zelle (NUEVO) */}
            {paymentMethod === 'zelle' && (
              <div className="bg-purple-50 p-3 md:p-4 rounded-lg border border-purple-100 animate-in fade-in">
                <p className="text-[10px] md:text-xs text-purple-800 mb-2 md:mb-3 border-l-2 border-purple-300 pl-2 md:pl-3 leading-relaxed">
                  Zelle: <strong>pagos@burgerapp.com</strong> <br /> Titular: Inversiones Vzla
                </p>
                <input placeholder="Nombre del Titular Zelle" value={paymentRef} onChange={e => setPaymentRef(e.target.value)} className="w-full p-2 md:p-2.5 bg-white rounded text-xs md:text-sm outline-none border border-purple-200 focus:border-purple-500" />
              </div>
            )}
            {/* Binance */}
            {paymentMethod === 'binance' && (
              <div className="bg-yellow-50 p-3 md:p-4 rounded-lg border border-yellow-200 animate-in fade-in">
                <p className="text-[10px] md:text-xs text-yellow-800 mb-2 md:mb-3 leading-relaxed">
                  Pay ID: <strong>123456789</strong> (CriptoBurger)
                </p>
                <input placeholder="ID Transacción / Ref" value={paymentRef} onChange={e => setPaymentRef(e.target.value)} className="w-full p-2 md:p-2.5 bg-white rounded text-xs md:text-sm outline-none border border-yellow-200 focus:border-yellow-500" />
              </div>
            )}
            {/* Efectivo */}
            {paymentMethod === 'efectivo' && (
              <div className="bg-orange-50 p-3 md:p-4 rounded-lg border border-orange-100 text-center text-xs md:text-sm text-orange-800 font-medium animate-in fade-in">
                💵 Pagarás en efectivo al recibir. <br /> <span className="opacity-70 text-[10px] md:text-xs">Ten monto exacto por favor.</span>
              </div>
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={isSubmitting || cart.length === 0}
            className="w-full py-3 bg-primary hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-all active:scale-95 disabled:opacity-50 flex justify-between px-4 items-center"
          >
            <span>{isSubmitting ? "Enviando..." : "Confirmar Pedido"}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm">${Number(totalPrice).toFixed(2)}</span>
          </button>
          <div className="text-center mt-1.5">
            <span className="text-[9px] text-slate-400 font-bold">Ref BCV: Bs. {totalBs.toLocaleString('es-VE', { maximumFractionDigits: 2 })}</span>
          </div>

        </div>
      </aside>
    </>
  );
}
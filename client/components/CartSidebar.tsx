"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from 'sonner';
import { Plus, Minus, X, Trash2, Send, ShoppingBag, Smartphone, CreditCard, Banknote, Bitcoin, User, MapPin, Phone, AlertCircle, Store, Bike, Clock, CalendarClock } from "lucide-react"; // Iconos nuevos
import { useCartStore } from "@/store";
import { API_URL } from "@/lib/config";

const PAYMENT_METHODS = [
  { id: 'pago_movil', label: 'Pago Móvil', icon: <Smartphone size={16} />, requiresRef: true },
  { id: 'zelle', label: 'Zelle', icon: <CreditCard size={16} />, requiresRef: true },
  { id: 'binance', label: 'Binance', icon: <Bitcoin size={16} />, requiresRef: true },
  { id: 'efectivo', label: 'Efectivo', icon: <Banknote size={16} />, requiresRef: false },
];

const DELIVERY_ZONES = [
  { id: 'alimentos_v1', name: 'Alimentos V (1era etapa)', price: 1.00 },
  { id: 'alimentos_v2', name: 'Alimentos V (2da etapa)', price: 1.50 },
  { id: 'alimentos_v3', name: 'Alimentos V (3era y 4ta etapa)', price: 2.00 },
  { id: 'centro', name: 'Centro de Charallave', price: 1.00 },
  { id: 'curva', name: 'La Curva / Chara', price: 1.50 },
  { id: 'mados', name: 'Mados / Jabillitos', price: 1.50 },
  { id: 'paso_real', name: 'Paso Real (2000)', price: 2.50 },
  { id: 'colinas', name: 'Colinas de Betania', price: 3.00 },
  { id: 'otro', name: 'Otra zona (A coordinar)', price: 0 }
];

export default function CartSidebar() {
  const { cart, totalPrice, isOpen, closeCart, removeFromCart, clearCart, exchangeRate, addToCart, decrementQuantity } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- ESTADOS DEL CLIENTE ---
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  // --- NUEVOS ESTADOS: MODO ENTREGA Y FECHA ---
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [address, setAddress] = useState("");

  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");

  const [paymentMethod, setPaymentMethod] = useState('pago_movil');
  const [paymentRef, setPaymentRef] = useState("");

  useEffect(() => setIsMounted(true), []);

  // Calcular precio de delivery basado en la zona
  const selectedZone = DELIVERY_ZONES.find(z => z.id === selectedZoneId);
  const deliveryCost = deliveryMode === 'delivery' && selectedZone ? selectedZone.price : 0;
  const finalTotal = totalPrice + deliveryCost;

  const handleCheckout = async () => {
    // 1. VALIDACIONES CON TOAST
    if (!customerName.trim() || !phone.trim()) {
      toast.warning("Faltan Datos", {
        description: "Por favor escribe tu Nombre y Teléfono.",
      });
      return; // Detiene la función
    }

    if (deliveryMode === 'delivery' && !selectedZoneId) {
      toast.warning("Falta la Zona", {
        description: "Por favor selecciona una zona de delivery."
      });
      return;
    }

    const methodConfig = PAYMENT_METHODS.find(m => m.id === paymentMethod);
    if (methodConfig?.requiresRef && paymentRef.length < 4) {
      toast.info("Referencia requerida", {
        description: "Por favor ingresa los últimos 4 dígitos de tu pago o nombre del titular."
      });
      return;
    }

    setIsSubmitting(true);
    // Mensaje de carga inicial
    const toastId = toast.loading("Procesando pedido...");

    try {
      const orderData = {
        customerName, phone, address: address || "Retiro en Local",
        total: parseFloat(Number(finalTotal).toFixed(2)),
        paymentMethod, items: cart,
        paymentRef: paymentRef || "N/A"
      };

      const res = await fetch(`${API_URL}/orders`, {
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
        localStorage.setItem("burgerapp_last_order", savedOrder.id.toString());
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
  const totalBs = finalTotal * exchangeRate;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity" onClick={closeCart} />

      <aside className="fixed top-0 right-0 z-[70] w-full max-w-[420px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* [1] HEADER DEL CARRITO (Sticky Top) */}
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10 sticky top-0">
          <h2 className="font-heading font-black text-xl text-slate-800 flex items-center gap-2">
            <ShoppingBag size={22} className="text-primary" /> Tu Pedido
          </h2>
          <button onClick={closeCart} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* CONTENIDO DESPLAZABLE */}
        <div className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar">

          {/* [2] LISTADO DE PRODUCTOS (Item Card) */}
          <div className="p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center opacity-40 gap-2">
                <ShoppingBag size={48} />
                <p className="font-bold">Tu carrito está vacío</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="group bg-white p-3 rounded-2xl border border-slate-100 shadow-sm relative flex gap-3 h-24">

                  {/* Imagen */}
                  <div className="relative w-20 h-full shrink-0 bg-slate-50 rounded-xl overflow-hidden">
                    {item.image ? (
                      <Image src={item.image.startsWith("photo-") ? `https://images.unsplash.com/${item.image}` : item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300">Sin foto</div>
                    )}
                  </div>

                  {/* Detalles */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6 line-clamp-2">{item.name}</h4>
                      {/* Botón eliminar pequeño arriba a la derecha */}
                      <button onClick={() => removeFromCart(item.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between">
                      {/* Number Stepper */}
                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-full px-1 py-1 shadow-sm">
                        <button onClick={() => decrementQuantity(item.id)} className="w-6 h-6 flex justify-center items-center bg-white shadow-sm rounded-full text-slate-600 hover:text-primary transition-colors"><Minus size={14} /></button>
                        <span className="text-xs text-slate-800 font-bold w-3 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-6 h-6 flex justify-center items-center bg-white shadow-sm rounded-full text-slate-600 hover:text-primary transition-colors"><Plus size={14} /></button>
                      </div>
                      {/* Precio */}
                      <div className="font-heading font-black text-slate-900 text-base">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-5 pb-6 space-y-6">

            {/* [3] MÉTODO DE ENTREGA (Segmented Control) */}
            <div className="bg-slate-200/60 p-1.5 rounded-xl flex w-full relative">
              {/* Fondo desplazable del switch */}
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm border border-slate-200 transition-all duration-300 ease-out z-0 ${deliveryMode === 'delivery' ? 'left-1.5 border-primary/40' : 'left-[calc(50%+4px)]'}`}
              ></div>

              <button
                onClick={() => setDeliveryMode('delivery')}
                className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-colors ${deliveryMode === 'delivery' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Bike size={18} className={deliveryMode === 'delivery' ? 'text-primary' : ''} /> Delivery
              </button>
              <button
                onClick={() => setDeliveryMode('pickup')}
                className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-colors ${deliveryMode === 'pickup' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Store size={18} className={deliveryMode === 'pickup' ? 'text-primary' : ''} /> Retiro
              </button>
            </div>

            {/* [4] DATOS DEL CLIENTE Y ENVÍO */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Tu Nombre"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full p-3.5 bg-white rounded-xl text-sm border border-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400 font-medium"
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-3.5 bg-white rounded-xl text-sm border border-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400 font-medium"
                />
              </div>

              {/* DIRECCIÓN */}
              {deliveryMode === 'delivery' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="relative">
                    <MapPin size={16} className="absolute top-4 left-3.5 text-slate-400" />
                    <textarea
                      rows={2}
                      placeholder="📍 Dirección Exacta (Calle, Casa, Referencia...)"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full pl-10 p-3.5 bg-white rounded-xl text-sm border border-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  {/* SELECTOR DE ZONA */}
                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className={`w-full p-3.5 bg-white rounded-xl text-sm border outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium appearance-none ${!selectedZoneId ? 'text-slate-400 border-red-200 ring-1 ring-red-100' : 'text-slate-700 border-slate-200 focus:border-primary'}`}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    <option value="" disabled>Selecciona tu zona de envío...</option>
                    {DELIVERY_ZONES.map(zone => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} {zone.price > 0 ? `(+$${zone.price.toFixed(2)})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* PROGRAMAR PEDIDO */}
              <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsScheduled(!isScheduled)}>
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <CalendarClock size={18} className="text-slate-400" /> ¿Programar pedido?
                  </span>
                  {/* Switch tipo iOS */}
                  <div className={`w-11 h-6 rounded-full transition-colors ${isScheduled ? 'bg-primary' : 'bg-slate-200'} relative`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${isScheduled ? 'left-[22px]' : 'left-0.5'}`}></div>
                  </div>
                </div>

                {isScheduled && (
                  <div className="animate-in fade-in slide-in-from-top-2 mt-3 pt-3 border-t border-slate-100">
                    <input
                      type="datetime-local"
                      className="w-full p-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 outline-none focus:border-primary focus:bg-white font-medium text-slate-700"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1 font-medium"><AlertCircle size={12} /> Sujeto a disponibilidad del local</p>
                  </div>
                )}
              </div>
            </div>

            {/* [5] DESGLOSE DE PRECIOS */}
            <div className="bg-slate-100/70 border border-slate-200 border-dashed rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-slate-600 text-sm font-medium">
                <span>Subtotal</span>
                <span>${Number(totalPrice).toFixed(2)}</span>
              </div>

              {deliveryMode === 'delivery' && (
                <div className="flex justify-between items-center text-slate-600 text-sm font-medium">
                  <span>Envío {selectedZone ? `(${selectedZone.name.split(' ')[0]}...)` : ''}</span>
                  <span className={!selectedZone ? 'text-orange-500 font-bold text-xs' : 'text-slate-600'}>
                    {selectedZone ? (selectedZone.price === 0 ? 'Gratis' : `+$${selectedZone.price.toFixed(2)}`) : 'Selecciona zona'}
                  </span>
                </div>
              )}

              <div className="border-t border-slate-300/50 my-1.5"></div>
              <div className="flex justify-between items-center text-slate-900 text-lg font-black font-heading">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* [6] PESTAÑAS DE MÉTODO DE PAGO */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 ml-1">Método de Pago</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5 snaps-x">
                {PAYMENT_METHODS.map(m => (
                  <button key={m.id} onClick={() => { setPaymentMethod(m.id); setPaymentRef(""); }}
                    className={`snap-start px-4 py-2.5 rounded-xl border text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all shadow-sm ${paymentMethod === m.id ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-[1.02]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* [7] CONTENEDOR DE PAGO ACTIVO */}
            <div className="min-h-[120px]">
              {/* Pago Móvil */}
              {paymentMethod === 'pago_movil' && (
                <div className="bg-blue-50 p-4 xl:p-5 rounded-2xl border-2 border-blue-200 animate-in fade-in">
                  <p className="text-xs text-blue-900 font-medium mb-3 leading-relaxed text-center">
                    Pago Móvil: <span className="font-bold">0412-9725334</span><br />CI: <span className="font-bold">20.555.999</span> • <span className="font-bold">Banco Vzla</span>
                  </p>
                  <input
                    type="number"
                    placeholder="Últimos 4 dígitos REF"
                    value={paymentRef}
                    onChange={e => setPaymentRef(e.target.value)}
                    className="w-full p-3 bg-white rounded-xl text-sm outline-none border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-bold placeholder:font-normal text-center tracking-widest shadow-inner relative z-20"
                  />
                  {paymentRef.length > 0 && paymentRef.length < 4 && <p className="text-[10px] text-red-500 mt-1.5 text-center font-medium">Debe tener al menos 4 dígitos</p>}
                </div>
              )}
              {/* Zelle */}
              {paymentMethod === 'zelle' && (
                <div className="bg-purple-50 p-4 xl:p-5 rounded-2xl border-2 border-purple-200 animate-in fade-in">
                  <p className="text-xs text-purple-900 font-medium mb-3 leading-relaxed text-center">
                    Zelle: <strong className="font-bold">pagos@burgerapp.com</strong> <br /> Titular: Inversiones Vzla
                  </p>
                  <input placeholder="Nombre del Titular Zelle" value={paymentRef} onChange={e => setPaymentRef(e.target.value)} className="w-full p-3 bg-white rounded-xl text-sm outline-none border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-bold placeholder:font-normal text-center shadow-inner" />
                </div>
              )}
              {/* Binance */}
              {paymentMethod === 'binance' && (
                <div className="bg-yellow-50 p-4 xl:p-5 rounded-2xl border-2 border-yellow-300 animate-in fade-in">
                  <p className="text-xs text-yellow-900 font-medium mb-3 leading-relaxed text-center">
                    Pay ID: <strong className="font-bold">123456789</strong> <br />(CriptoBurger)
                  </p>
                  <input placeholder="ID Transacción / Ref" value={paymentRef} onChange={e => setPaymentRef(e.target.value)} className="w-full p-3 bg-white rounded-xl text-sm outline-none border border-yellow-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 font-bold placeholder:font-normal text-center shadow-inner" />
                </div>
              )}
              {/* Efectivo */}
              {paymentMethod === 'efectivo' && (
                <div className="bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-200 text-center animate-in fade-in flex flex-col items-center justify-center min-h-[120px]">
                  <Banknote className="text-emerald-500 mb-2" size={28} />
                  <p className="text-sm text-emerald-900 font-bold">Pagarás en efectivo al recibir.</p>
                  <p className="opacity-70 text-xs text-emerald-800 mt-1 font-medium">Ten el monto exacto por favor.</p>
                </div>
              )}
            </div>

            {/* Espacio extra al final para que el footer no tape el contenido */}
            <div className="h-6"></div>
          </div>
        </div>

        {/* [8] FOOTER / CTA FIJO FINAL (Sticky Bottom) */}
        <div className="bg-white border-t border-slate-100 p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20 sticky bottom-0">
          <button
            onClick={handleCheckout}
            disabled={isSubmitting || cart.length === 0 || (PAYMENT_METHODS.find(m => m.id === paymentMethod)?.requiresRef && paymentRef.length < 4)}
            className="w-full py-4 bg-primary hover:bg-orange-600 text-white rounded-2xl font-black shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex justify-between px-5 items-center text-lg"
          >
            <span className="flex items-center gap-2">{isSubmitting ? "Enviando..." : "Enviar Pedido y Pagar"}</span>
            <span className="bg-black/15 px-3 py-1 rounded-lg text-base shadow-inner">${finalTotal.toFixed(2)}</span>
          </button>

          <div className="text-center mt-3">
            <span className="text-[11px] text-slate-500 font-bold bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm">
              Tasa BCV hoy: Bs. {exchangeRate.toLocaleString('es-VE', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

      </aside>
    </>
  );
}
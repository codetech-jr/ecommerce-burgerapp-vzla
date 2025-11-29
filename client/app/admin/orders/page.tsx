"use client";
import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer"; // <--- Importar
import { OrderInvoice } from "@/components/pdf/OrderInvoice"; // <--- Importar tu PDF
import { toast } from 'sonner';
import { Eye, CheckCircle, Clock, Truck, ArrowLeft, RefreshCw, Bell, X, Banknote, BarChart, Check, ChefHat, Bike } from "lucide-react";
import Link from "next/link";

// Definimos tipos básicos
type Order = {
    id: number;
    createdAt: string;
    customerName: string;
    phone: string;
    address: string;
    total: number;
    paymentMethod: string;
    paymentRef?: string; // La referencia clave
    status: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any; // JSON del carrito
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Para el Modal
    
    // Guardamos la cantidad de órdenes para comparar
    const [orderCount, setOrderCount] = useState(0);
    
    // Estado para las notificaciones toast
    const [notification, setNotification] = useState<{ show: boolean; count: number; latestOrder?: any } | null>(null);
    
    // 1. NUEVO ESTADO PARA LA TASA (Ponle un default seguro, ej 45)
    const [tasa, setTasa] = useState(45);

    // Función para reproducir sonido de notificación
    const playSound = () => {
        const audio = new Audio("/notification.mp3"); // Archivo en public/
        audio.play().catch(e => console.log("Navegador bloqueó audio, se requiere interacción previa"));
    };

    // 1. CARGAR ORDENES (POLLING)
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/orders");
            if (res.ok) {
                const newOrders = await res.json();
                setOrders(newOrders);
                
                // AUTOMATIZACIÓN: SI HAY MÁS ÓRDENES QUE ANTES... ¡SUENA Y NOTIFICA!
                if (newOrders.length > orderCount && orderCount !== 0) {
                    const newOrdersCount = newOrders.length - orderCount;
                    const latestOrder = newOrders[0]; // La más reciente está primero (ordenadas por createdAt desc)
                    
                    playSound();
                    
                    // Mostrar notificación toast
                    setNotification({
                        show: true,
                        count: newOrdersCount,
                        latestOrder: latestOrder
                    });
                    
                    // Auto-ocultar después de 5 segundos
                    setTimeout(() => {
                        setNotification(prev => prev ? { ...prev, show: false } : null);
                    }, 5000);
                }
                setOrderCount(newOrders.length);
            }
        } catch (error) {
            console.error("Error", error);
        } finally {
            setLoading(false);
        }
    };

    // Polling cada 5 segundos para mayor velocidad
    // Al cargar la página, buscamos Órdenes Y Tasa
    useEffect(() => {
        fetchOrders();
        
        // Fetch de la Tasa (Si creaste el endpoint /config)
        fetch("http://localhost:3000/config")
            .then(res => res.json())
            .then(data => {
                if(data?.tasa) setTasa(data.tasa);
            })
            .catch(err => console.log("Usando tasa manual:", tasa));
        
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, [orderCount]); // Dependencia importante

    // 2. CAMBIAR ESTATUS
const updateStatus = async (id: number, newStatus: string) => {
        // Nota: El confirm nativo está bien para acciones críticas en Admin, 
        // pero si quieres quitarlo también, simplemente borra esta línea.
        if (!confirm(`¿Seguro de cambiar el estado a ${newStatus.replace('_', ' ')}?`)) return;

        // Iniciamos un Toast de carga (UI Optimista)
        const toastId = toast.loading("Actualizando orden...");

        try {
            const res = await fetch(`http://localhost:3000/orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                const updatedOrder = await res.json();
                
                // 1. Actualizar estado local (Lista)
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === id ? updatedOrder : order
                    )
                );
                
                // 2. Actualizar el Modal si está abierto
                if (selectedOrder && selectedOrder.id === id) {
                    setSelectedOrder(updatedOrder);
                }

                // 3. ¡Éxito visual! (Reemplaza el toast de carga)
                toast.success(`Estado cambiado a: ${newStatus}`, {
                    id: toastId, // Usamos el mismo ID para reemplazar el mensaje anterior
                    icon: '⚡'
                });

            } else {
                const errorData = await res.json().catch(() => ({ message: "Error desconocido" }));
                // Error del servidor
                toast.error("No se pudo actualizar", {
                    id: toastId,
                    description: errorData.message
                });
            }
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            // Error de red
            toast.error("Error de conexión", {
                id: toastId,
                description: "Verifica que el servidor (backend) esté encendido."
            });
        }
    };

    // --- HELPER PARA COLORES DE ESTATUS ---
    const getStatusColor = (status: string) => {
        if (status === "PAGADO" || status === "ENTREGADO") return "bg-blue-100 text-blue-700";
        if (status === "COCINANDO" || status === "PENDIENTE_VERIFICACION") return "bg-orange-100 text-orange-700";
        if (status === "PENDIENTE") return "bg-yellow-100 text-yellow-700";
        if (status === "ENVIADO") return "bg-green-100 text-green-700";
        return "bg-slate-100 text-slate-600";
    }

    // --- RENDERIZADO DE BADGES SEGÚN ESTATUS ---
    const getStatusBadge = (status: string) => {
        const colorClass = getStatusColor(status);
        return (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${colorClass}`}>
                {status.replace('_', ' ')}
            </span>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            
            {/* NOTIFICACIÓN TOAST */}
            {notification && notification.show && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-2xl p-4 min-w-[320px] max-w-md border-2 border-orange-400">
                        <div className="flex items-start gap-3">
                            <div className="bg-white/20 rounded-full p-2">
                                <Bell className="animate-pulse" size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="font-black text-lg mb-1">
                                    ¡Nueva{notification.count > 1 ? `s ${notification.count}` : ''} Orden{notification.count > 1 ? 'es' : ''}! 🎉
                                </div>
                                {notification.latestOrder && (
                                    <div className="text-sm text-orange-50 space-y-1">
                                        <div className="font-bold">Pedido #{notification.latestOrder.id}</div>
                                        <div className="text-xs opacity-90">
                                            {notification.latestOrder.customerName} • ${Number(notification.latestOrder.total).toFixed(2)}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setNotification(null)}
                                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="max-w-6xl mx-auto flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Pedidos en Vivo 🛵</h1>
                    <p className="text-sm text-slate-500">Gestión de cocina y delivery</p>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="text-sm text-slate-500">Auto-actualizando...</div>
                    <button onClick={fetchOrders} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:rotate-180">
                        <RefreshCw size={20} className={loading ? "animate-spin text-blue-500" : "text-slate-600"} />
                    </button>
                    <Link href="/admin/stats" className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 flex items-center gap-2">
                        <BarChart size={16}/> Ver Ganancias
                    </Link>
                    <Link href="/admin" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-orange-600 transition-colors">
                        <ArrowLeft size={16} /> Volver a Productos
                    </Link>
                </div>
            </div>

            {/* TABLA DE ORDENES */}
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                            <tr>
                                <th className="p-4">#ID</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Método / Ref</th>
                                <th className="p-4">Estatus</th>
                                <th className="p-4">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-bold text-slate-700">#{order.id}</td>
                                    <td className="p-4">
                                        <div className="font-bold">{order.customerName}</div>
                                        <div className="text-xs text-slate-400">{order.phone}</div>
                                    </td>
                                    <td className="p-4 font-bold">${Number(order.total).toFixed(2)}</td>
                                    <td className="p-4">
                                        <div className="text-xs font-bold uppercase">{order.paymentMethod.replace('_', ' ')}</div>
                                        {order.paymentRef && (
                                            <div className="text-xs font-mono text-blue-600 bg-blue-50 px-1 rounded inline-block mt-1">
                                                REF: {order.paymentRef}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                                        >
                                            <Eye size={16} /> Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && (
                        <div className="p-8 text-center text-slate-400">
                            Esperando pedidos... 🕒
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL DE DETALLE DE PEDIDO */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">

                        {/* HEADER MODAL */}
                        <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                            <h2 className="font-bold text-lg">Detalle Orden #{selectedOrder.id}</h2>
                                                 
                          <PDFDownloadLink 
                             document={<OrderInvoice order={selectedOrder} />} 
                             fileName={`factura-${selectedOrder.id}.pdf`}
                          >
                             {/* Esto renderiza una función para saber si está cargando */}
                             {({ loading }) => (
                                <button className="text-[10px] bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors">
                                   {loading ? 'Generando...' : '📄 Descargar PDF'}
                                </button>
                             )}
                          </PDFDownloadLink>
                          
                            <button onClick={() => setSelectedOrder(null)}>
                                <X className="hover:text-orange-400" size={20} />
                            </button>
                        </div>

                        {/* BODY MODAL */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">

                            {/* DATOS CLAVE PARA EL PAGO */}
                            <div className="flex gap-4 mb-6">
                                
                                {/* CAJA VERDE MEJORADA */}
                                <div className="flex-1 bg-green-50 border border-green-200 p-3 rounded-xl flex flex-col justify-between relative overflow-hidden">
                                    {/* Decoración de fondo opcional */}
                                    <div className="absolute right-0 top-0 p-1 opacity-10">
                                        <Banknote size={40} className="text-green-700"/>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Total a Cobrar</p>
                                        <p className="text-3xl font-black text-green-800 leading-none mt-1">
                                            ${Number(selectedOrder.total).toFixed(2)}
                                        </p>
                                    </div>
                                    {/* DIVISOR */}
                                    <div className="my-2 border-t border-green-200/60"></div>
                                    {/* MONTOS EN BS */}
                                    <div>
                                        <div className="flex justify-between items-end text-green-900">
                                            <span className="text-[10px] font-bold opacity-70">REF (Tasa {tasa})</span>
                                            <span className="text-sm font-black">
                                                Bs. {(Number(selectedOrder.total) * tasa).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* CAJA DE REFERENCIA (Igual que antes) */}
                                <div className="flex-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Referencia Cliente</p>
                                    <p className="text-2xl font-mono font-black text-blue-600 break-all tracking-tighter">
                                        {selectedOrder.paymentRef || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* DATOS CLIENTE */}
                            <div className="mb-6 space-y-1 text-sm text-slate-600">
                                <p>👤 <span className="font-bold">{selectedOrder.customerName}</span></p>
                                <p>📞 <a href={`tel:${selectedOrder.phone}`} className="underline">{selectedOrder.phone}</a></p>
                                <p>📍 {selectedOrder.address}</p>
                            </div>

                            {/* LISTA DE ITEMS */}
                            <p className="font-bold text-xs uppercase text-slate-400 mb-2 border-b pb-1">Qué pidió:</p>
                            <div className="space-y-2 mb-6">
                                {Array.isArray(selectedOrder.items) ? selectedOrder.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                        <span className="font-bold text-slate-700">{item.quantity}x {item.name}</span>
                                        <span className="text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                )) : "Error cargando items"}
                            </div>
                        </div>

                        {/* FOOTER / ACCIONES SECUENCIALES */}
                        <div className="p-4 bg-slate-50 border-t flex flex-col gap-2">
                            
                            {/* PASO 1: Confirmar Pago (De Pendiente a Pagado) */}
                            {selectedOrder.status === "PENDIENTE_VERIFICACION" && (
                                <button 
                                    onClick={() => updateStatus(selectedOrder.id, "PAGADO")}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 shadow-sm"
                                >
                                    <Banknote size={18}/> Confirmar Pago (Recibido)
                                </button>
                            )}
                            
                            {/* PASO 2: Enviar a Cocina (De Pagado a Cocinando) */}
                            {selectedOrder.status === "PAGADO" && (
                                <button 
                                    onClick={() => updateStatus(selectedOrder.id, "COCINANDO")}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 shadow-sm"
                                >
                                    <ChefHat size={18}/> Empezar a Preparar
                                </button>
                            )}
                            
                            {/* PASO 3: Enviar Motorizado (De Cocinando a Delivery) */}
                            {selectedOrder.status === "COCINANDO" && (
                                <button 
                                    onClick={() => updateStatus(selectedOrder.id, "DELIVERY")}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 shadow-sm"
                                >
                                    <Bike size={18}/> Despachar Orden (Motorizado)
                                </button>
                            )}
                            
                            {/* PASO 4: Finalizar (De Delivery a Entregado) */}
                            {selectedOrder.status === "DELIVERY" && (
                                <button 
                                    onClick={() => updateStatus(selectedOrder.id, "ENTREGADO")}
                                    className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 shadow-sm"
                                >
                                    <Check size={18}/> Confirmar Entrega Final
                                </button>
                            )}
                            
                            {/* Botón Cancelar siempre visible si no está completado */}
                            {selectedOrder.status !== "ENTREGADO" && selectedOrder.status !== "CANCELADO" && (
                                <button 
                                    onClick={() => updateStatus(selectedOrder.id, "CANCELADO")}
                                    className="w-full text-red-500 hover:bg-red-50 py-2 rounded-lg font-bold text-sm transition-colors"
                                >
                                    Cancelar Pedido
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

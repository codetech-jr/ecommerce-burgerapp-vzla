"use client";
import { useState, useEffect } from "react";
import { BarChart, Calendar, DollarSign, CreditCard, Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// 1. IMPORTACIÓN DINÁMICA AFUERA DEL COMPONENTE (Vital)
const DownloadReportBtn = dynamic(
    () => import("@/components/pdf/DownloadReportBtn"), 
    { 
        ssr: false, // Esto apaga el renderizado en servidor y evita el error
        loading: () => <span className="text-xs text-slate-400">Cargando...</span> 
    }
);

export default function StatsPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [filter, setFilter] = useState<"hoy" | "semana">("hoy");

    // Estados calculados
    const [revenue, setRevenue] = useState(0);
    const [methodStats, setMethodStats] = useState<any>({});
    const [topOrder, setTopOrder] = useState<any>(null);

    useEffect(() => {
        fetch("http://localhost:3000/orders").then(res => res.json()).then(data => {
            filterData(data, filter);
        });
    }, [filter]);

    const filterData = (allOrders: any[], mode: "hoy" | "semana") => {
        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));

        let startDate = todayStart;
        if (mode === "semana") {
            const weekAgo = new Date(todayStart);
            weekAgo.setDate(weekAgo.getDate() - 7);
            startDate = weekAgo;
        }

        const filtered = allOrders.filter(o => new Date(o.createdAt) >= startDate);
        // Solo sumamos órdenes que no estén canceladas
        const validOrders = filtered.filter(o => o.status !== "CANCELADO");

        const totalRevenue = validOrders.reduce((acc, o) => acc + Number(o.total), 0);

        const methods: any = {};
        validOrders.forEach(o => {
            const m = o.paymentMethod;
            methods[m] = (methods[m] || 0) + 1;
        });

        const maxOrder = validOrders.reduce((max, o) => Number(o.total) > Number(max.total || 0) ? o : max, {});

        setOrders(validOrders);
        setRevenue(totalRevenue);
        setMethodStats(methods);
        setTopOrder(maxOrder.id ? maxOrder : null);
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">

            {/* HEADER */}
            <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/admin/orders" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest mb-2 transition-colors">
                       <ArrowLeft size={16} /> Volver a Operaciones
                    </Link>
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <BarChart className="text-primary" /> Reportes y Caja
                    </h1>
                    <p className="text-sm text-slate-500">Vista de ingresos reales</p>
                </div>
                <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm w-fit">
                    <button
                        onClick={() => setFilter("hoy")}
                        className={`px-4 py-1 rounded text-sm font-bold transition-colors ${filter === "hoy" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                    >Hoy</button>
                    <button
                        onClick={() => setFilter("semana")}
                        className={`px-4 py-1 rounded text-sm font-bold transition-colors ${filter === "semana" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                    >Semana</button>
                </div>
            </div>

            {/* GRID DE INDICADORES */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               
                {/* 1. VENTAS TOTALES + BOTÓN PDF */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative">
                    
                    {/* AQUÍ VA EL BOTÓN PDF PROTEGIDO */}
                    <div className="absolute top-4 right-4">
                        <DownloadReportBtn orders={orders} revenue={revenue} />
                    </div>

                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Ingresos {filter === 'hoy' ? 'Diarios' : 'Semanales'}</p>
                    <div className="flex items-center gap-2 text-green-600">
                        <DollarSign size={32} />
                        <span className="text-4xl font-black">${revenue.toFixed(2)}</span>
                    </div>
                </div>

                {/* 2. ÓRDENES CONTEO */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Pedidos Cerrados</p>
                    <div className="flex items-center gap-2 text-blue-600">
                        <Calendar size={32} />
                        <span className="text-4xl font-black">{orders.length}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                        Promedio: ${(orders.length ? revenue / orders.length : 0).toFixed(1)} / pedido
                    </div>
                </div>

                {/* 3. ORDEN VIP */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden">
                    <Trophy className="absolute -right-4 -bottom-4 text-orange-200 w-24 h-24 opacity-50" />
                    <p className="text-xs font-bold text-orange-400 uppercase mb-1">🔥 Cliente VIP</p>
                    {topOrder ? (
                        <div>
                            <div className="text-2xl font-black text-orange-800">${Number(topOrder.total).toFixed(2)}</div>
                            <div className="text-sm font-bold text-orange-700 truncate">{topOrder.customerName}</div>
                            <div className="text-xs opacity-60">Ref: {topOrder.paymentRef}</div>
                        </div>
                    ) : (
                        <span className="text-slate-400 text-sm">Sin datos aún</span>
                    )}
                </div>
            </div>

            {/* DETALLE POR MÉTODO DE PAGO */}
            <div className="max-w-5xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <CreditCard size={18} /> Desglose por Pagos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(methodStats).map(method => (
                        <div key={method} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="text-xs font-bold uppercase text-slate-400 mb-1">{method.replace('_', ' ')}</div>
                            <div className="text-2xl font-black text-slate-800">{methodStats[method]} <span className="text-xs font-normal text-slate-400">pagos</span></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center mt-8">
                <Link href="/admin/orders" className="text-slate-500 hover:text-primary font-bold text-sm underline">
                    ← Volver a gestión de pedidos en vivo
                </Link>
            </div>

        </div>
    )
}
"use client"; // Vital
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DailyReport } from "./DailyReport"; // Tu componente PDF que creamos antes

// Recibe los datos necesarios como props
export default function DownloadReportBtn({ orders, revenue }: { orders: any[], revenue: number }) {
  return (
    <PDFDownloadLink 
        document={<DailyReport orders={orders} revenue={revenue}/>}
        fileName={`reporte-${new Date().toISOString().split('T')[0]}.pdf`}
    >
        {/* @ts-ignore */}
        {({ loading }) => (
            <button 
                disabled={loading}
                className="bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded font-bold hover:bg-primary transition-colors flex gap-1 items-center"
            >
                {loading ? "Generando..." : "📄 Guardar PDF"}
            </button>
        )}
    </PDFDownloadLink>
  );
}
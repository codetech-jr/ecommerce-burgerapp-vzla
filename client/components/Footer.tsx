export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto pb-24 pt-16 md:pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-slate-800 pb-10 mb-8">
            <div className="md:col-span-2 space-y-4">
                 <h3 className="font-heading text-2xl font-bold text-white">BurgerApp 🍔</h3>
                 <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                     Somos expertos en matar antojos. Las mejores hamburguesas de Charallave con ingredientes frescos y delivery ultra rápido.
                 </p>
            </div>
            
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                    <li><a href="#" className="hover:text-primary transition">Términos y condiciones</a></li>
                    <li><a href="#" className="hover:text-primary transition">Política de privacidad</a></li>
                </ul>
            </div>

            <div className="space-y-4">
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contacto</h4>
                 <p className="text-sm text-slate-300">+58 412 000 0000</p>
                 <div className="flex gap-3 text-xl">
                    {/* Iconos sociales placeholder */}
                    <div className="size-8 bg-slate-800 rounded flex items-center justify-center">📷</div>
                    <div className="size-8 bg-slate-800 rounded flex items-center justify-center">🐦</div>
                 </div>
            </div>
        </div>
        <div className="text-center text-slate-600 text-xs">
            © 2025 BurgerApp. Todos los derechos reservados.
        </div>
    </footer>
  )
}
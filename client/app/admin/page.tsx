/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API_URL } from "@/lib/config";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, Image as ImageIcon, Save, Loader2, DollarSign, Clock, Utensils, LogOut } from "lucide-react"; // Agregué Clock, Utensils y LogOut
import Image from "next/image";

// --- TUS CONFIGURACIONES ---
const CLOUD_NAME = "diycgopwe"; 
const UPLOAD_PRESET = "burger_app_upload";

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. ACTUALIZAMOS EL ESTADO INICIAL
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Hamburguesas",
    image: "",
    prepTime: "",   // <--- NUEVO CAMPO
    ingredients: "" // <--- NUEVO CAMPO
  });

  useEffect(() => { fetchProducts(); }, []);

  const router = useRouter(); // Importa el hook router

  const handleLogout = () => {
      Cookies.remove("burger_admin_token"); // Rompemos el "sello"
      router.push("/admin/login"); // Lo sacamos
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      setProducts(await res.json());
    } catch (error) { console.error(error); }
  };

  const handleImageUpload = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const widget = (window as any).cloudinary.createUploadWidget(
      { cloudName: CLOUD_NAME, uploadPreset: UPLOAD_PRESET, sources: ["local", "camera"], folder: "burgerapp" },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setForm((prev) => ({ ...prev, image: result.info.secure_url }));
        }
      }
    );
    widget.open();
  };

  // Helper para el Slug
  const createSlug = (text: string) => text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación rápida de imagen antes de enviar
    if (!form.image) {
        toast.error("Falta la foto", { description: "Sube una imagen para el producto primero." });
        return;
    }

    setLoading(true);
    // Toast de promesa (Elegante: carga -> éxito/error automático)
    const promise = fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            // ... todos tus datos (slug, price, prepTime, etc) ...
            // (Mantén el payload como lo tenías que ya funcionaba)
            name: form.name,
            slug: `${createSlug(form.name)}-${Date.now()}`,
            price: parseFloat(Number(form.price).toString().replace(',', '.')),
            image: form.image,
            description: form.description,
            category: form.category,
            prepTime: form.prepTime || "15 min",
            ingredients: form.ingredients || "Ver detalle",
        }),
    }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error guardando");
        return data;
    });

    toast.promise(promise, {
        loading: 'Guardando plato...',
        success: (data) => {
            // Limpiamos el form si fue exitoso
            setForm({ name: "", description: "", price: "", category: "Hamburguesas", image: "", prepTime: "", ingredients: "" });
            fetchProducts();
            return `¡${data.name} creado correctamente! 🍔`;
        },
        error: (err) => `Error: ${err.message}`,
    });

    // Ya no necesitamos el try/catch grande ni setLoading(false) manual
    // porque toast.promise lo maneja, pero para resetear el botón de carga visual:
    promise.finally(() => setLoading(false));
  };

  // ... handleDelete igual que antes ...
  const handleDelete = async (id: number) => {
    if(!confirm("¿Borrar?")) return;
    await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      {/* HEADER: título y logout */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-800">Dashboard Productos 🍔</h1>
          <p className="text-xs text-slate-500">Administra tu menú</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* --- BOTÓN NUEVO --- */}
          <Link 
            href="/admin/orders" 
            className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-200 transition-colors animate-pulse"
          >
            <div className="relative">
              🔔
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div> 
            Ver Pedidos
          </Link>
          
          {/* Tu botón de salir existente */}
          <button 
            onClick={handleLogout}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 text-sm font-bold"
          >
            <LogOut size={18} /> Salir
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Plus className="bg-primary text-white rounded-full p-1" /> Nuevo Plato
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* IMAGEN UPLOADER */}
            <div 
              onClick={handleImageUpload}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${form.image ? "border-green-400 bg-green-50" : "border-slate-300 hover:bg-slate-50"}`}
            >
                {form.image ? (
                   <div className="relative w-full h-32">
                      <Image src={form.image} alt="Preview" fill className="object-contain" />
                   </div>
                ) : (
                    <div className="text-center text-slate-400">
                       <ImageIcon className="mx-auto mb-2"/>
                       <span className="text-xs font-bold">Subir Foto</span>
                    </div>
                )}
            </div>

            {/* INPUTS PRINCIPALES */}
            <div className="space-y-3">
                <input 
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="Nombre del Plato" 
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg font-bold outline-none focus:border-primary"
                />
                
                <div className="flex gap-3">
                    <div className="relative w-1/2">
                        <DollarSign size={14} className="absolute top-4 left-3 text-slate-400"/>
                        <input 
                          type="number" required placeholder="Precio"
                          value={form.price}
                          onChange={(e) => setForm({...form, price: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-3 pl-8 rounded-lg font-bold outline-none focus:border-primary"
                        />
                    </div>
                    <select 
                       value={form.category}
                       onChange={(e) => setForm({...form, category: e.target.value})}
                       className="w-1/2 bg-slate-50 border border-slate-200 p-3 rounded-lg font-bold text-slate-700 outline-none"
                    >
                        <option>Hamburguesas</option>
                        <option>Tequeños</option>
                        <option>Bebidas</option>
                        <option>Promos</option>
                        <option>Pizzas</option>
                    </select>
                </div>

                {/* 3. NUEVOS CAMPOS: TIEMPO E INGREDIENTES */}
                <div className="flex gap-3">
                    <div className="relative w-1/2">
                        <Clock size={14} className="absolute top-4 left-3 text-slate-400"/>
                        <input 
                          placeholder="Tiempo (Ej: 15m)"
                          value={form.prepTime}
                          onChange={(e) => setForm({...form, prepTime: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-3 pl-8 rounded-lg text-sm outline-none focus:border-primary"
                        />
                    </div>
                     <div className="relative w-1/2">
                        <Utensils size={14} className="absolute top-4 left-3 text-slate-400"/>
                        <input 
                          placeholder="Ingredientes clave..."
                          value={form.ingredients}
                          onChange={(e) => setForm({...form, ingredients: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-3 pl-8 rounded-lg text-sm outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <textarea 
                  required
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Descripción completa para la venta..." 
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm resize-none outline-none focus:border-primary"
                />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-primary transition-colors flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin"/> : <Save size={18} />} Guardar Producto
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA (Igual que antes) */}
        <div className="space-y-4">
           {/* ... Aquí va tu lista de productos igual que la tenías ... */}
           {/* Te la dejo resumida para que no ocupes tanto espacio */}
            {products.map((p: any) => (
                <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-4 border border-slate-100">
                   <img src={p.image || ""} className="w-12 h-12 rounded bg-slate-100 object-cover"/>
                   <div className="flex-1">
                       <div className="font-bold text-sm">{p.name}</div>
                       <div className="text-xs text-slate-500">${p.price} • {p.prepTime}</div>
                   </div>
                   <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Librería para manejar el "sello"
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🚨 ENTORNO REAL: Esto debería validarse contra una variable de entorno (.env)
    // 🚨 POR AHORA: Usaremos una "Clave Maestra" simple.
    const CLAVE_SECRETA = "Hamburguesa2025"; 

    if (password === CLAVE_SECRETA) {
      // 1. Guardar la cookie (El sello en la mano)
      // "auth_token" es el nombre, "admin_access" es el valor. Expira en 1 día.
      Cookies.set("burger_admin_token", "admin_access_granted", { expires: 1 });
      
      // 2. Redirigir al panel
      router.push("/admin");
    } else {
      setError("Contraseña incorrecta. Intenta de nuevo.");
      // Efecto visual de error
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={32} />
            </div>
            <h1 className="text-2xl font-heading font-black text-slate-900">Acceso Administrativo</h1>
            <p className="text-slate-400 text-sm">Solo personal autorizado 👮‍♂️</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <input 
                  type="password" 
                  placeholder="Contraseña Maestra"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-lg focus:border-primary outline-none transition-all"
                  autoFocus
                />
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 text-center text-sm font-bold p-2 rounded-lg animate-pulse">
                    {error}
                </div>
            )}

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-primary transition-all flex justify-center items-center gap-2"
            >
               Entrar al Panel <ArrowRight size={20}/>
            </button>
        </form>
        
        <div className="mt-8 text-center">
            <Link href="/" className="text-slate-400 text-xs hover:text-primary underline">Volver a la tienda</Link>
        </div>

      </div>
    </div>
  );
}
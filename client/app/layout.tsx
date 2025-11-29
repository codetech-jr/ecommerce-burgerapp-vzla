import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Toaster } from 'sonner';
import Script from "next/script"; // <--- 1. IMPORTAR ESTO
import "./globals.css";

const fontHeading = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-heading",
  weight: ["600", "700", "800"], 
});

const fontBody = Inter({ 
  subsets: ["latin"], 
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "BurgerApp Vzla 🍔",
  description: "El mejor sabor de Charallave a tu casa",
  manifest: "/manifest.json", // <--- ESTA LÍNEA ES LA CLAVE
};

// Configuración para que se vea como App nativa (Color de barra de estado)
export const viewport: Viewport = {
  themeColor: "#f97316", // Naranja
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Evita que hagan zoom pellizcando (sentimiento app nativa)
  userScalable: false, 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fontHeading.variable} ${fontBody.variable} scroll-smooth`}>
      <body className="font-body bg-slate-50 text-slate-900 antialiased selection:bg-orange-100 selection:text-orange-600">
        
        {children}

        {/* 2. AGREGAR EL SCRIPT AQUÍ AL FINAL DEL BODY */}
        <Script 
          src="https://upload-widget.cloudinary.com/global/all.js" 
          strategy="lazyOnload" // Esto hace que se cargue DESPUÉS de tu web, para no ponerla lenta
        />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
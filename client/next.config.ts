import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";


const pwaConfig = withPWA({
  dest: "public", // Dónde se guardará el worker
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false, // Pon 'true' si te molesta el caché mientras programas en local
  workboxOptions: {
    disableDevLogs: true,
  },
}); 

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co", // Permite las imágenes placeholder
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // (Opcional) Por si usas fotos de Unsplash después
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // 1. Permite Cloudinary
      },
      // Aquí agregarás más dominios en el futuro (ej: cloudinary, amazon s3, etc)
    ],
  },

  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

// Envolvemos la config con el PWA
export default pwaConfig(nextConfig);

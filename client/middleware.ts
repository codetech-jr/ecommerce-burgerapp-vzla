import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Obtener la ruta a la que quiere ir el usuario
  const path = request.nextUrl.pathname;

  // 2. Definir rutas protegidas (Cualquier cosa que empiece por /admin)
  // Excepción: /admin/login NO debe estar protegida (si no, hacemos un bucle infinito)
  const isProtectedPath =
    path.startsWith("/admin") && !path.startsWith("/admin/login");

  // 3. Verificar si tiene la cookie
  const cookie = request.cookies.get("burger_admin_token");

  // 4. LÓGICA DE SEGURIDAD
  if (isProtectedPath) {
    if (!cookie) {
      // Si quiere ir a /admin y NO tiene cookie -> Lo mandamos al login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Si intenta ir al login PERO YA TIENE COOKIE -> Lo mandamos directo al dashboard
  if (path === "/admin/login" && cookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

// Configuración: En qué rutas se ejecuta este código
export const config = {
  matcher: ["/admin/:path*"], // Aplica a todo lo que esté bajo /admin
};

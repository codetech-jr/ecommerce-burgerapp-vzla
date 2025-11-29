// Si existe una variable de entorno, la usa. Si no, usa localhost.
// src/lib/config.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
import { notFound } from "next/navigation";

// Catch-all: cualquier ruta no definida bajo /[locale] muestra la 404 con diseño propio
export default function CatchAllPage() {
  notFound();
}

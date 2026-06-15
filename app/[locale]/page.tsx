import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/hero";

export const metadata: Metadata = {
  title: "Grupo Rubio — Limpieza Profesional y Control de Plagas en Navarra",
  description: "Más de 55 años de experiencia en servicios integrales de limpieza, control de plagas DDD e higiene industrial. Presupuesto sin compromiso en 24h. Tudela, Navarra.",
  keywords: "limpieza profesional Navarra, control de plagas Tudela, DDD Navarra, empresa limpieza industrial, desratización desinsectación",
  openGraph: {
    title: "Grupo Rubio — Servicios Higiénicos Integrales",
    description: "Limpieza profesional, control de plagas DDD e higiene industrial en Navarra, Aragón y La Rioja. Empresa familiar desde 1970.",
    url: "https://gruporubio.es",
    siteName: "Grupo Rubio",
    locale: "es_ES",
    type: "website",
  },
};
import { PhotoGrid } from "@/components/sections/photo-grid";
import { TrustLogos } from "@/components/sections/trust-logos";
import { StatsBand } from "@/components/sections/stats-band";
import { TopServices } from "@/components/sections/top-services";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { CTABanner } from "@/components/sections/cta-banner";
import { ReviewsCarousel } from "@/components/sections/reviews-carousel";
import { MapaClientes } from "@/components/sections/mapa-clientes";
import { FAQ } from "@/components/sections/faq";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <div className="w-full" style={{ background: '#FFFFFF', minHeight: '100vh', position: 'relative' }}>

      {/* Navbar — fixed, positioned over the hero card (top/left/right: 16px matches card margin) */}
      <Navbar />

      {/* Section A-1: Hero card — en móvil ocupa todo el ancho (sin padding lateral ni superior) */}
      <div
        className="hero-card"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <style>{`
          .hero-card { margin: 16px; border-radius: 16px; }
          @media (max-width: 640px) {
            .hero-card { margin: 0; border-radius: 0; }
            .hero-card section,
            .hero-card section > div:first-child { border-radius: 0 !important; }
            /* el navbar fijo (16+68px) queda encima: bajar el contenido */
            .hero-card section { padding-top: 112px !important; }
          }
        `}</style>
<Hero />
      </div>

      <StatsBand />

      {/* Section A-2: Photo grid */}
      <div style={{ margin: 16 }}>
        <PhotoGrid />
      </div>

      {/* Remaining sections — untouched */}
      <TrustLogos />
      <TopServices />
      <CTABanner />
      <FeaturedProducts />
      <ReviewsCarousel />
      <MapaClientes />
      <FAQ />
      <Footer />

    </div>
  );
}

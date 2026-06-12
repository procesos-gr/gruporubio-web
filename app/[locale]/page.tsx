import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/hero";
import { PhotoGrid } from "@/components/sections/photo-grid";
import { TrustLogos } from "@/components/sections/trust-logos";
import { StatsBand } from "@/components/sections/stats-band";
import { TopServices } from "@/components/sections/top-services";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { CTABanner } from "@/components/sections/cta-banner";
import { ReviewsCarousel } from "@/components/sections/reviews-carousel";
import { FAQ } from "@/components/sections/faq";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <div className="w-full" style={{ background: '#FFFFFF', minHeight: '100vh', position: 'relative' }}>

      {/* Navbar — fixed, positioned over the hero card (top/left/right: 16px matches card margin) */}
      <Navbar />

      {/* Backdrop azul — cubre el tercio superior del hero; asoma por el padding (arriba + laterales) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 166,
          background: '#0F1623',
          zIndex: 0,
        }}
      />

      {/* Section A-1: Hero card */}
      <div
        style={{
          margin: 16,
          borderRadius: 16,
          position: 'relative',
          zIndex: 1,
        }}
      >
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
      <FAQ />
      <Footer />

    </div>
  );
}

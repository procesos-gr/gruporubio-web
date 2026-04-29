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
    <div className="w-full" style={{ background: '#FFFFFF', minHeight: '100vh' }}>

      {/* Navbar — fixed, positioned over the hero card (top/left/right: 16px matches card margin) */}
      <Navbar />

      {/* Section A-1: Hero card */}
      <div
        style={{
          margin: 16,
          borderRadius: 16,
          position: 'relative',
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

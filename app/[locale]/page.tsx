import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/hero";
import { PhotoGrid } from "@/components/sections/photo-grid";
import { TrustLogos } from "@/components/sections/trust-logos";
import { BusinessLines } from "@/components/sections/business-lines";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { AudienceGrid } from "@/components/sections/audience-grid";
import { ReviewsCarousel } from "@/components/sections/reviews-carousel";
import { FAQ } from "@/components/sections/faq";

export default function HomePage() {
  return (
    <div className="w-full" style={{ background: '#FFFFFF', minHeight: '100vh' }}>

      {/* Section A-1: Hero card — grey card floating on white */}
      <div
        style={{
          margin: 16,
          background: '#F0F2F5',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <Navbar />
        <Hero />
      </div>

      {/* Section A-2: Photo grid — transparent, #FFFFFF shows through gaps + margin */}
      <div style={{ margin: 16 }}>
        <PhotoGrid />
      </div>

      {/* Remaining sections — untouched */}
      <TrustLogos />
      <BusinessLines />
      <ProductShowcase />
      <AudienceGrid />
      <ReviewsCarousel />
      <FAQ />

    </div>
  );
}

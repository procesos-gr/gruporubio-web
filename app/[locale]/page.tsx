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
    <div className="w-full" style={{ background: '#F8F9FA', minHeight: '100vh' }}>

      {/* Section A-1: Hero card — white card floating on #F8F9FA */}
      <div
        style={{
          margin: 16,
          background: '#ffffff',
          borderRadius: 24,
          overflow: 'hidden',
        }}
      >
        <Navbar />
        <Hero />
      </div>

      {/* Section A-2: Photo grid — transparent, #F8F9FA shows through gaps + margin */}
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

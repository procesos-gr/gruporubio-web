import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";
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

      {/* Navbar — fixed, positioned over the hero card (top/left/right: 16px matches card margin) */}
      <Navbar />

      {/* Section A-1: Hero card */}
      <div
        style={{
          margin: 16,
          background: '#F0F2F5',
          borderRadius: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Limpiadora — left edge, grounded at the bottom */}
        <Image
          src="/images/limpiadora.png"
          alt=""
          width={220}
          height={340}
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 380,
            width: 'auto',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          priority
        />

        {/* Fulmigador — right edge, higher up */}
        <Image
          src="/images/fulmigador.png"
          alt=""
          width={220}
          height={340}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 40,
            height: 360,
            width: 'auto',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          priority
        />

        <Hero />
      </div>

      {/* Section A-2: Photo grid */}
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

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
    <div className="flex flex-col w-full">
      <Hero />
      <PhotoGrid />
      <TrustLogos />
      <BusinessLines />
      <ProductShowcase />
      <AudienceGrid />
      <ReviewsCarousel />
      <FAQ />
    </div>
  );
}

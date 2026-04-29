import { notFound } from "next/navigation";
import Link from "next/link";
import { SERVICES, getServiceBySlug, getRelatedServices, ServiceData } from "@/lib/services-data";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { ServiceQuoteForm } from "@/components/sections/services/service-quote-form";
import { MaquinariaAlquilerStrip } from "@/components/alquiler/MaquinariaAlquilerStrip";
import Image from "next/image";
import { Phone, CheckCircle2, ArrowRight, ImageIcon } from "lucide-react";

const SLUGS_CON_ALQUILER = new Set([
  'alquiler-de-maquinaria',
  'servicio-tecnico-oficial-karcher',
  'reparaciones-y-mantenimientos',
]);

export async function generateStaticParams() {
  const locales = ["es", "en", "fr"];
  return locales.flatMap((locale) =>
    SERVICES.map((s) => ({ locale, slug: s.slug }))
  );
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

function ImgSlot({ ratio = "4/3" }: { ratio?: string }) {
  return (
    <div style={{
      width: "100%", aspectRatio: ratio,
      background: "#F3F4F6", border: "1.5px dashed #D1D5DB",
      borderRadius: 8, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 8,
    }}>
      <ImageIcon size={22} style={{ color: "#CBD5E1" }} />
    </div>
  );
}

function ServiceImg({ src, alt, ratio }: { src?: string; alt: string; ratio: string }) {
  if (!src) return <ImgSlot ratio={ratio} />;
  return (
    <div style={{ width: "100%", aspectRatio: ratio, borderRadius: 8, overflow: "hidden", position: "relative", flexShrink: 0 }}>
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}

function IncludesList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 13 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <CheckCircle2 size={17} style={{ color: "#374151", flexShrink: 0, marginTop: 3 }} />
          <span style={{ fontSize: 15, color: "#374151", lineHeight: 1.65 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Layout A (índices 0, 3, 6…) ─────────────────────────────────────────────
// Qué incluye: [lista | img portrait]   Cómo funciona: [img cuadrado | texto]
function LayoutA({ service }: { service: ServiceData }) {
  return (
    <>
      <div style={{ marginBottom: 52 }}>
        <SectionTag text="Qué incluye" />
        <h2 style={h2}>Alcance del servicio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-6 items-start">
          <IncludesList items={service.includes} />
          <ServiceImg src={service.image} alt={service.title} ratio="3/4" />
        </div>
      </div>

      <div style={{ marginBottom: 52 }}>
        <SectionTag text="Cómo funciona" />
        <h2 style={h2}>El proceso paso a paso</h2>
        <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-6 items-start">
          <ServiceImg src={service.image2 ?? service.image} alt={service.title} ratio="1/1" />
          <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8, margin: 0 }}>{service.howItWorks}</p>
        </div>
      </div>
    </>
  );
}

// ── Layout B (índices 1, 4, 7…) ─────────────────────────────────────────────
// Qué incluye: [img portrait | lista]   Cómo funciona: [texto | img cuadrado]
function LayoutB({ service }: { service: ServiceData }) {
  return (
    <>
      <div style={{ marginBottom: 52 }}>
        <SectionTag text="Qué incluye" />
        <h2 style={h2}>Alcance del servicio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6 items-start">
          <ServiceImg src={service.image} alt={service.title} ratio="4/5" />
          <IncludesList items={service.includes} />
        </div>
      </div>

      <div style={{ marginBottom: 52 }}>
        <SectionTag text="Cómo funciona" />
        <h2 style={h2}>El proceso paso a paso</h2>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_260px] gap-6 items-start">
          <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8, margin: 0 }}>{service.howItWorks}</p>
          <ServiceImg src={service.image2 ?? service.image} alt={service.title} ratio="1/1" />
        </div>
      </div>
    </>
  );
}

// ── Layout C (índices 2, 5, 8…) ─────────────────────────────────────────────
// Qué incluye: img panorámica arriba + lista en 2 col abajo
// Cómo funciona: texto a la izq + img 4:3 a la dcha (más ancha)
function LayoutC({ service }: { service: ServiceData }) {
  return (
    <>
      <div style={{ marginBottom: 52 }}>
        <SectionTag text="Qué incluye" />
        <h2 style={h2}>Alcance del servicio</h2>
        <div style={{ marginBottom: 20 }}>
          <ServiceImg src={service.image} alt={service.title} ratio="16/7" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {service.includes.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <CheckCircle2 size={16} style={{ color: "#374151", flexShrink: 0, marginTop: 3 }} />
              <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 52 }}>
        <SectionTag text="Cómo funciona" />
        <h2 style={h2}>El proceso paso a paso</h2>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_300px] gap-6 items-start">
          <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8, margin: 0 }}>{service.howItWorks}</p>
          <ServiceImg src={service.image2 ?? service.image} alt={service.title} ratio="4/3" />
        </div>
      </div>
    </>
  );
}

export default async function ServicePage({ params }: PageProps) {
  const { slug, locale } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const serviceIndex = SERVICES.findIndex(s => s.slug === slug);
  const layout = serviceIndex % 3;
  const related = getRelatedServices(service.relatedSlugs);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ background: "#111827", padding: "120px 32px 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
            <Link href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Inicio</Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>/</span>
            <Link href="/servicios" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Servicios</Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{service.title}</span>
          </nav>

          <span style={{
            display: "inline-flex", alignItems: "center",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 6, padding: "4px 12px", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
            marginBottom: 16,
          }}>
            {service.categoryLabel}
          </span>

          <h1 style={{
            fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, color: "#F9FAFB",
            letterSpacing: "-2px", lineHeight: 1.06, margin: "0 0 16px", maxWidth: 680,
          }}>
            {service.title}
          </h1>
          <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 520, lineHeight: 1.65, margin: 0 }}>
            {service.shortDesc}
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <section style={{ background: "#FFFFFF", padding: "72px 32px" }}>
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">

          {/* Left — layout variable */}
          <div>
            {layout === 0 && <LayoutA service={service} />}
            {layout === 1 && <LayoutB service={service} />}
            {layout === 2 && <LayoutC service={service} />}

            {/* Por qué Grupo Rubio — igual en todos */}
            <div style={{ background: "#F9FAFB", borderRadius: 8, padding: 28, border: "1px solid #E5E7EB" }}>
              <SectionTag text="Por qué elegirnos" />
              <h2 style={{ ...h2, marginBottom: 14 }}>Por qué Grupo Rubio</h2>
              <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8, margin: 0 }}>{service.whyUs}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 96 }}>
            <div style={{ background: "#111827", borderRadius: 8, padding: 24, marginBottom: 16 }}>
              <p style={sideTag}>Para quién es</p>
              <p style={{ fontSize: 14, color: "#D1D5DB", lineHeight: 1.7, margin: 0 }}>{service.forWho}</p>
            </div>

            <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: 24, marginBottom: 16 }}>
              <p style={sideTag}>Dato clave</p>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>{service.extraFact}</p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: 24 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 6 }}>¿Necesitas este servicio?</p>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16, lineHeight: 1.6 }}>
                Presupuesto personalizado sin compromiso en menos de 24h.
              </p>
              <a href="#solicitar" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "#111827", color: "#FFFFFF", fontSize: 14, fontWeight: 700,
                padding: "12px 20px", borderRadius: 8, textDecoration: "none",
              }}>
                Contactar ahora <ArrowRight size={15} />
              </a>
              <a href="tel:+34948825025" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                color: "#6B7280", fontSize: 13, fontWeight: 500, marginTop: 12,
                textDecoration: "none",
              }}>
                <Phone size={13} /> 948 82 50 25
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Alquiler strip ── */}
      {SLUGS_CON_ALQUILER.has(slug) && <MaquinariaAlquilerStrip locale={locale} />}

      {/* ── Quote form ── */}
      <section id="solicitar" style={{ background: "#FFFFFF", padding: "72px 32px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <SectionTag text="Presupuesto sin compromiso" />
            <h2 style={{ fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 800, color: "#111827", letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 12 }}>
              Solicitar <span style={{ color: "#374151" }}>{service.title}</span>
            </h2>
            <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.65, margin: 0 }}>
              Rellena el formulario y te contactamos en menos de 24 horas con un presupuesto adaptado a tu situación.
            </p>
          </div>
          <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: 32 }}>
            <ServiceQuoteForm serviceTitle={service.title} />
          </div>
        </div>
      </section>

      {/* ── Related services ── */}
      {related.length > 0 && (
        <section style={{ background: "#F9FAFB", padding: "64px 32px", borderTop: "1px solid #F3F4F6" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <SectionTag text="También puede interesarte" />
            <h2 style={{ ...h2, marginBottom: 28 }}>Servicios relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/servicios/${rel.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: 22 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", margin: "0 0 8px" }}>
                      {rel.categoryLabel}
                    </p>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 8px", lineHeight: 1.3 }}>
                      {rel.title}
                    </h3>
                    <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, margin: "0 0 14px" }}>
                      {rel.shortDesc.length > 85 ? rel.shortDesc.slice(0, 85) + "…" : rel.shortDesc}
                    </p>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 4 }}>
                      Ver servicio <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

const h2: React.CSSProperties = {
  fontSize: "clamp(20px, 2.2vw, 28px)", fontWeight: 800, color: "#111827",
  letterSpacing: "-0.6px", marginBottom: 22, lineHeight: 1.2,
};

const sideTag: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
  textTransform: "uppercase", color: "#6B7280", marginBottom: 10,
};

function SectionTag({ text }: { text: string }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 8 }}>
      {text}
    </p>
  );
}

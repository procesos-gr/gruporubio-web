'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { ArrowRight, Phone, Image as ImageIcon } from "lucide-react";

/* ── Placeholder imagen reutilizable ── */
function ImgPlaceholder({ height = 320, label = "Imagen" }: { height?: number; label?: string }) {
  return (
    <div style={{
      height,
      borderRadius: 8,
      background: "#F3F4F6",
      border: "1.5px dashed #D1D5DB",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      color: "#9CA3AF",
    }}>
      <ImageIcon size={24} strokeWidth={1.5} />
      <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

const STATS = [
  { value: "+55",     label: "Años de historia",    sub: "Desde los años 70 en Tudela" },
  { value: "12.500+", label: "Trabajos realizados", sub: "Proyectos documentados" },
  { value: "+1.500",  label: "Clientes activos",    sub: "Empresas e instituciones" },
  { value: "+170",    label: "Municipios cubiertos", sub: "Cobertura nacional activa" },
];

const MILESTONES = [
  { year: "1970s", text: "Origen como «Limpiezas Rubio» en Tudela, Navarra. Primera generación familiar." },
  { year: "2003",  text: "Constitución formal de Grupo Rubio Servicios Higiénicos Integrales S.L. Inicio de la expansión regional." },
  { year: "2012",  text: "Intervención masiva contra termitas en el Casco Histórico de Tudela. Primeros en Navarra en usar Hexaflumurón a escala comarcal." },
  { year: "2020",  text: "Desinfección gratuita de flotas de emergencia durante la pandemia COVID-19. Más de 200 vehículos tratados." },
  { year: "2024",  text: "Traslado a las nuevas instalaciones en el Polígono de Ultrapuertos, Tudela. Capacidad operativa ampliada." },
  { year: "2025",  text: "Presentación de la patente XANAEL en Ayuntalia. Sistema inteligente de control de plagas para Smart Cities." },
];

const TEAM = [
  { name: "Carlos Rubio Carrera",       role: "Dirección General" },
  { name: "Iñaki Rubio Carrera",        role: "Responsable de Control de Plagas" },
  { name: "José Javier Rubio Carrera",  role: "Responsable de Limpieza" },
];

const DIVISIONS = [
  {
    id: "limpieza",
    title: "Limpieza Técnica",
    tag: "01",
    desc: "Desde limpieza de oficinas y comunidades hasta limpiezas industriales, en altura, post-siniestro y tratamiento de suelos. Maquinaria propia de última generación.",
    href: "/servicios#limpieza",
  },
  {
    id: "plagas",
    title: "Control de Plagas DDD",
    tag: "02",
    desc: "Desratización, desinsectación y desinfección certificada. Especialistas en termitas, legionela, aves y procesionaria. Homologados por el Gobierno de Navarra.",
    href: "/servicios#plagas",
  },
  {
    id: "xanael",
    title: "Innovación — XANAEL",
    tag: "03",
    desc: "Patente propia de hardware urbano inteligente para el control automatizado de plagas en Smart Cities. Presentado en Ayuntalia 2025. Primer sistema de este tipo en Europa.",
    href: "/servicios",
  },
  {
    id: "appcc",
    title: "Seguridad Alimentaria",
    tag: "04",
    desc: "Implantación y verificación de sistemas APPCC, auditorías sanitarias y formación de manipuladores para la industria agroalimentaria del Valle del Ebro.",
    href: "/servicios#alimentaria",
  },
  {
    id: "karcher",
    title: "Distribución y Kärcher",
    tag: "05",
    desc: "Venta de química profesional, celulosa, EPIs y maquinaria. Servicio Técnico Oficial Kärcher para toda la región. Alquiler de equipos industriales.",
    href: "/servicios#maquinaria",
  },
  {
    id: "formacion",
    title: "Centro de Formación",
    tag: "06",
    desc: "Formación reglada para manipuladores de alimentos, certificados de profesionalidad y cursos técnicos. Acreditados por el Consorcio Eder.",
    href: "/servicios#formacion",
  },
];

const RSC = [
  {
    title: "COVID-19 · 2020",
    text: "Desinfección gratuita de ambulancias, vehículos de bomberos y patrullas policiales durante el estado de alarma.",
    imgSrc: "/images/nosotros/rsc-covid.webp",
  },
  {
    title: "SDR Arenas · Baloncesto base",
    text: "Patrocinador principal del club desde categorías Mini hasta Senior bajo el nombre Grupo Rubio GIMA Arenas.",
    imgSrc: "/images/nosotros/rsc-arenas.webp",
  },
  {
    title: "Formación y empleo comarcal",
    text: "Cientos de personas formadas cada año en la Ribera de Navarra. Centro acreditado por el Consorcio Eder.",
    imgSrc: null,
  },
  {
    title: "Contrato FCC · 24,5 M€",
    text: "Cogestión de limpieza viaria y recogida de residuos en 17 municipios navarros durante 10 años.",
    imgSrc: null,
  },
];

export default function NosotrosPage() {
  const [activeDiv, setActiveDiv] = useState("limpieza");
  const current = DIVISIONS.find((d) => d.id === activeDiv)!;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* ── Header oscuro ── */}
      <div style={{ background: "#111827", padding: "100px 32px 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <Link href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Inicio</Link>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>Nosotros</span>
          </nav>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B7280", marginBottom: 16 }}>
            Grupo Rubio · Desde 1970
          </p>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800, color: "#F9FAFB", letterSpacing: "-2px", lineHeight: 1.06, maxWidth: 640, marginBottom: 20 }}>
            Más de 50 años cuidando lo que otros no ven.
          </h1>
          <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 520, lineHeight: 1.65 }}>
            De empresa familiar tudelana a referente regional en facility management, innovación tecnológica y sanidad ambiental.
          </p>
        </div>
      </div>

      {/* ── Cifras clave ── */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {STATS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "40px 28px",
                  borderRight: i < STATS.length - 1 ? "1px solid #F3F4F6" : "none",
                }}
              >
                <p style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800, color: "#111827", letterSpacing: "-2px", margin: "0 0 6px", lineHeight: 1 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>
                  {s.label}
                </p>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Historia + Timeline ── */}
      <section style={{ padding: "72px 32px", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Columna izquierda: texto + placeholder imagen */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 12 }}>
                Nuestra historia
              </p>
              <h2 style={{ fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 800, color: "#111827", letterSpacing: "-1px", marginBottom: 16, lineHeight: 1.2 }}>
                Raíces locales,<br />alcance regional.
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 28 }}>
                Lo que nació como «Limpiezas Rubio» en Tudela se ha convertido en un conglomerado de servicios que opera en Navarra, Aragón, La Rioja y más allá. La transición generacional liderada por Carlos, Iñaki y José Javier Rubio Carrera ha impulsado la digitalización, la innovación tecnológica y la expansión a nuevos sectores.
              </p>
              <div style={{ position: "relative", height: 260, borderRadius: 8, overflow: "hidden" }}>
                <Image
                  src="/images/nosotros/instalaciones-grupo-rubio.webp"
                  alt="Instalaciones de Grupo Rubio en el Polígono de Ultrapuertos, Tudela"
                  fill
                  sizes="(max-width: 1024px) 90vw, 510px"
                  className="object-cover object-center"
                  quality={88}
                />
              </div>
            </div>

            {/* Columna derecha: timeline */}
            <div style={{ paddingTop: 8 }}>
              {MILESTONES.map((m, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 20, paddingBottom: i < MILESTONES.length - 1 ? 24 : 0 }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 44 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#111827", flexShrink: 0, marginTop: 5 }} />
                    {i < MILESTONES.length - 1 && (
                      <div style={{ flex: 1, width: 1, background: "#E5E7EB", marginTop: 6 }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {m.year}
                    </span>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, margin: "4px 0 0" }}>
                      {m.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Equipo directivo ── */}
      <section style={{ padding: "72px 32px", borderBottom: "1px solid #F3F4F6", background: "#F9FAFB" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 12 }}>
            Equipo directivo
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-20 items-start" style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 800, color: "#111827", letterSpacing: "-1px", lineHeight: 1.2, margin: 0 }}>
              La familia que lidera la transformación.
            </h2>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: 0, paddingTop: 4 }}>
              Tres hermanos, tres perfiles complementarios. Carlos, Iñaki y José Javier Rubio Carrera combinan la experiencia acumulada de décadas con la ambición de quienes han llevado a la empresa a competir con multinacionales del Ibex 35.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
            <div style={{ position: "relative", height: 340, borderRadius: 8, overflow: "hidden" }}>
              <Image
                src="/images/nosotros/hermanos-rubio-stand.webp"
                alt="Carlos, Iñaki y José Javier Rubio Carrera en el stand de Xanael"
                fill
                sizes="(max-width: 1024px) 90vw, 538px"
                className="object-cover"
                style={{ objectPosition: "50% 62%" }}
                quality={88}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
              {TEAM.map((member) => (
                <div key={member.name} style={{ padding: "16px 20px", border: "1px solid #F3F4F6", borderRadius: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 3px" }}>{member.name}</p>
                  <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Líneas de negocio — interactivo ── */}
      <section style={{ padding: "72px 32px", borderBottom: "1px solid #F3F4F6", background: "#ffffff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-20 items-start" style={{ marginBottom: 40 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 12 }}>
                Áreas de actividad
              </p>
              <h2 style={{ fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 800, color: "#111827", letterSpacing: "-1px", lineHeight: 1.2, margin: 0 }}>
                Seis divisiones,<br />una sola empresa.
              </h2>
            </div>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: 0, paddingTop: 4 }}>
              La diversificación es nuestra mayor fortaleza. Controlamos toda la cadena de valor del facility management, desde la ejecución hasta la formación y la innovación tecnológica.
            </p>
          </div>

          {/* Tabs + panel */}
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 2, border: "1px solid #F3F4F6", borderRadius: 8, overflow: "hidden" }}>

            {/* Lista de divisiones */}
            <div style={{ borderRight: "1px solid #F3F4F6" }}>
              {DIVISIONS.map((d) => {
                const isActive = d.id === activeDiv;
                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveDiv(d.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      background: isActive ? "#111827" : "transparent",
                      border: "none",
                      borderBottom: "1px solid #F3F4F6",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.15s",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? "rgba(255,255,255,0.4)" : "#D1D5DB", letterSpacing: "0.05em" }}>
                        {d.tag}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#F9FAFB" : "#374151", lineHeight: 1.3 }}>
                        {d.title}
                      </span>
                    </div>
                    {isActive && <ArrowRight size={13} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>

            {/* Panel derecho */}
            <div style={{ padding: "36px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9CA3AF" }}>
                  División {current.tag}
                </span>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", margin: "8px 0 12px", lineHeight: 1.2 }}>
                  {current.title}
                </h3>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>
                  {current.desc}
                </p>
              </div>
              <ImgPlaceholder height={200} label={`Imagen — ${current.title}`} />
              <div>
                <Link
                  href={current.href}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#111827", textDecoration: "none" }}
                >
                  Ver servicio completo <ArrowRight size={13} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── RSC ── */}
      <section style={{ padding: "72px 32px", borderBottom: "1px solid #F3F4F6", background: "#F9FAFB" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-20 items-start" style={{ marginBottom: 40 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 12 }}>
                Responsabilidad social
              </p>
              <h2 style={{ fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 800, color: "#111827", letterSpacing: "-1px", lineHeight: 1.2, margin: 0 }}>
                Empresa y comunidad,<br />inseparables.
              </h2>
            </div>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: 0, paddingTop: 4 }}>
              Nuestra prosperidad retorna a la comunidad que nos dio origen. No como marketing, sino como compromiso real y continuado con la Ribera de Navarra.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {RSC.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  border: "1px solid #F3F4F6",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {item.imgSrc && (
                  <div style={{ position: "relative", height: 240 }}>
                    <Image
                      src={item.imgSrc}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 90vw, 538px"
                      className="object-cover object-center"
                      quality={85}
                    />
                  </div>
                )}
                <div style={{ padding: "20px 24px" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div style={{ background: "#111827", padding: "56px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20 }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#F9FAFB", letterSpacing: "-1px", margin: 0 }}>
            ¿Quieres trabajar con nosotros?
          </h2>
          <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 420, lineHeight: 1.65, margin: 0 }}>
            Cuéntanos tu necesidad y te preparamos una propuesta a medida sin compromiso.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/contacto"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFFFFF", color: "#111827", fontSize: 14, fontWeight: 700, padding: "13px 24px", borderRadius: 8, textDecoration: "none" }}
            >
              Contactar ahora <ArrowRight size={15} />
            </Link>
            <a
              href="tel:+34948825025"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", color: "#D1D5DB", fontSize: 14, fontWeight: 500, padding: "13px 24px", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <Phone size={14} /> 948 82 50 25
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

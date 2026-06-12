import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 24px 80px",
        background: "#ffffff",
      }}
    >
      <Image
        src="/images/brand/logo-grupo-rubio.webp"
        alt="Grupo Rubio"
        height={64}
        width={250}
        style={{ height: 64, width: "auto", marginBottom: 32 }}
      />
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#9CA3AF",
          margin: "0 0 10px",
        }}
      >
        Error 404
      </p>
      <h1
        style={{
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 800,
          color: "#111827",
          letterSpacing: "-1.5px",
          lineHeight: 1.15,
          margin: "0 0 14px",
        }}
      >
        Esta página no existe.
      </h1>
      <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.65, maxWidth: 440, margin: "0 0 32px" }}>
        Puede que el enlace esté roto o que la página se haya movido.
        Lo que sí sigue en su sitio: nuestros servicios.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 8,
            background: "#111827",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 600,
            padding: "13px 26px",
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>
        <Link
          href="/servicios"
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 8,
            background: "#ffffff",
            color: "#111827",
            border: "1.5px solid #E5E7EB",
            fontSize: 14,
            fontWeight: 600,
            padding: "13px 26px",
            textDecoration: "none",
          }}
        >
          Ver servicios
        </Link>
      </div>
    </div>
  );
}

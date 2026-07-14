import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "Política de Cookies | Grupo Rubio",
  robots: "noindex",
};

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 800, minWidth: 0, width: "100%", margin: "0 auto", padding: "120px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Política de Cookies</h1>
        <p style={{ color: "#6B7280", marginBottom: 40 }}>Última actualización: junio 2026</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>¿Qué son las cookies?</h2>
          <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador. Sirven para recordar tus preferencias, analizar cómo usas el sitio y, en algunos casos, mostrarte publicidad personalizada.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Cookies que utilizamos</h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 600, tableLayout: "fixed", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#F3F4F6" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", border: "1px solid #E5E7EB", width: "22%" }}>Cookie</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", border: "1px solid #E5E7EB", width: "16%" }}>Tipo</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", border: "1px solid #E5E7EB" }}>Finalidad</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", border: "1px solid #E5E7EB", width: "14%" }}>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>next-auth.session-token</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Técnica</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Gestión de sesión de usuario (tienda)</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Sesión</td>
                </tr>
                <tr style={{ background: "#F9FAFB" }}>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>_medusa_jwt</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Técnica</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Autenticación en la tienda online</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Sesión</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>NEXT_LOCALE</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Preferencia</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Idioma preferido del usuario</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>1 año</td>
                </tr>
                <tr style={{ background: "#F9FAFB" }}>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>gr_cookie_consent</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Preferencia</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Recuerda tu elección sobre cookies analíticas</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Permanente</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>_ga, _ga_*</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Analítica (opcional)</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>Google Analytics 4 — estadísticas de visitas anónimas (solo si aceptas)</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", overflowWrap: "break-word" }}>2 años</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 16, color: "#6B7280", fontSize: 14 }}>
            Las cookies analíticas (Google Analytics) solo se activan si las aceptas explícitamente en el banner de consentimiento. Puedes cambiar tu elección en cualquier momento borrando las cookies del navegador.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Cómo gestionar las cookies</h2>
          <p>Puedes configurar tu navegador para rechazar o eliminar las cookies. Ten en cuenta que desactivar las cookies técnicas puede afectar al funcionamiento del sitio (p. ej., no podrás iniciar sesión en la tienda).</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.8 }}>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: "#1e3a8a" }}>Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" style={{ color: "#1e3a8a" }}>Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color: "#1e3a8a" }}>Safari</a></li>
            <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406" target="_blank" rel="noopener noreferrer" style={{ color: "#1e3a8a" }}>Microsoft Edge</a></li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Actualizaciones de esta política</h2>
          <p>Podemos actualizar esta Política de Cookies cuando sea necesario. Te recomendamos revisarla periódicamente. La fecha de última actualización aparece en la parte superior de esta página.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Contacto</h2>
          <p>Para cualquier consulta sobre el uso de cookies, puedes escribirnos a <strong>administracion@gruporubio.net</strong> o llamarnos al <strong>948 82 50 25</strong>.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}

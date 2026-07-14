import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "Aviso Legal | Grupo Rubio",
  robots: "noindex",
};

export default function AvisoLegalPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 800, minWidth: 0, width: "100%", margin: "0 auto", padding: "120px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Aviso Legal</h1>
        <p style={{ color: "#6B7280", marginBottom: 40 }}>Última actualización: junio 2026</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>1. Datos identificativos</h2>
          <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE), se informa:</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.8 }}>
            <li><strong>Denominación social:</strong> Grupo Rubio Servicios Higiénicos Integrales S.L.</li>
            <li><strong>Nombre comercial:</strong> Grupo Rubio</li>
            <li><strong>CIF:</strong> B31784051</li>
            <li><strong>Registro Mercantil:</strong> Navarra, Tomo 975, Folio 124, Sección 8, Hoja 19661</li>
            <li><strong>Domicilio social:</strong> Glorieta Merindad de Ultrapuertos 1, 31500, Tudela, Navarra</li>
            <li><strong>Teléfono:</strong> 948 82 50 25</li>
            <li><strong>Correo electrónico:</strong> administracion@gruporubio.net</li>
            <li><strong>Sitio web:</strong> gruporubio.net</li>
            <li><strong>Actividad:</strong> Servicios de limpieza profesional, control de plagas e higiene ambiental</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>2. Objeto y ámbito de aplicación</h2>
          <p>El presente Aviso Legal regula el acceso y uso del sitio web gruporubio.net, titularidad de Grupo Rubio. El acceso y uso del sitio implica la aceptación plena y sin reservas de las presentes condiciones.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>3. Propiedad intelectual e industrial</h2>
          <p>Todos los contenidos del sitio web (textos, imágenes, diseño, logotipos y código fuente) son propiedad de Grupo Rubio o de terceros que han autorizado su uso, y están protegidos por la legislación española e internacional sobre propiedad intelectual. Queda prohibida su reproducción total o parcial sin autorización expresa.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>4. Exclusión de responsabilidad</h2>
          <p>Grupo Rubio no se hace responsable de los daños derivados del uso o imposibilidad de uso del sitio, ni de los errores u omisiones en los contenidos. El acceso al sitio no implica la existencia de una relación comercial entre el usuario y Grupo Rubio.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>5. Legislación aplicable y jurisdicción</h2>
          <p>Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia, las partes se someten a los Juzgados y Tribunales de Tudela (Navarra), con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}

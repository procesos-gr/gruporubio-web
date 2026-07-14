import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "Política de Privacidad | Grupo Rubio",
  robots: "noindex",
};

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 800, minWidth: 0, width: "100%", margin: "0 auto", padding: "120px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Política de Privacidad</h1>
        <p style={{ color: "#6B7280", marginBottom: 40 }}>Última actualización: junio 2026</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>1. Responsable del tratamiento</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
            <li><strong>Identidad:</strong> Grupo Rubio Servicios Higiénicos Integrales S.L.</li>
            <li><strong>Nombre comercial:</strong> Grupo Rubio</li>
            <li><strong>CIF:</strong> B31784051</li>
            <li><strong>Registro Mercantil:</strong> Navarra, Tomo 975, Folio 124, Sección 8, Hoja 19661</li>
            <li><strong>Domicilio:</strong> Glorieta Merindad de Ultrapuertos 1, 31500, Tudela, Navarra</li>
            <li><strong>Teléfono:</strong> 948 82 50 25</li>
            <li><strong>Correo electrónico:</strong> administracion@gruporubio.net</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>2. Finalidades del tratamiento</h2>
          <p>Tratamos los datos personales que nos facilitas para las siguientes finalidades:</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Atender solicitudes de información, presupuesto o alquiler de maquinaria.</li>
            <li>Gestionar la relación comercial con clientes y proveedores.</li>
            <li>Enviar comunicaciones comerciales sobre nuestros servicios, si lo has autorizado.</li>
            <li>Gestionar el registro y cuenta de usuario en nuestra tienda online.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>3. Base jurídica del tratamiento</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
            <li><strong>Formularios de contacto/presupuesto:</strong> consentimiento del interesado (art. 6.1.a RGPD).</li>
            <li><strong>Gestión de clientes:</strong> ejecución de un contrato (art. 6.1.b RGPD).</li>
            <li><strong>Comunicaciones comerciales:</strong> interés legítimo o consentimiento (art. 6.1.a/f RGPD).</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>4. Conservación de los datos</h2>
          <p>Los datos se conservan durante el tiempo necesario para la finalidad para la que fueron recabados y, una vez finalizada, durante los plazos legalmente establecidos. Los datos de presupuestos y solicitudes de información se eliminan si no se formaliza una relación comercial en un plazo de 2 años.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>5. Destinatarios de los datos</h2>
          <p>No cedemos tus datos a terceros, salvo obligación legal. Utilizamos proveedores de servicios tecnológicos que actúan como encargados del tratamiento (alojamiento web, servicio de correo electrónico, pasarela de pago Stripe y Sentry como servicio técnico de monitorización de errores, que procesa datos técnicos del navegador sin datos identificativos). Estos proveedores operan bajo contratos de confidencialidad y no pueden usar tus datos para sus propios fines.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>6. Derechos de los interesados</h2>
          <p>Tienes derecho a:</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.8 }}>
            <li><strong>Acceso:</strong> conocer qué datos tuyos tratamos.</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
            <li><strong>Supresión ("derecho al olvido"):</strong> solicitar la eliminación de tus datos.</li>
            <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos.</li>
            <li><strong>Limitación:</strong> solicitar la restricción del tratamiento.</li>
            <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado.</li>
          </ul>
          <p style={{ marginTop: 12 }}>Para ejercer tus derechos, escríbenos a <strong>administracion@gruporubio.net</strong> indicando tu nombre, apellidos y copia de tu DNI. También puedes presentar una reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" style={{ color: "#1e3a8a" }}>Agencia Española de Protección de Datos (AEPD)</a>.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>7. Seguridad</h2>
          <p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos contra el acceso no autorizado, pérdida, destrucción o alteración, de acuerdo con el nivel de riesgo del tratamiento.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}

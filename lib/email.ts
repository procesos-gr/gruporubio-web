import nodemailer from "nodemailer";

/**
 * Envío de emails de leads (contacto, presupuesto, alquiler).
 * Config por variables de entorno — funciona con cualquier SMTP
 * (correo de gruporubio.es, Resend, Brevo...):
 *
 *   SMTP_HOST=smtp.ejemplo.es
 *   SMTP_PORT=465            (465 = SSL, 587 = STARTTLS)
 *   SMTP_USER=web@gruporubio.es
 *   SMTP_PASS=********
 *   CONTACT_EMAIL=info@gruporubio.es   (destinatario de los leads)
 *
 * Sin SMTP configurado, el lead se vuelca al log del servidor para no
 * perderlo silenciosamente, y se devuelve ok=false.
 */

export interface LeadEmail {
  subject: string;
  text: string;
  replyTo?: string;
}

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (!_transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    _transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return _transporter;
}

export async function sendLeadEmail(lead: LeadEmail): Promise<{ ok: boolean }> {
  const to = process.env.CONTACT_EMAIL ?? "info@gruporubio.es";
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("[email] SMTP sin configurar — lead solo en log:\n", lead.subject, "\n", lead.text);
    return { ok: false };
  }

  try {
    await transporter.sendMail({
      from: `"Web Grupo Rubio" <${process.env.SMTP_USER}>`,
      to,
      replyTo: lead.replyTo,
      subject: lead.subject,
      text: lead.text,
    });
    return { ok: true };
  } catch (err) {
    console.error("[email] Error enviando lead:", err, "\nLead:", lead.subject, "\n", lead.text);
    return { ok: false };
  }
}

/** Formatea pares campo→valor en texto plano legible para el email */
export function formatLead(fields: Record<string, string | undefined>): string {
  return Object.entries(fields)
    .map(([k, v]) => `${k}: ${v?.trim() || "—"}`)
    .join("\n");
}

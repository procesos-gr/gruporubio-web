import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendLeadEmail, formatLead } from "@/lib/email";

const BodySchema = z.object({
  origen: z.enum(["contacto", "presupuesto"]),
  nombre: z.string().min(1).max(120),
  email: z.string().email().max(160),
  telefono: z.string().min(6).max(30),
  mensaje: z.string().max(3000).optional(),
  // Campos extra del formulario (empresa, servicios, urgencia, máquina...)
  extra: z.record(z.string(), z.string().max(500)).optional(),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Faltan campos obligatorios o son inválidos" }, { status: 400 });
  }

  const subject =
    body.origen === "presupuesto"
      ? `[Web] Solicitud de presupuesto — ${body.nombre}`
      : `[Web] Consulta de contacto — ${body.nombre}`;

  const { ok } = await sendLeadEmail({
    subject,
    replyTo: body.email,
    text: formatLead({
      Nombre: body.nombre,
      Email: body.email,
      Teléfono: body.telefono,
      ...body.extra,
      Mensaje: body.mensaje,
    }),
  });

  if (!ok) {
    return NextResponse.json(
      { error: "No se pudo enviar. Llámanos al 948 82 50 25." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}

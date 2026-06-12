import { NextRequest, NextResponse } from 'next/server'
import { sendLeadEmail, formatLead } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { maquina, nombre, empresa, email, telefono, fechaInicio, fechaFin, localidad, mensaje } = body

    if (!nombre || !email || !telefono || !fechaInicio || !localidad || !maquina) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const { ok } = await sendLeadEmail({
      subject: `[Web] Solicitud de alquiler — ${maquina}`,
      replyTo: String(email),
      text: formatLead({
        'Máquina': String(maquina),
        'Nombre': String(nombre),
        'Empresa': empresa ? String(empresa) : undefined,
        'Email': String(email),
        'Teléfono': String(telefono),
        'Fecha inicio': String(fechaInicio),
        'Fecha fin': fechaFin ? String(fechaFin) : undefined,
        'Localidad': String(localidad),
        'Comentarios': mensaje ? String(mensaje) : undefined,
      }),
    })

    if (!ok) {
      return NextResponse.json({ error: 'No se pudo enviar. Llámanos al 948 82 50 25.' }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

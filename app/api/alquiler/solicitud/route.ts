import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { maquina, nombre, empresa, email, telefono, fechaInicio, fechaFin, localidad, mensaje } = body

    if (!nombre || !email || !telefono || !fechaInicio || !localidad || !maquina) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // TODO: connect email provider (Resend / nodemailer / etc.)
    // Example payload ready to send:
    const _payload = {
      to: process.env.CONTACT_EMAIL ?? 'info@gruporubio.net',
      subject: `Solicitud de alquiler: ${maquina}`,
      text: [
        `Máquina: ${maquina}`,
        `Nombre: ${nombre}`,
        `Empresa: ${empresa || '—'}`,
        `Email: ${email}`,
        `Teléfono: ${telefono}`,
        `Fecha inicio: ${fechaInicio}`,
        `Fecha fin: ${fechaFin || '—'}`,
        `Localidad: ${localidad}`,
        `Comentarios: ${mensaje || '—'}`,
      ].join('\n'),
    }

    console.log('[alquiler/solicitud]', _payload)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

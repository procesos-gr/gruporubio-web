'use client'

import { useState } from 'react'
import { Send, CheckCircle, ChevronDown } from 'lucide-react'

type FormState = {
  nombre: string
  empresa: string
  email: string
  telefono: string
  fechaInicio: string
  fechaFin: string
  localidad: string
  mensaje: string
}

const EMPTY: FormState = {
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  fechaInicio: '',
  fechaFin: '',
  localidad: '',
  mensaje: '',
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  required?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
        {label}
        {required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '11px 14px',
          borderRadius: 8,
          border: '1.5px solid #E5E7EB',
          fontSize: 14,
          color: '#111827',
          background: '#FFFFFF',
          outline: 'none',
          fontFamily: 'inherit',
          width: '100%',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
        onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
      />
    </div>
  )
}

export function RentalRequestForm({ maquinaTitulo }: { maquinaTitulo: string }) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof FormState) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }))

  const canSubmit =
    form.nombre && form.email && form.telefono && form.fechaInicio && form.localidad

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/alquiler/solicitud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maquina: maquinaTitulo, ...form }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError('Ha ocurrido un error. Por favor inténtalo de nuevo o llámanos directamente.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 32px',
          background: '#FFFFFF',
          borderRadius: 8,
          border: '1px solid #E5E7EB',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#F0FDF4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <CheckCircle size={32} color="#16a34a" strokeWidth={1.5} />
        </div>
        <h3
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#111827',
            letterSpacing: '-0.4px',
            marginBottom: 10,
          }}
        >
          Solicitud enviada
        </h3>
        <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 24 }}>
          Hemos recibido tu solicitud para <strong>{maquinaTitulo}</strong>.
          <br />
          Te contactaremos en menos de 24 horas para confirmar disponibilidad y condiciones.
        </p>
        <button
          onClick={() => { setForm(EMPTY); setSent(false) }}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            background: '#111827',
            color: '#FFFFFF',
            border: 'none',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Nueva solicitud
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 8,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid #F3F4F6',
          background: '#F9FAFB',
        }}
      >
        <h3
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: '#111827',
            letterSpacing: '-0.3px',
          }}
        >
          Solicitar alquiler
        </h3>
        <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
          Rellena el formulario y te confirmamos disponibilidad en menos de 24h.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
        {/* Máquina seleccionada — readonly */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
            Máquina
          </label>
          <div
            style={{
              padding: '11px 14px',
              borderRadius: 8,
              border: '1.5px solid #E5E7EB',
              background: '#F9FAFB',
              fontSize: 14,
              color: '#6B7280',
              fontWeight: 500,
            }}
          >
            {maquinaTitulo}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Nombre completo"
              value={form.nombre}
              onChange={set('nombre')}
              placeholder="Carlos García"
              required
            />
            <InputField
              label="Empresa (opcional)"
              value={form.empresa}
              onChange={set('empresa')}
              placeholder="Nombre de empresa"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Email"
              value={form.email}
              onChange={set('email')}
              placeholder="correo@empresa.com"
              type="email"
              required
            />
            <InputField
              label="Teléfono"
              value={form.telefono}
              onChange={set('telefono')}
              placeholder="+34 600 000 000"
              type="tel"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Fecha de inicio"
              value={form.fechaInicio}
              onChange={set('fechaInicio')}
              placeholder=""
              type="date"
              required
            />
            <InputField
              label="Fecha de fin (aprox.)"
              value={form.fechaFin}
              onChange={set('fechaFin')}
              placeholder=""
              type="date"
            />
          </div>

          <InputField
            label="Localidad / provincia"
            value={form.localidad}
            onChange={set('localidad')}
            placeholder="Ej: Pamplona, Navarra"
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
              Comentarios adicionales
            </label>
            <textarea
              value={form.mensaje}
              onChange={(e) => set('mensaje')(e.target.value)}
              placeholder="Cuéntanos más sobre el uso que le darás a la máquina, condiciones del espacio, accesos especiales..."
              rows={3}
              style={{
                padding: '11px 14px',
                borderRadius: 8,
                border: '1.5px solid #E5E7EB',
                fontSize: 14,
                color: '#111827',
                background: '#FFFFFF',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.6,
              }}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>
        </div>

        {error && (
          <p
            style={{
              marginTop: 16,
              fontSize: 13,
              color: '#DC2626',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 8,
              padding: '10px 14px',
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={sending || !canSubmit}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '14px 24px',
            borderRadius: 8,
            background: sending || !canSubmit ? '#9CA3AF' : '#111827',
            color: '#FFFFFF',
            border: 'none',
            fontSize: 14,
            fontWeight: 700,
            cursor: sending || !canSubmit ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!sending && canSubmit)
              (e.currentTarget as HTMLElement).style.background = '#374151'
          }}
          onMouseLeave={(e) => {
            if (!sending && canSubmit)
              (e.currentTarget as HTMLElement).style.background = '#111827'
          }}
        >
          <Send size={15} />
          {sending ? 'Enviando...' : 'Solicitar disponibilidad'}
        </button>
        <p
          style={{
            fontSize: 11,
            color: '#9CA3AF',
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          Sin compromiso · Respuesta en menos de 24h
        </p>
      </form>
    </div>
  )
}

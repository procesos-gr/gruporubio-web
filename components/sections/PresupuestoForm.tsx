'use client';

import { useState } from 'react';
import { Send, CheckCircle, Clock, Phone, Mail, MapPin, ChevronDown } from 'lucide-react';

const SERVICES = [
  { id: 'limpieza', label: 'Limpieza Especializada' },
  { id: 'plagas', label: 'Control de Plagas' },
  { id: 'alimentaria', label: 'Seguridad Alimentaria' },
  { id: 'maquinaria', label: 'Servicio Técnico y Maquinaria' },
  { id: 'formacion', label: 'Formación Profesional' },
];

const URGENCY = [
  { value: 'urgente', label: 'Lo antes posible (urgente)' },
  { value: 'semana', label: 'Esta semana' },
  { value: 'mes', label: 'Este mes' },
  { value: 'sin_prisa', label: 'Sin prisa, estoy planificando' },
];

const FREQUENCY = [
  { value: 'puntual', label: 'Servicio puntual / único' },
  { value: 'mensual', label: 'Mensual' },
  { value: 'quincenal', label: 'Quincenal' },
  { value: 'semanal', label: 'Semanal o más frecuente' },
  { value: 'acordar', label: 'A acordar con vosotros' },
];

const COMPANY_SIZE = [
  { value: 'particular', label: 'Particular / vivienda' },
  { value: 'pyme', label: 'PYME (1–50 empleados)' },
  { value: 'media', label: 'Empresa mediana (50–250)' },
  { value: 'grande', label: 'Gran empresa (+250)' },
  { value: 'institucional', label: 'Administración / institución' },
];

type FormState = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  services: string[];
  descripcion: string;
  localidad: string;
  urgencia: string;
  frecuencia: string;
  tamanyo: string;
  como_conocio: string;
};

const EMPTY: FormState = {
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  services: [],
  descripcion: '',
  localidad: '',
  urgencia: '',
  frecuencia: '',
  tamanyo: '',
  como_conocio: '',
};

function SelectField({
  label, value, onChange, options, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%', padding: '11px 40px 11px 14px',
            borderRadius: 8, border: '1.5px solid #E5E7EB',
            fontSize: 14, color: value ? '#111827' : '#9CA3AF',
            background: '#FFFFFF', cursor: 'pointer',
            appearance: 'none', WebkitAppearance: 'none',
            outline: 'none', fontFamily: 'inherit',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
          onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

function InputField({
  label, value, onChange, placeholder, type = 'text', required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
        {label}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '11px 14px', borderRadius: 8,
          border: '1.5px solid #E5E7EB', fontSize: 14,
          color: '#111827', background: '#FFFFFF',
          outline: 'none', fontFamily: 'inherit', width: '100%',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
        onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
      />
    </div>
  );
}

export function PresupuestoForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (key: keyof FormState) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const toggleService = (id: string) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(id)
        ? f.services.filter((s) => s !== id)
        : [...f.services, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.telefono || form.services.length === 0) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{
        maxWidth: 520, margin: '0 auto', textAlign: 'center',
        padding: '80px 32px',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <CheckCircle size={36} color="#16a34a" strokeWidth={1.5} />
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: 12 }}>
          Solicitud recibida
        </h2>
        <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.7, marginBottom: 32 }}>
          Hemos recibido tu solicitud. Nuestro equipo la revisará y te contactará en <strong>menos de 24 horas</strong> con un presupuesto personalizado.
        </p>
        <button
          onClick={() => { setForm(EMPTY); setSent(false); }}
          style={{
            padding: '12px 28px', borderRadius: 8,
            background: '#111827', color: '#FFFFFF',
            border: 'none', fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: '#F9FAFB' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 32px 80px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Sidebar info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            <div style={{
              background: '#FFFFFF', borderRadius: 8,
              border: '1px solid #E5E7EB', padding: '28px 24px',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 20 }}>
                ¿Qué ocurre después?
              </h3>
              {[
                { step: '01', title: 'Recibimos tu solicitud', desc: 'En menos de 2 horas durante horario laboral.' },
                { step: '02', title: 'Te llamamos', desc: 'Un técnico te llama para entender mejor tus necesidades.' },
                { step: '03', title: 'Presupuesto en 24h', desc: 'Recibes un presupuesto detallado sin compromiso.' },
                { step: '04', title: 'Empezamos cuando quieras', desc: 'Tú decides si seguimos adelante.' },
              ].map(({ step, title, desc }) => (
                <div key={step} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                  <span style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                    background: '#111827', color: '#FFFFFF',
                    fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {step}
                  </span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{title}</p>
                    <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: '#111827', borderRadius: 8, padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Clock size={16} color="#9CA3AF" />
                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Contacto directo
                </span>
              </div>
              {[
                { icon: <Phone size={14} />, text: '+34 948 000 000' },
                { icon: <Mail size={14} />, text: 'info@gruporubio.com' },
                { icon: <MapPin size={14} />, text: 'Tudela, Navarra' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ color: '#6B7280' }}>{icon}</span>
                  <span style={{ fontSize: 13, color: '#D1D5DB', fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: '#EFF6FF', border: '1px solid #BFDBFE',
              borderRadius: 8, padding: '20px',
            }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1D4ED8', marginBottom: 6 }}>
                Presupuesto sin compromiso
              </p>
              <p style={{ fontSize: 12, color: '#3B82F6', lineHeight: 1.6 }}>
                No te pedimos ningún pago ni depósito. Recibirás una propuesta detallada totalmente gratuita.
              </p>
            </div>
          </div>

          {/* ── Form ── */}
          <div style={{ gridColumn: 'span 2' }}>
            <form onSubmit={handleSubmit}>
              <div style={{
                background: '#FFFFFF', borderRadius: 8,
                border: '1px solid #E5E7EB', overflow: 'hidden',
              }}>

                {/* Section: Datos de contacto */}
                <div style={{ padding: '28px 28px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, color: '#2563EB',
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20,
                  }}>
                    01 — Datos de contacto
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: 24 }}>
                    <InputField label="Nombre completo" value={form.nombre} onChange={set('nombre')} placeholder="Carlos García" required />
                    <InputField label="Empresa u organización" value={form.empresa} onChange={set('empresa')} placeholder="Nombre de la empresa (opcional)" />
                    <InputField label="Email" value={form.email} onChange={set('email')} placeholder="correo@empresa.com" type="email" required />
                    <InputField label="Teléfono" value={form.telefono} onChange={set('telefono')} placeholder="+34 600 000 000" type="tel" required />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <SelectField
                      label="Tamaño de empresa o instalación"
                      value={form.tamanyo}
                      onChange={set('tamanyo')}
                      options={COMPANY_SIZE}
                      placeholder="Selecciona una opción"
                    />
                  </div>
                </div>

                {/* Section: Qué necesitas */}
                <div style={{ padding: '24px 28px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, color: '#2563EB',
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
                  }}>
                    02 — ¿Qué servicio necesitas?<span style={{ color: '#EF4444', marginLeft: 4 }}>*</span>
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
                    {SERVICES.map((s) => {
                      const active = form.services.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleService(s.id)}
                          style={{
                            padding: '11px 14px', borderRadius: 8, textAlign: 'left',
                            border: active ? '1.5px solid #2563EB' : '1.5px solid #E5E7EB',
                            background: active ? '#EFF6FF' : '#FFFFFF',
                            color: active ? '#1D4ED8' : '#374151',
                            fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex', alignItems: 'center', gap: 8,
                          }}
                        >
                          <span style={{
                            width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                            border: active ? '1.5px solid #2563EB' : '1.5px solid #D1D5DB',
                            background: active ? '#2563EB' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {active && <span style={{ width: 6, height: 6, background: '#FFFFFF', borderRadius: 1, display: 'block' }} />}
                          </span>
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section: Detalles */}
                <div style={{ padding: '24px 28px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, color: '#2563EB',
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
                  }}>
                    03 — Detalles del servicio
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                        Descripción de la necesidad<span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>
                      </label>
                      <textarea
                        value={form.descripcion}
                        onChange={(e) => set('descripcion')(e.target.value)}
                        placeholder="Cuéntanos qué necesitas: tipo de instalación, superficie aproximada, frecuencia que tienes en mente, cualquier detalle relevante..."
                        rows={4}
                        style={{
                          padding: '11px 14px', borderRadius: 8,
                          border: '1.5px solid #E5E7EB', fontSize: 14,
                          color: '#111827', background: '#FFFFFF', resize: 'vertical',
                          outline: 'none', fontFamily: 'inherit', lineHeight: 1.6,
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                        onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputField label="Localidad / provincia" value={form.localidad} onChange={set('localidad')} placeholder="Ej: Pamplona, Navarra" />
                      <SelectField label="Urgencia" value={form.urgencia} onChange={set('urgencia')} options={URGENCY} placeholder="¿Cuándo?" />
                      <SelectField label="Frecuencia" value={form.frecuencia} onChange={set('frecuencia')} options={FREQUENCY} placeholder="¿Con qué frecuencia?" />
                    </div>
                  </div>
                </div>

                {/* Section: Cómo nos conociste */}
                <div style={{ padding: '24px 28px' }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, color: '#2563EB',
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
                  }}>
                    04 — Un último detalle
                  </p>
                  <SelectField
                    label="¿Cómo nos conociste?"
                    value={form.como_conocio}
                    onChange={set('como_conocio')}
                    options={[
                      { value: 'google', label: 'Búsqueda en Google' },
                      { value: 'recomendacion', label: 'Recomendación de alguien' },
                      { value: 'rrss', label: 'Redes sociales' },
                      { value: 'cliente_anterior', label: 'Ya soy cliente' },
                      { value: 'otro', label: 'Otro' },
                    ]}
                    placeholder="Selecciona una opción (opcional)"
                  />

                  <button
                    type="submit"
                    disabled={sending || !form.nombre || !form.email || !form.telefono || form.services.length === 0}
                    style={{
                      marginTop: 28, width: '100%',
                      padding: '15px 28px', borderRadius: 8,
                      background: sending ? '#9CA3AF' : '#111827',
                      color: '#FFFFFF', border: 'none',
                      fontSize: 15, fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      transition: 'background 0.2s ease',
                      letterSpacing: '-0.2px',
                    }}
                    onMouseEnter={(e) => { if (!sending) (e.currentTarget as HTMLElement).style.background = '#374151'; }}
                    onMouseLeave={(e) => { if (!sending) (e.currentTarget as HTMLElement).style.background = '#111827'; }}
                  >
                    <Send size={16} />
                    {sending ? 'Enviando...' : 'Solicitar presupuesto gratuito'}
                  </button>
                  <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 12 }}>
                    Sin compromiso. Responderemos en menos de 24h.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

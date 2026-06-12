'use client';

import { useState } from 'react';
import {
  MessageSquare, Wrench, AlertTriangle, Handshake,
  Phone, Mail, MapPin, Clock, CheckCircle2, AlertCircle, X, Send, ChevronRight,
  PackageOpen, CalendarDays,
} from 'lucide-react';

type ContactType = 'general' | 'soporte' | 'urgencia' | 'comercial' | 'alquiler';

interface Option {
  id: ContactType;
  icon: React.ReactNode;
  label: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

const OPTIONS: Option[] = [
  {
    id: 'general',
    icon: <MessageSquare size={20} />,
    label: 'Información general',
    description: 'Presupuestos, información sobre servicios y consultas generales.',
  },
  {
    id: 'alquiler',
    icon: <PackageOpen size={20} />,
    label: 'Alquiler de maquinaria',
    description: 'Solicitar disponibilidad, precios y condiciones de alquiler de equipos.',
  },
  {
    id: 'soporte',
    icon: <Wrench size={20} />,
    label: 'Soporte técnico',
    description: 'Incidencias con maquinaria, revisiones o servicio técnico Kärcher.',
  },
  {
    id: 'urgencia',
    icon: <AlertTriangle size={20} />,
    label: 'Aviso urgente',
    description: 'Plagas activas, derrames o situaciones que requieren actuación rápida.',
  },
  {
    id: 'comercial',
    icon: <Handshake size={20} />,
    label: 'Acuerdos comerciales',
    description: 'Contratos de mantenimiento, acuerdos de larga duración y grandes cuentas.',
  },
];

const LABELS: Record<ContactType, string> = {
  general: 'Información general',
  alquiler: 'Alquiler de maquinaria',
  soporte: 'Soporte técnico',
  urgencia: 'Aviso urgente',
  comercial: 'Acuerdos comerciales',
};

const MAQUINAS_ALQUILER = [
  'Fregadora Industrial Conductor a Pie (batería)',
  'Fregadora Industrial Conductor Sentado (batería)',
  'Barredora Industrial a Batería (interior)',
  'Barredora Industrial a Gasolina (exterior)',
  'Aspirador Industrial Seco/Húmedo',
  'Aspirador Profesional a Batería (inalámbrico)',
  'Hidrolimpiadora Agua Fría Monofásica (230V)',
  'Hidrolimpiadora Agua Fría Trifásica (400V)',
  'Hidrolimpiadora Agua Caliente',
  'Lavamoquetas Inyección-Extracción (Kärcher Puzzi)',
  'Generador de Ozono Industrial',
  'Deshumidificadora Industrial',
  'Rotativa Abrillantadora Monodisco',
  'No sé cuál necesito / necesito asesoramiento',
];

type ToastType = 'success' | 'error';

function Toast({ type, message, onClose }: { type: ToastType; message: string; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
      display: 'flex', alignItems: 'flex-start', gap: 12,
      background: '#FFFFFF',
      border: `1px solid ${type === 'success' ? '#D1FAE5' : '#FEE2E2'}`,
      borderLeft: `3px solid ${type === 'success' ? '#10B981' : '#EF4444'}`,
      borderRadius: 8, padding: '14px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      maxWidth: 340,
      animation: 'slideUp 0.25s ease',
    }}>
      {type === 'success'
        ? <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: 1 }} />
        : <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }} />
      }
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>
          {type === 'success' ? 'Mensaje enviado' : 'Error al enviar'}
        </p>
        <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{message}</p>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9CA3AF' }}>
        <X size={14} />
      </button>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

export function ContactSection() {
  const [selected, setSelected] = useState<ContactType>('general');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', maquina: '', fechaInicio: '', fechaFin: '', localidad: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setToast({ type: 'error', message: 'Por favor rellena todos los campos obligatorios.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origen: 'contacto',
          nombre: form.name,
          email: form.email,
          telefono: form.phone,
          mensaje: form.message,
          extra: {
            'Tipo de consulta': LABELS[selected],
            ...(selected === 'alquiler'
              ? {
                  'Máquina': form.maquina,
                  'Fecha inicio': form.fechaInicio,
                  'Fecha fin': form.fechaFin,
                  'Localidad': form.localidad,
                }
              : {}),
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'No se pudo enviar el mensaje. Inténtalo de nuevo.');
      }
      setSent(true);
      setToast({ type: 'success', message: 'Te contactamos en menos de 24 horas hábiles.' });
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 8,
    border: '1px solid #D1D5DB', fontSize: 14, color: '#111827',
    outline: 'none', boxSizing: 'border-box', background: '#FFFFFF',
    fontFamily: 'inherit',
  };

  return (
    <section style={{ background: '#FFFFFF', padding: '64px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">

          {/* Left — type selector + form */}
          <div>
            {/* Step 1: select type */}
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 14 }}>
                Paso 1 — Tipo de consulta
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {OPTIONS.map((opt) => {
                  const isActive = selected === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => { setSelected(opt.id); setSent(false); }}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '16px 18px', borderRadius: 8, cursor: 'pointer',
                        border: `1.5px solid ${isActive ? '#111827' : '#E5E7EB'}`,
                        background: isActive ? '#111827' : '#FFFFFF',
                        textAlign: 'left',
                        transition: 'border-color 0.15s ease, background 0.15s ease',
                      }}
                    >
                      <span style={{ color: isActive ? '#FFFFFF' : '#6B7280', flexShrink: 0, marginTop: 2 }}>
                        {opt.icon}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? '#FFFFFF' : '#111827', lineHeight: 1.2 }}>
                            {opt.label}
                          </span>
                          {opt.badge && (
                            <span style={{
                              fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                              color: isActive ? opt.badgeColor : opt.badgeColor,
                              background: isActive ? 'rgba(255,255,255,0.15)' : '#FEF2F2',
                              padding: '2px 7px', borderRadius: 4,
                            }}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 12, color: isActive ? 'rgba(255,255,255,0.65)' : '#6B7280', margin: 0, lineHeight: 1.5 }}>
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: form */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 14 }}>
                Paso 2 — Tus datos
              </p>

              {sent ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 14, padding: '48px 32px', textAlign: 'center',
                  background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8,
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CheckCircle2 size={24} style={{ color: '#16A34A' }} />
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: '#111827', margin: 0 }}>
                    Mensaje recibido
                  </h3>
                  <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 340, lineHeight: 1.65, margin: 0 }}>
                    Hemos recibido tu consulta de <strong>{LABELS[selected]}</strong>. Nos pondremos en contacto en menos de 24 horas hábiles.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    style={{
                      fontSize: 13, fontWeight: 600, color: '#374151',
                      background: 'none', border: 'none', cursor: 'pointer',
                      textDecoration: 'underline', textUnderlineOffset: 3,
                    }}
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        Nombre y apellidos *
                      </label>
                      <input type="text" required value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="María García" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        Teléfono *
                      </label>
                      <input type="tel" required value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+34 648 000 000" style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                      Email *
                    </label>
                    <input type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="tu@empresa.com" style={inputStyle} />
                  </div>

                  {/* Campos extra para alquiler */}
                  {selected === 'alquiler' && (
                    <>
                      <div style={{ height: 1, background: '#F3F4F6' }} />

                      <div style={{
                        background: '#EFF6FF', border: '1px solid #BFDBFE',
                        borderRadius: 8, padding: '12px 16px',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <CalendarDays size={14} style={{ color: '#2563EB', flexShrink: 0 }} />
                        <p style={{ fontSize: 12, color: '#1D4ED8', margin: 0, fontWeight: 500 }}>
                          Rellena los detalles del alquiler y te confirmamos disponibilidad en menos de 24h.
                        </p>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                          Equipo que necesitas *
                        </label>
                        <div style={{ position: 'relative' }}>
                          <select
                            required
                            value={form.maquina}
                            onChange={(e) => setForm({ ...form, maquina: e.target.value })}
                            style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', paddingRight: 36, cursor: 'pointer', color: form.maquina ? '#111827' : '#9CA3AF' }}
                          >
                            <option value="" disabled>Selecciona un equipo</option>
                            {MAQUINAS_ALQUILER.map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <ChevronRight size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%) rotate(90deg)', color: '#9CA3AF', pointerEvents: 'none' }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                            Fecha de inicio *
                          </label>
                          <input type="date" required value={form.fechaInicio}
                            onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
                            style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                            Fecha de fin (aprox.)
                          </label>
                          <input type="date" value={form.fechaFin}
                            onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
                            style={inputStyle} />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                          Localidad / provincia *
                        </label>
                        <input type="text" required value={form.localidad}
                          onChange={(e) => setForm({ ...form, localidad: e.target.value })}
                          placeholder="Ej: Pamplona, Navarra" style={inputStyle} />
                      </div>

                      <div style={{ height: 1, background: '#F3F4F6' }} />
                    </>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                      Mensaje <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(opcional)</span>
                    </label>
                    <textarea rows={4} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={
                        selected === 'urgencia'
                          ? 'Describe la urgencia y la dirección del problema...'
                          : selected === 'soporte'
                          ? 'Modelo de maquinaria, número de serie y descripción del problema...'
                          : selected === 'alquiler'
                          ? 'Accesos especiales, condiciones del espacio, cualquier detalle relevante...'
                          : 'Cuéntanos cómo podemos ayudarte...'
                      }
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: loading ? '#6B7280' : '#111827',
                      color: '#FFFFFF', fontSize: 14, fontWeight: 700,
                      padding: '13px 24px', borderRadius: 8,
                      border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'background 0.2s ease', width: '100%',
                    }}
                  >
                    {loading ? (
                      <>
                        <span style={{
                          width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#FFFFFF', borderRadius: '50%',
                          display: 'inline-block', animation: 'spin 0.7s linear infinite',
                        }} />
                        Enviando…
                      </>
                    ) : (
                      <><Send size={15} /> Enviar mensaje</>
                    )}
                  </button>

                  <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', margin: 0 }}>
                    Sin compromiso · Respuesta garantizada en menos de 24h laborables
                  </p>

                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </form>
              )}
            </div>
          </div>

          {/* Right — contact info */}
          <div style={{ position: 'sticky', top: 96 }}>
            <div style={{ background: '#111827', borderRadius: 8, padding: 28, marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 20 }}>
                Contacto directo
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <a href="tel:+34948825025" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={17} style={{ color: '#D1D5DB' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 2px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Teléfono</p>
                    <p style={{ fontSize: 15, color: '#F9FAFB', margin: 0, fontWeight: 600 }}>948 82 50 25</p>
                  </div>
                </a>

                <a href="mailto:info@gruporubio.es" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={17} style={{ color: '#D1D5DB' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 2px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Email</p>
                    <p style={{ fontSize: 15, color: '#F9FAFB', margin: 0, fontWeight: 600 }}>info@gruporubio.es</p>
                  </div>
                </a>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={17} style={{ color: '#D1D5DB' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 2px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Oficina</p>
                    <p style={{ fontSize: 14, color: '#D1D5DB', margin: 0, lineHeight: 1.55 }}>Navarra · Aragón · La Rioja</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={17} style={{ color: '#D1D5DB' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 2px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Horario</p>
                    <p style={{ fontSize: 14, color: '#D1D5DB', margin: 0, lineHeight: 1.55 }}>Lun–Vie 8:00–18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ links */}
            <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 12 }}>
                Accesos rápidos
              </p>
              {[
                { label: 'Ver todos los servicios', href: '/servicios' },
                { label: 'Alquiler de maquinaria', href: '/servicios/alquiler-de-maquinaria' },
                { label: 'Servicio técnico Kärcher', href: '/servicios/servicio-tecnico-oficial-karcher' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 0', borderBottom: '1px solid #F3F4F6',
                    textDecoration: 'none', fontSize: 13, color: '#374151', fontWeight: 500,
                  }}
                >
                  {link.label}
                  <ChevronRight size={13} style={{ color: '#D1D5DB' }} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </section>
  );
}

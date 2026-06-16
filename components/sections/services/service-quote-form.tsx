'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface Props {
  serviceTitle: string;
}

type ToastType = 'success' | 'error';

function Toast({ type, message, onClose }: { type: ToastType; message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      background: '#FFFFFF',
      border: `1px solid ${isSuccess ? '#D1FAE5' : '#FEE2E2'}`,
      borderLeft: `3px solid ${isSuccess ? '#10B981' : '#EF4444'}`,
      borderRadius: 8,
      padding: '14px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      maxWidth: 340,
      animation: 'slideUp 0.25s ease',
    }}>
      {isSuccess
        ? <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: 1 }} />
        : <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }} />
      }
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>
          {isSuccess ? 'Solicitud enviada' : 'Error al enviar'}
        </p>
        <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{message}</p>
      </div>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9CA3AF', flexShrink: 0 }}
      >
        <X size={14} />
      </button>
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

export function ServiceQuoteForm({ serviceTitle }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setToast({ type: 'error', message: 'Por favor rellena todos los campos obligatorios.' });
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      setSent(true);
    } catch {
      setToast({ type: 'error', message: 'No se pudo enviar la solicitud. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 8,
    border: '1px solid #D1D5DB', fontSize: 14, color: '#111827',
    outline: 'none', boxSizing: 'border-box', background: '#FFFFFF',
  };

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Solicitud enviada</p>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>Nos pondremos en contacto contigo en menos de 24 horas hábiles.</p>
        </div>
        <button onClick={() => { setForm({ name: '', email: '', phone: '', message: '' }); setSent(false); }} style={{ fontSize: 13, color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Nombre y apellidos *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="María García"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Teléfono *
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+34 648 000 000"
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Email *
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="tu@empresa.com"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Mensaje <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(opcional)</span>
          </label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={`Cuéntanos más sobre tu necesidad de ${serviceTitle}...`}
            style={{
              ...inputStyle,
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: 1.55,
            }}
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
            <><Send size={15} /> Solicitar presupuesto gratuito</>
          )}
        </button>

        <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', margin: 0 }}>
          Sin compromiso · Respuesta en menos de 24h laborables
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </form>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

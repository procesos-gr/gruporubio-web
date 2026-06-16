'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'es';

  useEffect(() => {
    if (!localStorage.getItem('gr_cookie_consent')) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('gr_cookie_consent', 'accepted');
    setVisible(false);
    window.dispatchEvent(new Event('gr_consent_change'));
  };

  const reject = () => {
    localStorage.setItem('gr_cookie_consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: 24,
      zIndex: 9999,
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: 8,
      padding: '20px 24px',
      maxWidth: 320,
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      animation: 'cookieSlide 0.3s ease',
    }}>
      <p style={{ fontSize: 14, color: '#374151', margin: '0 0 16px', lineHeight: 1.6 }}>
        Usamos cookies para mejorar tu experiencia.{' '}
        <Link href={`/${locale}/cookies`} style={{ color: '#111827', fontWeight: 600 }}>
          Más info
        </Link>
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={reject}
          style={{
            flex: 1,
            padding: '9px 0',
            borderRadius: 6,
            border: '1px solid #E5E7EB',
            background: '#FFFFFF',
            color: '#6B7280',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Rechazar
        </button>
        <button
          onClick={accept}
          style={{
            flex: 1,
            padding: '9px 0',
            borderRadius: 6,
            border: 'none',
            background: '#111827',
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Aceptar
        </button>
      </div>
      <style>{`@keyframes cookieSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

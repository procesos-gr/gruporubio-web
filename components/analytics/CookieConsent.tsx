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
      setVisible(true);
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
    window.dispatchEvent(new Event('gr_consent_change'));
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: '#111827',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap',
    }}>
      <p style={{
        flex: 1,
        minWidth: 260,
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        margin: 0,
        lineHeight: 1.6,
      }}>
        Usamos cookies de análisis (Google Analytics) para mejorar el sitio.{' '}
        <Link
          href={`/${locale}/cookies`}
          style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}
        >
          Más información
        </Link>
      </p>

      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button
          onClick={reject}
          style={{
            padding: '8px 18px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Solo necesarias
        </button>
        <button
          onClick={accept}
          style={{
            padding: '8px 18px',
            borderRadius: 6,
            border: 'none',
            background: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

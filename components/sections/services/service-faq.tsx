'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { ServiceFAQ } from '@/lib/services-data';

export function ServiceFAQAccordion({ faqs }: { faqs: ServiceFAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 16, padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>{faq.q}</span>
              <div
                style={{
                  width: 26, height: 26, borderRadius: 7,
                  background: isOpen ? '#111827' : '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'background 0.2s ease',
                }}
              >
                {isOpen ? <Minus size={12} color="#ffffff" /> : <Plus size={12} color="#6B7280" />}
              </div>
            </button>
            <div style={{ maxHeight: isOpen ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, paddingBottom: 18, margin: 0 }}>{faq.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

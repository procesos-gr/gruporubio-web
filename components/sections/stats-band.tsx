'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';

const STATS = [
  { display: '+3.000', key: 'clients_label' },
  { display: '+20',    key: 'experience_label' },
  { display: '+170',   key: 'municipalities_label' },
  { display: '+15',    key: 'services_label' },
];

export function StatsBand() {
  const t = useTranslations('Stats');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section style={{ background: '#ffffff', padding: '72px 24px' }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          {STATS.map((stat, i) => (
            <div key={stat.key} style={{ display: 'contents' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.1 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}
              >
                <span style={{
                  fontSize: 'clamp(38px, 4.5vw, 56px)',
                  fontWeight: 900,
                  color: '#111827',
                  lineHeight: 1,
                  letterSpacing: '-2px',
                  fontFamily: 'var(--font-plus-jakarta), sans-serif',
                }}>
                  {stat.display}
                </span>
                <span style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#6B7280',
                  textAlign: 'center',
                  fontFamily: 'var(--font-plus-jakarta), sans-serif',
                }}>
                  {t(stat.key)}
                </span>
              </motion.div>
              {i < STATS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={inView ? { opacity: 1, scaleY: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 + 0.2 }}
                  style={{ width: 1, height: 56, background: '#E5E7EB', flexShrink: 0 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

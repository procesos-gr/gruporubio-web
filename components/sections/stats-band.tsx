'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';

const STATS = [
  { end: 3000, prefix: '+', suffix: '', thousands: true, key: 'clients_label' },
  { end: 20,   prefix: '+', suffix: '', thousands: false, key: 'experience_label' },
  { end: 170,  prefix: '+', suffix: '', thousands: false, key: 'municipalities_label' },
  { end: 15,   prefix: '+', suffix: '', thousands: false, key: 'services_label' },
];

function useCountUp(end: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * end);
      setValue(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, end, duration]);
  return value;
}

function StatItem({ stat, active, delay, t }: {
  stat: typeof STATS[0];
  active: boolean;
  delay: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const count = useCountUp(stat.end, active, 1600);
  const display = stat.thousands
    ? stat.prefix + count.toLocaleString('es-ES')
    : stat.prefix + count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}
    >
      <span style={{
        fontSize: 'clamp(38px, 4.5vw, 56px)',
        fontWeight: 900,
        color: '#111827',
        lineHeight: 1,
        letterSpacing: '-2px',
        fontFamily: 'var(--font-plus-jakarta), sans-serif',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {display}
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
  );
}

export function StatsBand() {
  const t = useTranslations('Stats');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '80px' });

  return (
    <section style={{ background: '#ffffff', padding: '72px 24px' }}>
      <style>{`
        .stats-band-row { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        @media (max-width: 760px) {
          .stats-band-row { display: grid; grid-template-columns: 1fr 1fr; gap: 36px 16px; }
          .stats-band-sep { display: none; }
        }
      `}</style>
      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="stats-band-row">
          {STATS.map((stat, i) => (
            <div key={stat.key} style={{ display: 'contents' }}>
              <StatItem stat={stat} active={inView} delay={i * 0.12} t={t} />
              {i < STATS.length - 1 && (
                <motion.div
                  className="stats-band-sep"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={inView ? { opacity: 1, scaleY: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.12 + 0.2 }}
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

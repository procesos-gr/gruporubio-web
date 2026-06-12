import Image from 'next/image';

const CARD_RADIUS = 12;

function PreviewCard({ src, label, title, ratio }: { src: string; label: string; title: string; ratio: string }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{label}</div>
      <div
        style={{
          position: 'relative',
          borderRadius: CARD_RADIUS,
          overflow: 'hidden',
          aspectRatio: ratio,
          width: '100%',
        }}
      >
        <Image src={src} alt={title} fill className="object-cover object-center" sizes="50vw" quality={90} />
        {/* overlay igual que el grid real */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 16 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              textShadow: '0 2px 12px rgba(0,0,0,0.45)',
              whiteSpace: 'pre-line',
            }}
          >
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewVariantesPage() {
  const limpieza = [1, 2, 3, 4].map((n) => `/images/home/_variants/limpieza-v${n}.webp`);
  const plagas = [1, 2, 3, 4].map((n) => `/images/home/_variants/plagas-v${n}.webp`);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 100px', fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111827', letterSpacing: '-1px', margin: '0 0 8px' }}>
        Comparativa de variantes
      </h1>
      <p style={{ fontSize: 15, color: '#6B7280', margin: '0 0 48px' }}>
        Cada variante dentro de la tarjeta real (con su overlay y proporción). Página temporal.
      </p>

      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 20px' }}>Limpieza Profesional</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 64 }}>
        {limpieza.map((src, i) => (
          <PreviewCard key={src} src={src} label={`V${i + 1}`} title={'Limpieza\nProfesional'} ratio="62 / 42" />
        ))}
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 20px' }}>Control de Plagas</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
        {plagas.map((src, i) => (
          <PreviewCard key={src} src={src} label={`V${i + 1}`} title={'Control\nde Plagas'} ratio="1 / 1" />
        ))}
      </div>
    </div>
  );
}

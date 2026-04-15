import Image from 'next/image';
import Link from 'next/link';

interface Block {
  supertitle: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  placeholderBg: string;
  imageRight: boolean;
  imageSrc?: string;
}

const blocks: Block[] = [
  {
    supertitle: 'Limpieza para todo tipo de espacio',
    title: 'Más de 50 años garantizando espacios limpios y seguros',
    description:
      'Servicios de limpieza para hogares, empresas, industrias y administraciones. Equipos propios, protocolos certificados y supervisores de zona que visitan regularmente cada instalación.',
    cta: 'Saber más',
    href: '/contacto',
    placeholderBg: '#BFDBFE',
    imageRight: false,
    imageSrc: '/images/lineadenegocio-limpieza.png',
  },
  {
    supertitle: 'Desratización, desinsectación y desinfección',
    title: 'Eliminamos cualquier plaga sin interrumpir tu actividad',
    description:
      'Tratamientos certificados con productos homologados para todo tipo de instalación. Respuesta rápida, discreción total y seguimiento post-tratamiento incluido.',
    cta: 'Saber más',
    href: '/contacto',
    placeholderBg: '#A7F3D0',
    imageRight: true,
  },
  {
    supertitle: 'Maquinaria, productos y consumibles',
    title: 'Todo lo que necesitas para una limpieza profesional',
    description:
      'Venta y alquiler de maquinaria industrial, productos químicos homologados y consumibles de higiene. Servicio técnico propio para cualquier equipo, con atención personalizada.',
    cta: 'Ir a la tienda',
    href: '/tienda',
    placeholderBg: '#FDE68A',
    imageRight: false,
  },
];

function ServiceBlock({ block, isFirst }: { block: Block; isFirst: boolean }) {
  const imageSlot = (
    <div className={block.imageRight ? 'order-first md:order-last' : 'order-first'}>
      {block.imageSrc ? (
        <Image
          src={block.imageSrc}
          alt={block.title}
          width={700}
          height={520}
          className="w-full h-auto"
          style={{ objectFit: 'contain' }}
        />
      ) : (
        <>
          {/* TODO: Sustituir el div de abajo por <Image> cuando lleguen las fotos reales */}
          {/* <Image src="/images/limpieza-hero.jpg" alt="..." width={580} height={360} className="rounded-xl object-cover w-full" /> */}
          <div
            style={{
              width: '100%',
              borderRadius: '12px',
              backgroundColor: block.placeholderBg,
            }}
            className="h-[240px] md:h-[360px]"
          />
        </>
      )}
    </div>
  );

  const textSlot = (
    <div className={block.imageRight ? 'order-last md:order-first' : 'order-last'}>
      <p
        style={{
          color: '#1A56DB',
          fontSize: '13px',
          fontWeight: 500,
          marginBottom: '12px',
        }}
      >
        {block.supertitle}
      </p>
      <h2
        style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#0f172a',
          lineHeight: 1.25,
          marginBottom: '16px',
        }}
      >
        {block.title}
      </h2>
      <p
        style={{
          fontSize: '15px',
          color: '#475569',
          lineHeight: 1.7,
          maxWidth: '440px',
          marginBottom: '24px',
        }}
      >
        {block.description}
      </p>
      <Link
        href={block.href}
        style={{
          display: 'inline-block',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '11px 24px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 500,
          textDecoration: 'none',
        }}
        className="hover:bg-slate-800 transition-colors"
      >
        {block.cta}
      </Link>
    </div>
  );

  return (
    <div
      style={{
        borderTop: isFirst ? 'none' : '1px solid #DBEAFE',
      }}
      className="py-10 md:py-16"
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 items-center"
        style={{ gap: '64px' }}
      >
        {imageSlot}
        {textSlot}
      </div>
    </div>
  );
}

export function BusinessLines() {
  return (
    <section style={{ backgroundColor: '#EFF6FF', padding: '80px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {blocks.map((block, i) => (
          <ServiceBlock key={block.title} block={block} isFirst={i === 0} />
        ))}
      </div>
    </section>
  );
}

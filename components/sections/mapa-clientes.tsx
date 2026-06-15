'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Sparkles, Bug, ShoppingBag, Wrench } from 'lucide-react';
import { CLIENTES_MUNICIPIO } from '@/lib/clientes-municipio';

// --- Badges de servicios para el tooltip (SVG inline, sin React) ---
const TOOLTIP_SERVICIOS = [
  {
    bg: '#3B82F6',
    path: `<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>`,
  },
  {
    bg: '#EF4444',
    path: `<path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/>`,
  },
  {
    bg: '#22C55E',
    path: `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>`,
  },
];

function serviciosBadges(municId: number): string {
  const n = municId % 7;
  const indices = n === 0 ? [0] : n === 1 ? [0, 1] : [0, 1, 2];
  return indices.map(i => {
    const s = TOOLTIP_SERVICIOS[i];
    return `<span style="width:20px;height:20px;border-radius:50%;background:${s.bg};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${s.path}</svg></span>`;
  }).join('');
}

// --- Constantes fácilmente ajustables ---
const PALETA = ['#1e293b', '#2952a3', '#1d4ed8', '#2563eb', '#3b82f6'];
const TRAMOS = [1, 5, 20, 100];
const ETIQUETAS = ['0', '1-4', '5-19', '20-99', '100+'];
const ESPACIADO = 11; // px entre celdas
const LADO = 8.5; // tamaño de cada cuadradito
const CODIGOS_PROVINCIA = ['31', '26', '50']; // Navarra, La Rioja, Zaragoza
const MARGEN = 20; // px de margen alrededor del mapa

const INFO_CARDS = [
  {
    icon: Sparkles,
    title: 'Limpieza profesional',
    desc: 'Industrial, de obra, fachadas, parkings, siniestros y altura. Maquinaria propia Kärcher.',
  },
  {
    icon: Bug,
    title: 'Control de plagas',
    desc: 'DDD integral: desratización, desinsectación, desinfección, termitas, aves y legionela.',
  },
  {
    icon: ShoppingBag,
    title: 'Venta de productos',
    desc: 'Productos de higiene y limpieza profesional para empresas, hostelería e industria.',
  },
  {
    icon: Wrench,
    title: 'Maquinaria y formación',
    desc: 'Alquiler y servicio técnico oficial Kärcher. Centro de formación propio en Tudela.',
  },
];

interface MunicipioInfo {
  feature: GeoJSON.Feature;
  bbox: [[number, number], [number, number]];
  clientes: number;
}

interface PuntoGrid {
  x: number;
  y: number;
  munic: MunicipioInfo | null;
}

export function MapaClientes() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    let resizeObserver: ResizeObserver | null = null;

    async function load() {
      try {
        const [provinciasTopo, municipiosTopo] = await Promise.all([
          d3.json('https://cdn.jsdelivr.net/npm/es-atlas@0.6.0/es/provinces.json', { signal: controller.signal }),
          d3.json('https://cdn.jsdelivr.net/npm/es-atlas@0.6.0/es/municipalities.json', { signal: controller.signal }),
        ]) as [TopoJSON.Topology, TopoJSON.Topology];

        if (controller.signal.aborted) return;

        const provincias = (topojson.feature(provinciasTopo, provinciasTopo.objects.provinces) as unknown as GeoJSON.FeatureCollection).features
          .filter(f => CODIGOS_PROVINCIA.includes(String(f.id).padStart(2, '0')))
          .map(f => Object.assign(f, { bbox: d3.geoBounds(f) }));

        const todosMunicipios = (topojson.feature(municipiosTopo, municipiosTopo.objects.municipalities) as unknown as GeoJSON.FeatureCollection).features;

        const municipiosPorProvincia: MunicipioInfo[][] = provincias.map(p =>
          todosMunicipios
            .filter(f => String(f.id).slice(0, 2) === String(p.id).slice(0, 2))
            .map(f => ({ feature: f, bbox: d3.geoBounds(f) as [[number, number], [number, number]], clientes: CLIENTES_MUNICIPIO[String(f.id)] || 0 }))
        );

        const colorEscala = d3.scaleThreshold<number, string>().domain(TRAMOS).range(PALETA);

        function dibujar() {
          const node = svg.node();
          if (!node) return;
          const { width } = node.getBoundingClientRect();

          // Calcular el alto correcto desde la geografía real (igual que el HTML original)
          const projTemp = d3.geoMercator().fitWidth(
            width - MARGEN * 2,
            { type: 'FeatureCollection', features: provincias } as GeoJSON.FeatureCollection
          );
          const [[, py0], [, py1]] = d3.geoPath(projTemp).bounds(
            { type: 'FeatureCollection', features: provincias } as GeoJSON.FeatureCollection
          );
          const height = Math.ceil(py1 - py0) + MARGEN * 2;

          svg.attr('viewBox', `0 0 ${width} ${height}`)
             .attr('height', height);
          svg.selectAll('*').remove();

          const projection = d3.geoMercator().fitExtent(
            [[MARGEN, MARGEN], [width - MARGEN, height - MARGEN]],
            { type: 'FeatureCollection', features: provincias } as GeoJSON.FeatureCollection
          );

          const ESPAC = ESPACIADO;
          const cols = Math.ceil(width / ESPAC);
          const rows = Math.ceil(height / ESPAC);
          const provIndice = new Array<number>(cols * rows).fill(-1);
          const municIndice = new Array<MunicipioInfo | null>(cols * rows).fill(null);

          for (let ix = 0; ix < cols; ix++) {
            for (let iy = 0; iy < rows; iy++) {
              const coord = projection.invert?.([ix * ESPAC, iy * ESPAC]);
              if (!coord) continue;
              const [lon0, lat0] = coord;
              const idxProv = provincias.findIndex(f => {
                const [[x0, y0], [x1, y1]] = (f as unknown as { bbox: [[number, number], [number, number]] }).bbox;
                if (lon0 < x0 || lon0 > x1 || lat0 < y0 || lat0 > y1) return false;
                return d3.geoContains(f, coord);
              });
              provIndice[ix * rows + iy] = idxProv;

              if (idxProv !== -1) {
                const candidatos = municipiosPorProvincia[idxProv];
                const [lon, lat] = coord;
                for (const m of candidatos) {
                  const [[x0, y0], [x1, y1]] = m.bbox;
                  if (lon < x0 || lon > x1 || lat < y0 || lat > y1) continue;
                  if (d3.geoContains(m.feature, coord)) {
                    municIndice[ix * rows + iy] = m;
                    break;
                  }
                }
              }
            }
          }

          // Relleno de "calvas" interiores: si una celda vacía está rodeada
          // mayoritariamente por una misma provincia, se considera parte de ella
          for (let ix = 0; ix < cols; ix++) {
            for (let iy = 0; iy < rows; iy++) {
              const i = ix * rows + iy;
              if (provIndice[i] !== -1) continue;
              const vecinos = [
                ix > 0 ? provIndice[(ix - 1) * rows + iy] : -1,
                ix < cols - 1 ? provIndice[(ix + 1) * rows + iy] : -1,
                iy > 0 ? provIndice[ix * rows + (iy - 1)] : -1,
                iy < rows - 1 ? provIndice[ix * rows + (iy + 1)] : -1,
              ].filter(v => v !== -1);
              if (vecinos.length >= 3 && vecinos.every(v => v === vecinos[0])) {
                provIndice[i] = vecinos[0];
              }
            }
          }

          // Lógica idéntica al prototipo HTML (12-mapa-cuadraditos.html)
          const puntosGrid: PuntoGrid[] = [];
          for (let ix = 0; ix < cols; ix++) {
            for (let iy = 0; iy < rows; iy++) {
              const idx = provIndice[ix * rows + iy];
              if (idx === -1) continue;
              // Solo dibuja si todos los vecinos directos son de la misma provincia
              // (crea separación natural entre provincias sin líneas)
              const vecinos = [
                ix > 0             ? provIndice[(ix - 1) * rows + iy] : idx,
                ix < cols - 1      ? provIndice[(ix + 1) * rows + iy] : idx,
                iy > 0             ? provIndice[ix * rows + (iy - 1)] : idx,
                iy < rows - 1      ? provIndice[ix * rows + (iy + 1)] : idx,
              ];
              if (vecinos.every(v => v === idx)) {
                puntosGrid.push({ x: ix * ESPAC, y: iy * ESPAC, munic: municIndice[ix * rows + iy] });
              }
            }
          }

          svg.selectAll('rect')
            .data(puntosGrid)
            .join('rect')
            .attr('x', d => d.x - LADO / 2)
            .attr('y', d => d.y - LADO / 2)
            .attr('width', LADO)
            .attr('height', LADO)
            .attr('rx', 1.5)
            .style('fill', d => colorEscala(d.munic ? d.munic.clientes : 0))
            .style('cursor', d => d.munic && d.munic.clientes > 0 ? 'pointer' : 'default')
            .on('mousemove', (event: MouseEvent, d) => {
              if (!d.munic || d.munic.clientes === 0) { tooltip.style('opacity', 0); return; }
              const rect = node.getBoundingClientRect();
              const name = (d.munic.feature.properties as { name: string }).name;
              const badges = serviciosBadges(Number(d.munic.feature.id));
              tooltip.style('opacity', 1)
                .style('left', `${event.clientX - rect.left}px`)
                .style('top', `${event.clientY - rect.top}px`)
                .html(`<b>${name}</b><div class="mc-badges">${badges}</div>`);
            })
            .on('mouseleave', () => tooltip.style('opacity', 0));
        }

        dibujar();
        setLoading(false);

        resizeObserver = new ResizeObserver(() => dibujar());
        if (svg.node()) resizeObserver.observe(svg.node()!.parentElement!);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(true);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      controller.abort();
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <section style={{ background: '#ffffff', padding: '80px 24px' }}>
      <style>{`
        .mc-tooltip {
          position: absolute; pointer-events: none;
          background: rgba(17,24,39,.94); color: #fff;
          padding: 8px 12px; border-radius: 8px; font-size: 13px;
          opacity: 0; transition: opacity .15s; transform: translate(-50%, -130%);
          box-shadow: 0 6px 16px rgba(0,0,0,.2); white-space: nowrap; z-index: 2;
          text-align: center;
        }
        .mc-tooltip b { font-weight: 700; display: block; margin-bottom: 6px; }
        .mc-tooltip .mc-badges { display: flex; gap: 5px; justify-content: center; }
        .mc-leyenda {
          position: absolute; bottom: 16px; left: 16px; z-index: 1;
          background: rgba(255,255,255,.94);
          padding: 10px 14px; border-radius: 8px;
          box-shadow: 0 4px 14px rgba(0,0,0,.06); font-size: 12px; color: #6B7280;
          border: 1px solid #EEF1F6;
        }
        .mc-leyenda-escala { display: flex; gap: 4px; margin-top: 6px; }
        .mc-leyenda-bloque { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 11px; color: #9CA3AF; }
        .mc-leyenda-bloque span:first-child { width: 26px; height: 12px; border-radius: 2px; display: block; }

        .mc-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 48px; align-items: center; max-width: 1200px; margin: 0 auto; }
        .mc-info-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 900px) {
          .mc-grid { grid-template-columns: 1fr; gap: 40px; }
          .mc-info-cards { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="mc-grid">
        {/* Columna izquierda: texto + mapa */}
        <div>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, color: '#111827', letterSpacing: '-1.5px', lineHeight: 1.1, margin: 0 }}>
            Dónde trabajamos
          </h2>
          <p style={{ fontSize: 15, color: '#6B7280', marginTop: 12, marginBottom: 32, maxWidth: 440 }}>
            Más de 1.500 clientes activos en Navarra, La Rioja y Zaragoza
          </p>

          <div style={{ position: 'relative' }}>
            <svg ref={svgRef} style={{ width: '100%', display: 'block' }} />
            <div ref={tooltipRef} className="mc-tooltip" />


            {loading && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 14 }}>
                Cargando mapa…
              </div>
            )}

            {error && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 14 }}>
                No se pudo cargar el mapa.
              </div>
            )}
          </div>

          {/* Leyenda */}
          <div style={{ marginTop: 16, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Densidad */}
            <div>
              <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Densidad de clientes
              </span>
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
                {PALETA.map((color, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 22, height: 10, borderRadius: 2, background: color, display: 'block' }} />
                    <span style={{ fontSize: 9, color: '#9CA3AF', lineHeight: 1 }}>{ETIQUETAS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Servicios */}
            <div>
              <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Servicios presentes
              </span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {([
                  { bg: '#3B82F6', label: 'Limpieza', Icon: Sparkles },
                  { bg: '#EF4444', label: 'Plagas', Icon: Bug },
                  { bg: '#22C55E', label: 'Tienda', Icon: ShoppingBag },
                ] as const).map(({ bg, label, Icon }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={10} color="#fff" strokeWidth={2.5} />
                    </span>
                    <span style={{ fontSize: 11, color: '#6B7280' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha: información de apoyo */}
        <div>
          <div className="mc-info-cards">
            {INFO_CARDS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: '#ffffff',
                  border: '1px solid #EEF1F6',
                  borderRadius: 8,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  boxShadow: '0 1px 3px rgba(16,24,40,0.04)',
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 8,
                  background: '#EEF4FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color="#1A56DB" strokeWidth={2} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                  {title}
                </span>
                <span style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Users, MapPin, Building2, ShieldCheck } from 'lucide-react';
import { CLIENTES_MUNICIPIO } from '@/lib/clientes-municipio';

// --- Constantes fácilmente ajustables ---
const PALETA = ['#aec3ea', '#85a4dd', '#5c80cd', '#3458bd', '#1A56DB'];
const COLOR_BORDE_PROVINCIA = '#6B7E9E';
const TRAMOS = [1, 5, 20, 100];
const ETIQUETAS = ['0', '1-4', '5-19', '20-99', '100+'];
const ESPACIADO = 11; // px entre celdas
const LADO = 8.5; // tamaño de cada cuadradito
const CODIGOS_PROVINCIA = ['31', '26', '50']; // Navarra, La Rioja, Zaragoza
const ALTURA_MAPA = 520;

const INFO_CARDS = [
  { icon: Users, value: '+1.500', label: 'Clientes activos en cartera' },
  { icon: MapPin, value: '+170', label: 'Municipios con cobertura' },
  { icon: Building2, value: '3', label: 'Provincias: Navarra, La Rioja y Zaragoza' },
  { icon: ShieldCheck, value: '+20', label: 'Años de experiencia en el sector' },
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
          const height = ALTURA_MAPA;
          svg.attr('viewBox', `0 0 ${width} ${height}`);
          svg.selectAll('*').remove();

          const projection = d3.geoMercator().fitExtent(
            [[40, 30], [width - 40, height - 30]],
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

          const puntosGrid: PuntoGrid[] = [];
          for (let ix = 0; ix < cols; ix++) {
            for (let iy = 0; iy < rows; iy++) {
              const idx = provIndice[ix * rows + iy];
              if (idx === -1) continue;
              puntosGrid.push({ x: ix * ESPAC, y: iy * ESPAC, munic: municIndice[ix * rows + iy] });
            }
          }

          // Recorta la cuadrícula exactamente al contorno real de las provincias,
          // para que ningún cuadradito sobresalga del límite
          const path = d3.geoPath(projection);
          const clipId = `mc-clip-${Math.random().toString(36).slice(2)}`;
          svg.append('defs')
            .append('clipPath')
            .attr('id', clipId)
            .selectAll('path')
            .data(provincias)
            .join('path')
            .attr('d', path);

          svg.append('g')
            .attr('clip-path', `url(#${clipId})`)
            .selectAll('rect')
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
              tooltip.style('opacity', 1)
                .style('left', `${event.clientX - rect.left}px`)
                .style('top', `${event.clientY - rect.top}px`)
                .html(`<b>${(d.munic.feature.properties as { name: string }).name}</b><div class="mc-zona">${d.munic.clientes} cliente${d.munic.clientes === 1 ? '' : 's'}</div>`);
            })
            .on('mouseleave', () => tooltip.style('opacity', 0));

          // Contornos de provincia, por encima de la cuadrícula
          svg.append('g')
            .selectAll('path')
            .data(provincias)
            .join('path')
            .attr('d', path)
            .attr('fill', 'none')
            .attr('stroke', COLOR_BORDE_PROVINCIA)
            .attr('stroke-width', 1.5)
            .attr('stroke-linejoin', 'round')
            .style('pointer-events', 'none');
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
    <section style={{ background: '#F9FAFB', padding: '80px 24px' }}>
      <style>{`
        .mc-tooltip {
          position: absolute; pointer-events: none;
          background: rgba(17,24,39,.94); color: #fff;
          padding: 6px 12px; border-radius: 8px; font-size: 13px;
          opacity: 0; transition: opacity .15s; transform: translate(-50%, -130%);
          box-shadow: 0 6px 16px rgba(0,0,0,.2); white-space: nowrap; z-index: 2;
        }
        .mc-tooltip b { font-weight: 700; }
        .mc-tooltip .mc-zona { color: #D1D5DB; font-size: 11px; }
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

        .mc-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 56px; align-items: center; max-width: 1100px; margin: 0 auto; }
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
            Nuestra cartera de clientes
          </h2>
          <p style={{ fontSize: 15, color: '#6B7280', marginTop: 12, marginBottom: 32, maxWidth: 440 }}>
            Más de 1.500 clientes activos en Navarra, La Rioja y Zaragoza
          </p>

          <div style={{ position: 'relative' }}>
            <svg ref={svgRef} style={{ width: '100%', height: ALTURA_MAPA, display: 'block' }} />
            <div ref={tooltipRef} className="mc-tooltip" />

            {!loading && !error && (
              <div className="mc-leyenda">
                Nº de clientes por municipio
                <div className="mc-leyenda-escala">
                  {PALETA.map((c, i) => (
                    <div key={c} className="mc-leyenda-bloque">
                      <span style={{ background: c }} />
                      <span>{ETIQUETAS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
        </div>

        {/* Columna derecha: información de apoyo */}
        <div>
          <div className="mc-info-cards">
            {INFO_CARDS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                style={{
                  background: '#ffffff',
                  border: '1px solid #EEF1F6',
                  borderRadius: 8,
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  boxShadow: '0 1px 2px rgba(16,24,40,0.04)',
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 8,
                  background: '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color="#374151" strokeWidth={2} />
                </div>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#111827', letterSpacing: '-1px', lineHeight: 1 }}>
                  {value}
                </span>
                <span style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.4 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

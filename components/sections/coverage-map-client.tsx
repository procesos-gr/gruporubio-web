'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { FeatureCollection } from 'geojson';
import 'leaflet/dist/leaflet.css';

/* ─── GeoJSON simplificado de las 3 comunidades ─────────────────────── */

const COVERAGE_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Navarra' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-1.75, 43.45], [-0.25, 43.35], [0.72, 43.05],
          [0.72, 42.40], [-0.30, 41.90], [-1.80, 41.95],
          [-2.45, 42.30], [-2.40, 43.05], [-1.75, 43.45],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'La Rioja' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-3.10, 42.58], [-1.80, 42.58], [-1.75, 42.25],
          [-1.78, 41.90], [-3.05, 41.88], [-3.10, 42.58],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Aragón' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-2.45, 42.30], [-1.80, 41.95], [-0.30, 41.90],
          [0.72, 42.40], [0.72, 41.00], [0.50, 40.00],
          [-0.50, 39.52], [-1.80, 39.52], [-2.20, 40.00],
          [-2.45, 41.00], [-2.45, 42.30],
        ]],
      },
    },
  ],
};

const GEOJSON_STYLE = {
  color: '#4ade80',
  weight: 1.5,
  opacity: 0.85,
  fillColor: '#4ade80',
  fillOpacity: 0.28,
};

/* ─── Component ──────────────────────────────────────────────────────── */

export default function CoverageMapClient() {
  // Fix Leaflet's default icon path issue in Next.js
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer
      center={[40.4, -3.7]}
      zoom={5.5}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
      style={{ height: '420px', width: '100%', borderRadius: 8 }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        attribution="&copy; Stadia Maps"
      />
      <GeoJSON data={COVERAGE_GEOJSON} style={GEOJSON_STYLE} />
    </MapContainer>
  );
}

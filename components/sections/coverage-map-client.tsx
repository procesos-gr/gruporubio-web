'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = '/spain-communities.geojson';
const VISIBLE = ['Navarra', 'La Rioja', 'Aragon'];

export default function CoverageMapClient() {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Glow behind highlighted zones */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 55% 40% at 58% 42%, rgba(74,222,128,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [-1.2, 41.8], scale: 7500 }}
        style={{ width: '100%', height: '420px', position: 'relative', zIndex: 2 }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((geo) => VISIBLE.includes(geo.properties.name as string))
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(74,222,128,0.22)"
                  stroke="#4ade80"
                  strokeWidth={1.8}
                  style={{
                    default: {
                      outline: 'none',
                      filter: 'drop-shadow(0 0 8px rgba(74,222,128,0.6))',
                    },
                    hover:   { outline: 'none', fill: 'rgba(74,222,128,0.22)' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
          }
        </Geographies>
      </ComposableMap>

      {/* Grid overlay — subtle lines like sensoneo */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

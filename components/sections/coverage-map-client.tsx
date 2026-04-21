'use client';

import { memo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = '/spain-communities.geojson';
const SHOW = new Set(['Navarra', 'La Rioja', 'Aragon']);

export default memo(function CoverageMapClient() {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ center: [-1.2, 41.8], scale: 7500 }}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <pattern
          id="dots-active"
          x="0" y="0" width="7" height="7"
          patternUnits="userSpaceOnUse"
        >
          <rect x="1.8" y="1.8" width="3.4" height="3.4" fill="#7B9CF4" rx="0.6" />
        </pattern>
      </defs>

      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies
            .filter(g => SHOW.has(g.properties.name))
            .map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="url(#dots-active)"
                stroke="#546AE7"
                strokeWidth={1.5}
                style={{
                  default: { outline: 'none' },
                  hover:   { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
        }
      </Geographies>
    </ComposableMap>
  );
});

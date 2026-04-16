'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = '/spain-communities.geojson';
const HIGHLIGHTED = ['Navarra', 'La Rioja', 'Aragon'];

export default function CoverageMapClient() {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ center: [-3.7, 40.4], scale: 2800 }}
      style={{ width: '100%', height: '400px' }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const isHighlighted = HIGHLIGHTED.includes(geo.properties.name as string);
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={isHighlighted ? 'rgba(74,222,128,0.7)' : '#CBD5E1'}
                stroke={isHighlighted ? '#4ade80' : '#94A3B8'}
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none', fill: isHighlighted ? 'rgba(74,222,128,0.7)' : '#CBD5E1' },
                  pressed: { outline: 'none' },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}

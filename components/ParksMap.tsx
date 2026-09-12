"use client";
import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import statesTopo from "us-atlas/states-10m.json";

export type MappablePark = {
  name: string;
  state: string;
  lat: number;
  lon: number;
  visited: boolean;
};

// react-simple-maps renders to an SVG whose layout depends on client
// measurement, and mismatches server-rendered markup — this component is
// loaded with `next/dynamic(..., { ssr: false })` from app/parks/page.tsx
// specifically to avoid that hydration error, so it never runs on the server.
export default function ParksMap({ parks }: { parks: MappablePark[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border p-2">
      <ComposableMap projection="geoAlbersUsa" className="w-full h-auto">
        <Geographies geography={statesTopo as unknown as string}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#f3f4f6"
                stroke="#d1d5db"
                strokeWidth={0.5}
              />
            ))
          }
        </Geographies>
        {parks.map((p) => (
          <Marker key={p.name} coordinates={[p.lon, p.lat]}>
            <circle
              r={hovered === p.name ? 5 : 3.5}
              fill={p.visited ? "#16a34a" : "#ffffff"}
              stroke={p.visited ? "#15803d" : "#9ca3af"}
              strokeWidth={1}
              onMouseEnter={() => setHovered(p.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <title>
                {p.name} — {p.state}
                {p.visited ? " (visited)" : ""}
              </title>
            </circle>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

"use client";
import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import statesTopo from "us-atlas/states-10m.json";

export type MappableUnit = {
  name: string;
  category: string;
  state: string;
  lat: number;
  lon: number;
  visited: boolean;
};

const CATEGORY_COLOR: Record<string, string> = {
  "National Park": "#16a34a",
  "Historic Site/Park": "#2563eb",
  "Monument/Memorial": "#9333ea",
  "Battlefield/Military": "#b91c1c",
  "Recreation Area/Preserve": "#0d9488",
  "Seashore/Lakeshore": "#0ea5e9",
  "Trail/River/Other": "#a16207",
};

// Toggle label shorter than the full category name, for a compact control row.
const TOGGLE_LABEL: Record<string, string> = {
  "National Park": "National Parks",
  "Historic Site/Park": "Historic Sites",
  "Monument/Memorial": "Monuments",
  "Battlefield/Military": "Battlefields",
  "Recreation Area/Preserve": "Rec. Areas",
  "Seashore/Lakeshore": "Seashores",
  "Trail/River/Other": "Trails & Rivers",
};

// react-simple-maps renders to an SVG whose layout depends on client
// measurement, and mismatches server-rendered markup — this component is
// loaded with `next/dynamic(..., { ssr: false })` from app/parks/page.tsx
// specifically to avoid that hydration error, so it never runs on the server.
export default function ParksMap({
  units,
  categoryOrder,
}: {
  units: MappableUnit[];
  categoryOrder: string[];
}) {
  const [enabled, setEnabled] = useState<Set<string>>(() => new Set(["National Park"]));
  const [hovered, setHovered] = useState<string | null>(null);

  const visible = useMemo(
    () => units.filter((u) => enabled.has(u.category)),
    [units, enabled]
  );

  function toggle(category: string) {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {categoryOrder.map((category) => {
          const on = enabled.has(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => toggle(category)}
              className={
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition " +
                (on ? "border-transparent text-white" : "text-gray-500 hover:bg-gray-50")
              }
              style={on ? { backgroundColor: CATEGORY_COLOR[category] } : undefined}
              aria-pressed={on}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: on ? "white" : CATEGORY_COLOR[category] }}
              />
              {TOGGLE_LABEL[category] ?? category}
            </button>
          );
        })}
      </div>

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
          {visible.map((u) => (
            <Marker key={u.name} coordinates={[u.lon, u.lat]}>
              <circle
                r={hovered === u.name ? 5 : 3.5}
                fill={u.visited ? CATEGORY_COLOR[u.category] : "#ffffff"}
                stroke={CATEGORY_COLOR[u.category]}
                strokeWidth={1.25}
                onMouseEnter={() => setHovered(u.name)}
                onMouseLeave={() => setHovered(null)}
              >
                <title>
                  {u.name} — {u.state}
                  {u.visited ? " (visited)" : ""}
                </title>
              </circle>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}

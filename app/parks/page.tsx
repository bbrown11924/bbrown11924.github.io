import dynamic from "next/dynamic";
import unitsRaw from "@/data/nps-units.json";

// Loaded client-only: react-simple-maps measures its SVG on the client and
// mismatches server-rendered markup if hydrated normally.
const ParksMap = dynamic(() => import("@/components/ParksMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-2xl border text-sm text-gray-500">
      Loading map…
    </div>
  ),
});

type Unit = {
  name: string;
  category: string;
  type: string;
  state: string;
  region: string;
  visited: boolean;
  dateVisited?: string;
  lat?: number;
  lon?: number;
};

// Order both the map's toggle row and the sections below follow.
const CATEGORY_ORDER = [
  "National Park",
  "Historic Site/Park",
  "Monument/Memorial",
  "Battlefield/Military",
  "Recreation Area/Preserve",
  "Seashore/Lakeshore",
  "Trail/River/Other",
];

function formatDate(iso?: string) {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ParksPage() {
  const units = unitsRaw as Unit[];
  const mappable = units.filter((u) => u.lat != null && u.lon != null) as (Unit & {
    lat: number;
    lon: number;
  })[];

  const visitedCount = units.filter((u) => u.visited).length;

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">National Parks &amp; Sites</h1>
        <p className="text-gray-600">
          Tracking a visit to every stamp in the National Park Service
          system — not just the 63 National Parks, but Historic Sites,
          Monuments, Battlefields, and more.
        </p>
        <p className="text-sm font-medium">
          {visitedCount} of {units.length} visited
        </p>
      </header>

      <div className="space-y-2">
        <p className="text-xs text-gray-500">
          Click a category below to show it on the map. Only units with known
          coordinates can be pinned — every unit, mappable or not, is listed
          further down.
        </p>
        <ParksMap units={mappable} categoryOrder={CATEGORY_ORDER} />
      </div>

      {CATEGORY_ORDER.map((category) => {
        const inCategory = units.filter((u) => u.category === category);
        if (inCategory.length === 0) return null;
        const visitedInCategory = inCategory.filter((u) => u.visited).length;
        const sorted = inCategory.slice().sort((a, b) => a.name.localeCompare(b.name));

        return (
          <div key={category} className="space-y-2">
            <h2 className="flex items-baseline gap-2 border-b pb-1 text-lg font-semibold">
              {category}
              <span className="text-sm font-normal text-gray-500">
                {visitedInCategory} of {inCategory.length} visited
              </span>
            </h2>
            <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((u) => {
                const date = formatDate(u.dateVisited);
                return (
                  <div key={u.name} className="flex items-baseline gap-2 text-sm">
                    <span
                      className={u.visited ? "text-green-600" : "text-gray-300"}
                      aria-hidden
                    >
                      ●
                    </span>
                    <span className={u.visited ? "" : "text-gray-500"}>{u.name}</span>
                    <span className="text-xs text-gray-400">
                      {u.state}
                      {date ? ` · ${date}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

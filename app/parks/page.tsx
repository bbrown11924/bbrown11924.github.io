import dynamic from "next/dynamic";
import parksRaw from "@/data/parks.json";

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

type Park = {
  name: string;
  type: string;
  state: string;
  lat: number;
  lon: number;
  visited: boolean;
  dateVisited?: string;
};

// geoAlbersUsa only has a sensible projection for the 50 states — Samoa and
// the Virgin Islands are listed separately below instead of plotted.
const NOT_ON_MAP = new Set(["AS", "VI"]);

export default function ParksPage() {
  const parks = parksRaw as Park[];

  const mappable = parks.filter((p) => !NOT_ON_MAP.has(p.state));
  const territories = parks.filter((p) => NOT_ON_MAP.has(p.state));
  const visitedCount = parks.filter((p) => p.visited).length;
  const sorted = parks.slice().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">National Parks</h1>
        <p className="text-gray-600">
          Tracking a visit to every U.S. National Park. Edit{" "}
          <code>data/parks.json</code> — set <code>&quot;visited&quot;: true</code>{" "}
          (and optionally <code>dateVisited</code>) on a park to mark it here.
        </p>
        <p className="text-sm font-medium">
          {visitedCount} of {parks.length} visited
        </p>
      </header>

      <ParksMap parks={mappable} />

      <div className="flex items-center gap-4 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full border border-green-700 bg-green-600" />
          Visited
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full border border-gray-400 bg-white" />
          Not yet
        </span>
      </div>

      {territories.length > 0 && (
        <p className="text-sm text-gray-600">
          Not shown on the map above (outside the continental projection):{" "}
          {territories
            .map((t) => `${t.name}${t.visited ? " (visited)" : ""}`)
            .join(", ")}
          .
        </p>
      )}

      <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((p) => (
          <div key={p.name} className="flex items-baseline gap-2 text-sm">
            <span className={p.visited ? "text-green-600" : "text-gray-300"} aria-hidden>
              ●
            </span>
            <span className={p.visited ? "" : "text-gray-500"}>{p.name}</span>
            <span className="text-xs text-gray-400">{p.state}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

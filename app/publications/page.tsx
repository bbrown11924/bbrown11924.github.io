"use client";
import pubsRaw from "@/data/publications.json";
import { useMemo, useState } from "react";
import PublicationItem, { Pub } from "@/components/PublicationItem";
import SearchInput from "@/components/SearchInput";
import Select from "@/components/Select";
import Toggle from "@/components/Toggle";

type SortKey = "year-desc" | "year-asc" | "title-asc";

export default function PublicationsPage() {
  const pubs = (pubsRaw as Pub[]).filter(Boolean);

  // derive filter options
  const allYears = Array.from(
    new Set(pubs.map(p => p.year).filter(Boolean) as number[])
  ).sort((a, b) => b - a);

  const venues = Array.from(
    new Set(pubs.map(p => (p.venue || "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const tags = Array.from(
    new Set(pubs.flatMap(p => p.tags || []))
  ).sort((a, b) => a.localeCompare(b));

  // state
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<string>("All years");
  const [venue, setVenue] = useState<string>("All venues");
  const [tag, setTag] = useState<string>("All tags");
  const [oaOnly, setOaOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("year-desc");

  const yearOpts = ["All years", ...allYears.map(String)];
  const venueOpts = ["All venues", ...venues];
  const tagOpts = ["All tags", ...tags];
  const sortOpts: { value: SortKey; label: string }[] = [
    { value: "year-desc", label: "Newest" },
    { value: "year-asc", label: "Oldest" },
    { value: "title-asc", label: "Title A→Z" }
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let arr = pubs.filter(p => {
      const matchesQuery = !q || [
        p.title,
        p.venue,
        ...(p.authors || []),
        ...(p.tags || [])
      ].join(" ").toLowerCase().includes(q);

      const matchesYear = year === "All years" || String(p.year || "") === year;
      const matchesVenue = venue === "All venues" || (p.venue || "") === venue;
      const matchesTag = tag === "All tags" || (p.tags || []).includes(tag);
      const matchesOA = !oaOnly || !!p.open_access;

      return matchesQuery && matchesYear && matchesVenue && matchesTag && matchesOA;
    });

    switch (sort) {
      case "year-asc":
        arr = arr.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case "title-asc":
        arr = arr.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "year-desc":
      default:
        arr = arr.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
    }

    return arr;
  }, [pubs, query, year, venue, tag, oaOnly, sort]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Publications</h1>
        <p className="text-gray-600">
          Search and filter peer-reviewed papers, with quick links to DOI/PDF and copy-to-clipboard BibTeX.
        </p>
      </header>

      {/* Controls */}
      <div className="grid gap-3 rounded-2xl border p-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-3">
          <SearchInput value={query} onChange={setQuery} />
        </div>
        <Select value={year} onChange={setYear} options={yearOpts} label="Year" />
        <Select value={venue} onChange={setVenue} options={venueOpts} label="Venue" />
        <Select value={tag} onChange={setTag} options={tagOpts} label="Tag" />
        <Select
          value={sort}
          onChange={(v) => setSort(v as SortKey)}
          options={sortOpts.map(o => o.value)}
          label="Sort"
        />
        <div className="flex items-center">
          <Toggle checked={oaOnly} onChange={setOaOnly} label="Open Access only" />
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border p-6 text-sm text-gray-600">
            No results. Try clearing filters or adjusting your search.
          </div>
        ) : (
          filtered.map((p, i) => <PublicationItem key={i} p={p} />)
        )}
      </div>
    </section>
  );
}

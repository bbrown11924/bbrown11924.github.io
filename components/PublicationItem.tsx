import Badge from "./Badge";
import CitationButtons from "./CitationButtons";

export type Pub = {
  title: string;
  authors: string[];
  venue?: string;
  year?: number;
  doi?: string;
  url_pdf?: string;
  code_url?: string;
  data_url?: string;
  open_access?: boolean;
  tags?: string[];
  abstract?: string;
  bibtex?: string;
};

export default function PublicationItem({ p }: { p: Pub }) {
  return (
    <article className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-medium">{p.title}</h3>
        {p.year && <span className="rounded-full border px-2 py-0.5 text-xs">{p.year}</span>}
      </div>
      {(p.authors?.length || p.venue) && (
        <p className="mt-1 text-sm text-gray-600">
          {p.authors?.join(", ")}{p.venue ? <> — <em>{p.venue}</em></> : null}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        {p.open_access && <Badge>Open Access</Badge>}
        {p.code_url && <a className="underline text-xs" href={p.code_url} target="_blank">Code</a>}
        {p.data_url && <a className="underline text-xs" href={p.data_url} target="_blank">Data</a>}
        {p.tags?.map((t) => <Badge key={t}>{t}</Badge>)}
      </div>

      {p.abstract && (
        <p className="mt-3 text-sm text-gray-700">
          {p.abstract}
        </p>
      )}

      <CitationButtons doi={p.doi} pdf={p.url_pdf} bibtex={p.bibtex} />
    </article>
  );
}

import talksRaw from "@/data/talks.json";
import Badge from "@/components/Badge";

type Talk = {
  title: string;
  type?: string;
  event?: string;
  location?: string;
  date?: string; // "YYYY", "YYYY-MM", or "YYYY-MM-DD" — whatever precision is known
  slides_url?: string;
  video_url?: string;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(iso?: string) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  if (day) return `${MONTHS[month - 1]} ${day}, ${year}`;
  if (month) return `${MONTHS[month - 1]} ${year}`;
  return String(year);
}

export default function TalksPage() {
  const talks = (talksRaw as Talk[])
    .slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Talks</h1>
        <p className="text-gray-600">
          Invited and contributed talks, posters, and seminars. Edit{" "}
          <code>data/talks.json</code> to update this list.
        </p>
      </header>

      <ol className="space-y-4 border-l">
        {talks.map((t, i) => (
          <li key={i} className="ml-4 pb-2">
            <div className="-ml-[calc(1rem+5px)] mb-1 inline-block h-2.5 w-2.5 rounded-full bg-gray-400" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium">{t.title}</h3>
              {t.date && <span className="text-xs text-gray-500">{formatDate(t.date)}</span>}
            </div>
            <p className="text-sm text-gray-600">
              {[t.event, t.location].filter(Boolean).join(" — ")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {t.type && <Badge>{t.type}</Badge>}
              {t.slides_url && (
                <a className="text-xs underline" href={t.slides_url} target="_blank" rel="noreferrer">
                  Slides
                </a>
              )}
              {t.video_url && (
                <a className="text-xs underline" href={t.video_url} target="_blank" rel="noreferrer">
                  Video
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

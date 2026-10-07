import { getPage } from "@/lib/content";
import Prose from "@/components/Prose";
import { LinkIcon, type LinkKey } from "@/components/LinkIcons";
import { site } from "@/site.config";

const linkLabels: Record<LinkKey, string> = {
  email: "Email",
  scholar: "Google Scholar",
  orcid: "ORCID",
  github: "GitHub",
  researchgate: "ResearchGate",
};

// Display order for the link cards; anything left blank in site.config.ts is skipped.
const linkOrder: LinkKey[] = ["email", "scholar", "orcid", "researchgate", "github"];

function linkDetail(key: LinkKey, value: string) {
  if (key === "email") return value;
  if (key === "orcid") return value.replace(/^https?:\/\/orcid\.org\//, "");
  return "View profile";
}

export default async function ContactPage() {
  const { frontmatter, html } = await getPage<{ title: string }>("contact");

  const entries = linkOrder
    .map((key) => [key, site.links[key]] as const)
    .filter(([, value]) => value);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">{frontmatter.title}</h1>
      <Prose html={html} />

      <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
        {entries.map(([key, value]) => {
          const external = key !== "email";
          return (
            <li key={key}>
              <a
                href={external ? value : `mailto:${value}`}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="flex items-center gap-4 rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                  <LinkIcon name={key} />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium">{linkLabels[key]}</span>
                  <span className="block truncate text-sm text-gray-500">{linkDetail(key, value)}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

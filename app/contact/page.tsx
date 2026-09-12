import { getPage } from "@/lib/content";
import Prose from "@/components/Prose";
import { site } from "@/site.config";

const linkLabels: Record<keyof typeof site.links, string> = {
  email: "Email",
  scholar: "Google Scholar",
  orcid: "ORCID",
  github: "GitHub",
  researchgate: "ResearchGate",
};

export default async function ContactPage() {
  const { frontmatter, html } = await getPage<{ title: string }>("contact");

  const entries = Object.entries(site.links).filter(([, value]) => value) as [
    keyof typeof site.links,
    string
  ][];

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">{frontmatter.title}</h1>
      <Prose html={html} />

      <ul className="space-y-2 text-sm">
        {entries.map(([key, value]) => (
          <li key={key}>
            <span className="inline-block w-32 text-gray-500">
              {linkLabels[key]}
            </span>
            {key === "email" ? (
              <a className="underline" href={`mailto:${value}`}>{value}</a>
            ) : (
              <a className="underline" href={value} target="_blank" rel="noreferrer">{value}</a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

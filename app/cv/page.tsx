import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "CV" };

export default async function CvPage() {
  const { frontmatter, html } = await getPage<{ title: string; pdfUrl?: string }>("cv");

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{frontmatter.title}</h1>
        {frontmatter.pdfUrl && (
          <a
            href={frontmatter.pdfUrl}
            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Download PDF
          </a>
        )}
      </header>

      <Prose html={html} />
    </section>
  );
}

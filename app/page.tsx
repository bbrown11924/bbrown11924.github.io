import Link from "next/link";
import { getPage } from "@/lib/content";
import Prose from "@/components/Prose";

type HomeFrontmatter = {
  headline: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export default async function Home() {
  const { frontmatter, html } = await getPage<HomeFrontmatter>("home");

  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-bold">{frontmatter.headline}</h1>
      <p className="text-lg text-gray-600">{frontmatter.subtitle}</p>

      <Prose html={html} />

      <div className="mt-4 flex gap-3">
        {frontmatter.primaryCta && (
          <Link
            href={frontmatter.primaryCta.href}
            className="rounded-xl bg-gray-900 px-4 py-2 text-white"
          >
            {frontmatter.primaryCta.label}
          </Link>
        )}
        {frontmatter.secondaryCta && (
          <Link
            href={frontmatter.secondaryCta.href}
            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
          >
            {frontmatter.secondaryCta.label}
          </Link>
        )}
      </div>
    </section>
  );
}

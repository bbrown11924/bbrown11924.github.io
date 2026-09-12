import Link from "next/link";
import { getPage } from "@/lib/content";
import Prose from "@/components/Prose";
import VortexField from "@/components/VortexField";

type HomeFrontmatter = {
  headline: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export default async function Home() {
  const { frontmatter, html } = await getPage<HomeFrontmatter>("home");

  return (
    <div className="space-y-10">
      <section className="relative -mx-4 min-h-[440px] overflow-hidden rounded-3xl border sm:mx-0 sm:min-h-[520px]">
        <VortexField className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="relative z-10 flex h-full min-h-[440px] flex-col justify-center gap-5 px-6 py-16 sm:min-h-[520px] sm:px-14">
          <h1 className="text-4xl font-bold sm:text-5xl">{frontmatter.headline}</h1>
          <p className="max-w-md text-lg text-gray-600">{frontmatter.subtitle}</p>
          <div className="mt-2 flex gap-3">
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
                className="rounded-xl border bg-white/70 px-4 py-2 backdrop-blur hover:bg-white"
              >
                {frontmatter.secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </section>

      <Prose html={html} className="max-w-2xl" />
    </div>
  );
}

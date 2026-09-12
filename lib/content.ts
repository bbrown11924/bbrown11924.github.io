import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

/**
 * Content layer: turns the plain files in /content into typed data the page
 * components can render. This is the only file that should know about the
 * filesystem layout of /content — pages just call these helpers.
 *
 * Two shapes are supported:
 *  - a single page:      content/pages/<slug>.md   -> getPage(slug)
 *  - a collection:       content/<collection>/*.md -> getCollection(collection)
 *
 * Every file is Markdown with YAML frontmatter, e.g.:
 *
 *   ---
 *   title: My title
 *   order: 1
 *   ---
 *   Body text in **Markdown** goes here.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ContentEntry<Frontmatter> = {
  /** filename without the .md extension */
  slug: string;
  frontmatter: Frontmatter;
  /** frontmatter body rendered to sanitized-ish HTML (GitHub-flavored Markdown) */
  html: string;
};

async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(remarkGfm).use(html).process(markdown);
  return processed.toString();
}

/** Read + render a single content/pages/<slug>.md file. */
export async function getPage<Frontmatter = Record<string, unknown>>(
  slug: string
): Promise<ContentEntry<Frontmatter>> {
  const filePath = path.join(CONTENT_DIR, "pages", `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    frontmatter: data as Frontmatter,
    html: await markdownToHtml(content),
  };
}

/**
 * Read + render every .md file directly under content/<collection>/.
 * Sorted by frontmatter.order (ascending) when present, otherwise by slug.
 */
export async function getCollection<Frontmatter = Record<string, unknown>>(
  collection: string
): Promise<ContentEntry<Frontmatter>[]> {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const entries = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        frontmatter: data as Frontmatter,
        html: await markdownToHtml(content),
      };
    })
  );

  return entries.sort((a, b) => {
    const orderA = (a.frontmatter as any).order;
    const orderB = (b.frontmatter as any).order;
    if (orderA != null && orderB != null) return orderA - orderB;
    return a.slug.localeCompare(b.slug);
  });
}

/** All slugs in a collection — handy for generateStaticParams on [slug] routes. */
export function getCollectionSlugs(collection: string): string[] {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

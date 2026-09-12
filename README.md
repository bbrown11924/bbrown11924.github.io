# physicist-portfolio

A personal academic website: Next.js (App Router), Tailwind CSS, exported as
a plain static site (no server required) so it can be hosted anywhere,
including GitHub Pages.

**Updating the content day-to-day?** See [CONTENT.md](CONTENT.md) — that's
the doc for editing publications, talks, pages, etc. without touching code.

## Stack

- **Next.js 14** (App Router) with `output: "export"` — builds to plain
  static HTML/CSS/JS in `out/`, no Node server needed at deploy time.
- **Tailwind CSS** for styling, incl. `@tailwindcss/typography` for the
  Markdown-rendered pages.
- **gray-matter** + **remark** for Markdown-with-frontmatter content files.
- **react-simple-maps** + **us-atlas** for the National Parks map (client-only — see `components/ParksMap.tsx`).

## Project layout

```
app/                Routes (one folder per page, Next.js file-based routing)
components/         Shared React components
content/            Editable Markdown content (see CONTENT.md)
data/               Editable JSON content: publications.json, talks.json, parks.json
lib/                Content-loading helpers (lib/content.ts)
site.config.ts       Site-wide settings: name, nav, contact links
```

## Development

```bash
npm install
npm run dev      # http://localhost:3000, hot-reloads on save
```

## Building

```bash
npm run build    # type-checks, lints, and outputs the static site to out/
```

`out/` is what you'd deploy — e.g. to GitHub Pages. If deploying to a GitHub
Pages *project* site (`username.github.io/repo-name`), set
`NEXT_PUBLIC_BASE_PATH=/repo-name` before building so asset paths resolve
correctly (see `next.config.mjs`). Deployment isn't wired up yet — that's a
separate step for when you're ready to publish.

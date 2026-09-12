# Updating this site

This is a static site (Next.js, exported to plain HTML/CSS/JS — see
[README.md](README.md) for the tech overview). Most day-to-day updates don't
touch any page code — you edit a file in `content/` or `data/` and the
relevant page picks it up automatically.

There are three kinds of content, matched to three kinds of files:

## 1. Lists of structured items → JSON in `data/`

Use this for things that are basically a table: publications, talks. Each
entry is one object in a JSON array.

- [`data/publications.json`](data/publications.json) — add a new paper by
  copying an existing entry and editing the fields (`title`, `authors`,
  `venue`, `year`, `doi`, `url_pdf`, `tags`, `abstract`, `bibtex`, ...).
- [`data/talks.json`](data/talks.json) — same idea for talks/posters
  (`title`, `type`, `event`, `location`, `date` as `YYYY`, `YYYY-MM`, or
  `YYYY-MM-DD` — whatever precision you actually know, `slides_url`,
  `video_url`).
- [`data/nps-units.json`](data/nps-units.json) — the National Parks &amp;
  Sites tracker (under the "Personal" nav menu), covering the full NPS
  system: National Parks, Historic Sites, Monuments, Battlefields,
  Recreation Areas, Seashores/Lakeshores, and trails/rivers/misc. Set
  `"visited": true` on a unit (and add `"dateVisited"`: `"YYYY-MM-DD"`) to
  mark it visited — it updates its section's count and, if it has
  coordinates, colors its map pin in. Each entry has:
  - `name`, `category` (one of the 7 section names — must match one in
    `CATEGORY_ORDER` in `app/parks/page.tsx` to appear), `type` (a more
    specific label, e.g. "National Historic Site"), `state`, `region`.
  - `lat`/`lon` — **optional**. Only units with both show a pin on the map;
    every unit shows in its category's list below regardless. To add a pin,
    look up the coordinates on the unit's NPS.gov page or Wikipedia.
  Seeded from the official 63 National Parks plus the ~360 other NPS units
  (from a National Park Travelers Club checklist) with their categories and
  states — most don't have coordinates yet, so they list-only until you (or
  I) add some.

Just keep it valid JSON (matching commas, quotes). If a page shows nothing or
errors after an edit, that's almost always a stray/missing comma.

## 2. One-off prose pages → Markdown in `content/pages/`

Use this for pages that are mostly text: Home, CV, Contact. Each file has a
`---`-fenced frontmatter block for structured fields, followed by Markdown
body text.

- [`content/pages/home.md`](content/pages/home.md) — headline, subtitle, and
  the two homepage buttons, plus a short bio.
- [`content/pages/cv.md`](content/pages/cv.md) — the whole CV as Markdown
  (headings, bullet lists, and tables all work).
- [`content/pages/contact.md`](content/pages/contact.md) — the blurb above
  your contact links.

## 3. Collections of similar pages → Markdown files in `content/<name>/`

Use this when you have several similar items that each deserve their own
page — right now that's instruments, in `content/instruments/`. Each `.md`
file there becomes one card on `/instruments` *and* its own detail page at
`/instruments/<filename>`.

To add an instrument: copy
[`content/instruments/cryogenic-magnetometer.md`](content/instruments/cryogenic-magnetometer.md)
to a new filename, edit the frontmatter (`title`, `summary`, `tags`, `order`)
and the body. To remove one, delete the file. This is a good pattern to reuse
later for e.g. "Projects" or "Courses" — see below.

## Global settings: name, nav bar, contact links

[`site.config.ts`](site.config.ts) is the one place your name, tagline, nav
bar entries, and social/contact links live. Changing it updates the nav bar,
page titles, footer, and Contact page everywhere at once.

The nav bar is a row of dropdowns, one per entry in `site.navGroups` — each
`{ label, items }` group becomes a "Label ▾" menu. Add a page to an existing
group with another `{ href, label }` in its `items`, or start a whole new
group (e.g. "Projects") by adding another entry to `navGroups`.

## Adding a brand-new, differently-shaped page

Because this is Next.js's file-based routing, a new page is just a new
folder:

1. Create `app/<route>/page.tsx` (copy the simplest existing one, e.g.
   [`app/contact/page.tsx`](app/contact/page.tsx), as a starting point).
2. Build whatever that page needs — it can be completely different from
   every other page (a photo gallery, an embedded map, a custom layout —
   nothing about the framework forces pages to look alike).
3. If it should appear in the nav bar, add `{ href: "/<route>", label: "..." }`
   to `site.config.ts`.
4. If it's a *collection* of similar sub-pages (like Instruments), use
   `getCollection("<name>")` from [`lib/content.ts`](lib/content.ts) with a
   new `content/<name>/` folder, and add a matching
   `app/<route>/[slug]/page.tsx` (copy
   [`app/instruments/[slug]/page.tsx`](app/instruments/%5Bslug%5D/page.tsx)).

## Running and shipping it

```bash
npm run dev      # local dev server at http://localhost:3000, hot-reloads on save
npm run build    # type-checks + produces the static site in out/
```

`npm run build` is what you'd point GitHub Pages (or any static host) at —
it needs no server, just the files in `out/`. We haven't wired up deployment
yet; that's a separate step for when you're ready to publish.

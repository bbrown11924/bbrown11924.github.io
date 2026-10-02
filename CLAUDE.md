# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Benjamin J. Brown's personal/academic site (Ph.D. candidate in Physics,
Brown University — magnetic tunnel junction sensors, vortex-state
spintronics, cryogenic instrumentation). Next.js 14 (App Router) +
TypeScript + Tailwind, built with `output: "export"` — it compiles to a
plain static site in `out/` with no server at runtime, and deploys to
GitHub Pages as a **user site** (`bbrown11924.github.io`, served from the
domain root).

Two docs the user leans on day-to-day — read them before making content or
structural changes:
- [README.md](README.md) — stack and project layout.
- [CONTENT.md](CONTENT.md) — the content model explained to the user in
  plain terms (what's a JSON file vs. a Markdown file vs. code). Keep it
  in sync with reality whenever the content system changes.

## Commands

```bash
npm install
npm run dev            # local dev server at http://localhost:3000, hot-reloads
npm run build           # type-checks, lints, and outputs the static site to out/
npx tsc --noEmit        # fast typecheck only, no build — use this while iterating
npm run lint             # eslint
```

There is no test suite. Always run `npx tsc --noEmit` after any non-trivial
change, and `npm run build` before considering a feature done — several
real bugs in this repo (hydration mismatches, a `flex`-swallowed-whitespace
layout bug) only showed up when actually checking the build/browser output,
not from reading the diff.

Deployment is automatic: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
builds and publishes to GitHub Pages on every push to `master`. No manual
deploy step. If this ever becomes a project site instead of a user site,
set `NEXT_PUBLIC_BASE_PATH=/<repo-name>` (see `next.config.mjs`) — right
now it's intentionally unset.

## Content architecture

The whole point of this codebase is that the user can update most content
without touching code. Three patterns, picked per content type:

1. **Tabular/structured lists → JSON in `data/`** (`publications.json`,
   `talks.json`, `nps-units.json`, `games.json`). Pages import these
   directly and filter/group in-component.
2. **One-off prose pages → Markdown+frontmatter in `content/pages/`**
   (`home.md`, `cv.md`, `contact.md`), loaded via `getPage()` in
   [`lib/content.ts`](lib/content.ts) (gray-matter + remark/remark-gfm),
   rendered through [`components/Prose.tsx`](components/Prose.tsx).
3. **Collections of similar sub-pages → Markdown files in `content/<name>/`**,
   loaded via `getCollection()` / `getCollectionSlugs()` in the same file.
   `content/instruments/` still exists from early in the project but
   currently has **no route serving it** — the Instruments page was
   removed from `site.config.ts`'s nav by request. If asked to bring it
   back, the content is already there; just needs `app/instruments/page.tsx`
   + `app/instruments/[slug]/page.tsx` again.

`site.config.ts` is the single source of truth for site name/tagline,
contact links, and the nav bar. The nav is **grouped dropdowns**, not a
flat list: `site.navGroups` is `{ label, items }[]`, rendered by a single
generic `NavDropdown` inside [`components/NavBar.tsx`](components/NavBar.tsx).
There's a "Professional" group and a "Personal" group — a new top-level nav
item means adding to one of these (or adding a new group), not patching
NavBar itself.

A brand-new, structurally different page is just `app/<route>/page.tsx` —
nothing about the framework forces pages to share a layout.

## Interactive figures are physically/mathematically derived, not decorative

This is the strongest convention in the codebase and should be followed for
any new interactive visualization: the math lives in its own `lib/*.ts`
module, derived from real physics, with the derivation written out in a
comment — not an arbitrary animation that merely looks plausible.

- [`lib/mtj.ts`](lib/mtj.ts) — the macrospin TMR sensor model behind
  [`components/research/MtjSensorDemo.tsx`](components/research/MtjSensorDemo.tsx).
- [`lib/vortex.ts`](lib/vortex.ts) — the vortex-core-displacement-is-
  perpendicular-to-field derivation behind
  [`components/research/VortexSensorDemo.tsx`](components/research/VortexSensorDemo.tsx).
- [`components/VortexField.tsx`](components/VortexField.tsx) — the home
  page's cursor-reactive hero background, same underlying field math as
  the vortex research figure.

When adding to `/research`, build a new component under
`components/research/` (reuse [`useFieldDrag.ts`](components/research/useFieldDrag.ts)
for drag-a-field-vector interactions and [`MomentArrow.tsx`](components/research/MomentArrow.tsx)
for drawing moment/field arrows) and add an `<article>` block for it in
`app/research/page.tsx`.

Known sharp edge hit twice in this codebase: raw `Math.cos`/`Math.sin`
results can differ in their last bit between server (Node) and client
(browser) V8 builds. With full float precision in an SVG coordinate, that's
a real React hydration mismatch (`lib/gearPath.ts`'s `n()` helper — now
only on the unmerged `clock-animation` branch — exists specifically to
round trig output before it reaches a JSX attribute). Any new
canvas/SVG math component computing coordinates from `Math.cos`/`sin`
should round before rendering if the component can be server-rendered.

## Git workflow this user has established

New, visually/structurally risky features get their own branch, built and
verified (typecheck + build + actually driving it in the browser, not just
reading the diff) before asking the user to review; they merge explicitly
("merge it") rather than auto-merging. Small fixes and docs/config land
directly on `master`. `clock-animation` is a deliberately unmerged branch —
a full scroll-driven mechanical-clock hero that the user tried and decided
against; left as-is for reference/salvage, not meant to be merged.

## Browser verification conventions

This project's dev server is started via `.claude/launch.json` +
`preview_start`. Two recurring gotchas worth knowing before debugging
"phantom" issues:
- A screenshot taken in the same browser tab shortly after a big edit can
  show stale/ghosted content (most often around the sticky nav) even
  though the live DOM is correct — close the tab and open a fresh one (or
  re-run `preview_start`) before trusting a screenshot that looks wrong.
- `rm -rf .next` while a dev server (yours or one the user already has
  running) is live corrupts its build manifest (404s on chunk requests).
  Check `netstat -ano | grep LISTENING | grep ":3000 "` before starting a
  preview server, and avoid wiping `.next` out from under a server that's
  still running.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static portfolio site for María Ignacia Delfau (UX/UI Designer). Plain HTML/CSS/vanilla JS — no framework, no build step, no package manager.

## Commands

There is no build/lint/test tooling. To preview locally, serve the folder statically from the repo root, e.g.:

```
python3 -m http.server 8000
```

then open `index.html`. `wrangler.jsonc` is present (Cloudflare config) but there's no `package.json` or `node_modules` — it looks unused.

### Publishing

This folder is a git repo wired to `github.com/ignaciadelfau/ignaciadelfau.github.io`. To publish:

```
git add -A && git commit -m "..." && git push
```

GitHub Pages rebuilds automatically (~1 min) and serves `ignaciadelfau.com`. **Never upload files through the GitHub web UI** — that's what previously created the `assets ` folder (trailing space, which 404'd every image on the live site), an `index_1.html` duplicate, and 9 stray `prueba` placeholder files.

Two things that must never be deleted from the repo root:
- `CNAME` — holds `ignaciadelfau.com`; without it the custom domain stops resolving.
- `_config.yml` — keeps `CLAUDE.md`, `README.md` and `wrangler.jsonc` out of the published site.

Auth gotcha: this Mac also has a `nachotono` GitHub account, which has **read-only** access to this repo. If a push is rejected, check `gh api user --jq .login` and switch with `gh auth switch -u ignaciadelfau`.

## Architecture

### Pages
- `index.html` — home. Hero + a "solar carousel" of project cards. **The cards are not in the HTML** — they're built entirely by JS from a data array (see below).
- `about.html`
- `project.html` — the original/generic case-study template (B2E Inspection Tool). Good reference for the full shared component set.
- `project-<name>.html` — one per case study (`openbank`, `unification`, `rebrand`, `garage`). All share the same CSS component system but each has its own bespoke sections too.

### CSS
- `css/style.css` — design tokens (`:root` variables), nav, home page, global resets.
- `css/project.css` — shared case-study component library (classes prefixed `cs-`: `cs-hero`, `cs-wrap`, `cs-section-head`, `cs-meta`, `cs-challenge`, `cs-phases`, `cs-persona-grid`, `cs-figure-scroll`, etc.), used across all `project-*.html` pages. Project-specific, one-off sections are appended at the **bottom** of this same file under a comment banner (e.g. `GARAGE BEER — video embed + persona cards + type specimen`) rather than living in a separate file. When adding bespoke styling for a project, append it there instead of splicing it into the shared block above.
- `css/about.css` — about page only.
- Per-project brand color: `<body class="case-body case-<project>">` and in `project.css`:
  ```css
  .case-<project> { --cs-accent: #HEX; }
  ```
  This single variable re-skins buttons, underlines, tags, etc. for that case study.

### JS (`js/main.js`)
- `PROJECTS` array is the single source of truth for the homepage project list (`id`, `title`, `tags`, `dest`, `locked`, `img`). `index.html` has no hardcoded cards — `SolarCarousel` reads this array and builds/positions them. **To add, remove, or reorder a homepage project, edit this array — not `index.html`.**
- Access control is a **single global password** (`SITE_PASSWORD`) that unlocks every `locked: true` card for the browser session (`sessionStorage`), not per-project passwords.
- Each `project-*.html` file has its own small inline `<script>` at the bottom (an `IntersectionObserver` over `.cs-reveal` elements for scroll-in animation). This is duplicated per file rather than centralized in `main.js` — copy it when creating a new project page.

### Adding a new case-study project
1. Duplicate an existing `project-<name>.html` (`project-garage.html` is a reasonably simple starting point) → rename it.
2. Set `<body class="case-body case-<name>">` and add `.case-<name> { --cs-accent: #HEX; }` to `project.css`.
3. Reuse existing `cs-` classes wherever the layout matches; only add new bespoke classes (appended at the end of `project.css`) for sections that don't fit the shared system.
4. Put images in `assets/images/<name>/`.
5. Register the project in the `PROJECTS` array in `js/main.js`, including a homepage thumbnail (existing thumbnails live at `assets/images/project-N.jpg`).
6. Remember there's no auto-deploy — upload to GitHub manually when ready to publish.

## Design tokens (`css/style.css` `:root`)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Base background |
| `--ink` | `#111111` | Primary text |
| `--ink-muted` | `#555555` | Secondary text |
| `--ink-faint` | `#999999` | Tertiary/label text |
| `--blue` | `#1000FF` | Secondary/accent color (home page) |
| `--blue-a11y` | `#0500CC` | Accessible-contrast version of blue |
| `--yellow` | `#FAC601` | Decorative only (hero gradient) |
| `--font-display` | `Syne` | Headlines |
| `--font-body` | `Montserrat` | Body/UI text |

Case-study pages additionally use `--cs-accent` (set per project, see above).

## Image conventions

Learned while building the Garage Beer page — worth checking for every new project:
- Exported mockup PNGs sometimes carry a stray solid-black bar from a cropped screenshot tool. Before using an image, worth a quick check (a fully black row of pixels near an edge = crop it out) rather than assuming an exported asset is clean.
- Device "screen" mockups (laptop/phone frames) are transparent PNGs with their own baked-in drop shadow. Don't add `box-shadow`/`border-radius` in CSS on top of them — that styling is for older flat rectangular screenshots only.
- Diagrams (e.g. the Garage Beer sitemap, `assets/images/garage/sitemap.svg`) are hand-built inline SVG rather than a screenshot — renders crisp at any size and can use `--cs-accent` exactly. Prefer this over screenshotting a Figma diagram when a project needs a new one.

## Brand assets (favicon + social preview)

`favicon.ico`, `favicon-32.png` and `apple-touch-icon.png` are the logo mark knocked out in white on a `#1000FF` tile. `assets/images/og-image.jpg` (1200×630) is the card shown when the link is shared on LinkedIn/WhatsApp, set with NeutraText and the brand blue.

All four are **generated**, not hand-made — regenerate with:

```
python3 tools/generar-favicons.py    # only if the logo changes
python3 tools/generar-og-image.py    # if the name or tagline changes
```

Both scripts are deterministic (same input → byte-identical output) and need Pillow. The name/tagline live at the top of `generar-og-image.py`; if you change them there, also update the `og:title` / `og:description` meta tags, which are duplicated across all 7 pages.

## Standing decisions

- **Unused images stay.** ~38 files (~7 MB), mostly `assets/images/unification/` (`workshop-flow.png`, `hero-persona-journey.png`, `ai-channels-tiers.png`) plus the `.png` twins of the Garage `.svg` personas. Ignacia asked to keep them as archived source material (2026-08-09). They cost nothing in page weight — a browser never requests them. **Do not "clean them up".**
- **The password is deliberately weak for now.** `SITE_PASSWORD = 'Carlos'` is readable in plain text in `js/main.js` from any browser's view-source. This is known and accepted as a casual screen, not security. Don't present locked projects as NDA-safe.

## Known gotchas
- The `g-row` / `g-img` gallery system still exists in `style.css` and `project.css` but is **dead CSS** — no HTML page uses it anymore. The live layout system is the `cs-` component library.
- `wrangler.jsonc` exists but there's no `package.json`/lockfile — it's vestigial. The real deploy path is `git push` (see Publishing above); Cloudflare is not involved.
- `assets/images/face.jpg` and `about-portrait.jpg` are the same photo at different sizes: `face.jpg` is a 400×400 crop for the tiny bubble in the "o" of *Hello*, `about-portrait.jpg` is the full 3:4 portrait. Not a duplicate to dedupe.
- Never add `target="_blank"` to a `mailto:` link. The browser tries to open the mail compose UI in a new tab instead of just invoking the mail handler, which shows up as a blank tab (fixed on the "Hit me up!" button and two footer `Email` links, 2026-08-09). Plain `<a href="mailto:...">` with no `target` is correct — clicking it opens whatever mail client (native app or webmail) the visitor's browser/OS has registered for the `mailto:` scheme.

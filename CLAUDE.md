---
name: astro-static-site
description: >
  Use this skill every time you need to create, modify, or extend a static site with Astro.
  Triggers for: new Astro projects, adding UI components (nav, hero, card, form, modal, footer),
  multilingual i18n configuration, GitHub Actions deploy setup, CSS management with custom properties,
  responsive design with CSS Grid. Use this skill even if the user mentions only part of the system
  (e.g. "add a navbar" or "set up automatic deploy") — architectural principles must remain
  consistent throughout the project.
---

# Astro Static Site Skill

Static site with Astro, Vanilla JS, pure CSS, native i18n, accessibility and deploy on GitHub Pages.

For details of each area, read the files in `references/` when relevant to the request.

---

## Project identity

- **Full title**: Beacon — Building a Visual Alphabet for the European Values
- **Project code**: BIP 2024-1-IT02-KA131-HED-000197121-2
- **Logo**: `public/beacon_logo.svg` (sourced from `references/assets/beacon_logo.svg`)
- **Partner logos**: `public/partners/*.png` (9 logos, sourced from `references/assets/partnersLogo/`)

---

## Stack and core constraints

- **Build tool**: Astro (only `.astro` components, no React/Vue/Svelte)
- **CSS**: Pure, no framework. Custom properties for all values. Never pixels, always `rem`.
- **JS**: Vanilla JS. No framework. Separate scripts per component.
- **i18n**: Native Astro i18n with routing `/` (en), `/it/`, `/pl/`
- **Deploy**: GitHub Actions → GitHub Pages (no base path)

---

## State of the project (2026-06-10)

### Decisions taken
- **Default language changed to English** (`defaultLocale: 'en'`). English is served at `/`, Italian at `/it/`, Polish at `/pl/`.
- **`/en/` pages removed** — redundant since English is the default locale.
- **`/it/` pages created** — Italian locale pages at `src/pages/it/`.
- **`/bip` base removed** — `base: '/bip'` removed from `astro.config.mjs`. Site now serves from `/`.
- **Page content moved to Markdown sources** — content-heavy pages now read from locale-specific `.md` files in `src/content/` via Astro Content Collections.
- **Content collections added** — `src/content.config.ts` defines `home`, `program`, `lectures`, `projects`, and `about` collections, with frontmatter schemas and explicit `glob()` loaders.
- **Thin page wrappers** — `.astro` route files now mostly load locale content with `getEntry()` + `render(entry)` and render the result inside shared layouts/components.
- **Beacon logo** added to `public/beacon_logo.svg` and used in `Header.astro` as `<img>` tag. Old text "BIP" logo replaced.
- **Partner logos** added to `public/partners/` (9 PNG files). Home page now shows a logo grid with hover color reveal.
- **Homepage hero video** added using `public/mondello.mp4` as background media in `Hero.astro`.
- **Homepage logo behavior** changed: header logo is hidden on homepages only, and a logo overlay inside the hero appears only after user scroll.
- **Hero title/subtitle** updated in all three JSON translation files to use the full project title and project code.
- **Favicon** updated to use `beacon_logo.svg`.
- **Google Analytics** installed, gated behind a GDPR cookie-consent banner (`src/components/CookieConsent.astro` + `src/components/Analytics.astro`). GA only loads after the visitor accepts; the "Cookie preferences" link in the footer reopens the banner. Measurement ID is read from `PUBLIC_GA_MEASUREMENT_ID`, set via the `GA_MEASUREMENT_ID` GitHub secret in `.github/workflows/deploy.yml`.

### Build status
- `npm run build` — ✓ 15 pages built successfully (5 pages × 3 locales)
- Routes: `/`, `/program/`, `/lectures/`, `/projects/`, `/about/` (English) + `/it/*` + `/pl/*`

---

## Project architecture

The project architecture is described in /architecture.md.
The contents inside /contents populate the site sections (Program, Lectures, About) and the details of
the partners and students involved, sourced from .md and .pdf files in references.
Do not generate invented content — only use what is present in the reference files.
If sections are missing, insert a placeholder with a description of the missing content.

---

## Project structure

```
/
├── public/
│   ├── beacon_logo.svg     # Site logo
│   ├── partners/           # Partner logos (9 × PNG)
│   └── fonts/              # (unused — News Cycle loaded from Google Fonts)
├── src/
│   ├── assets/
│   ├── components/         # One .astro file per component
│   ├── content/            # Locale-specific Markdown sources per page/collection
│   │   ├── home/
│   │   ├── program/
│   │   ├── lectures/
│   │   ├── projects/
│   │   └── about/
│   ├── content.config.ts   # Astro Content Collections config
│   ├── i18n/
│   │   ├── en.json         # Default language (English) UI strings
│   │   ├── it.json
│   │   ├── pl.json
│   │   └── utils.ts        # Helper useTranslations(), defaultLocale = 'en'
│   ├── layouts/
│   │   └── Base.astro
│   ├── pages/
│   │   ├── index.astro     # English (default, no prefix)
│   │   ├── program.astro
│   │   ├── lectures.astro
│   │   ├── projects.astro
│   │   ├── about.astro
│   │   ├── it/             # Italian locale wrappers
│   │   └── pl/             # Polish locale wrappers
│   └── styles/
│       ├── tokens.css
│       ├── reset.css
│       ├── typography.css
│       ├── utilities.css
│       └── components/
├── .github/
│   └── workflows/
│       └── deploy.yml
└── astro.config.mjs        # no base path, defaultLocale: 'en'
```

**Organisation rules:**
- Each component has its own `.astro` file + its `.css` in `styles/components/`
- Inline CSS only if strictly required by JS (e.g. dynamic modal positioning)
- Selectors always by class (`.nav-link`), never ID — unless required by JS for performance
- All internal hrefs should use `import.meta.env.BASE_URL` helpers so routing remains correct if a base path is reintroduced later

---

## Base URL pattern

Even with no base path configured, internal links should use `import.meta.env.BASE_URL` helpers:

```ts
const base = import.meta.env.BASE_URL; // '/' in dev and preview
const basePath = lang === 'en' ? base : `${base}${lang}/`;
// Links: href={basePath}, href={`${basePath}program/`}
```

---

## Content architecture

- Content-heavy pages use Markdown as the editing source of truth
- One file per page per locale: `src/content/<collection>/<locale>.md`
- Frontmatter stores metadata and structured fields
- Body Markdown stores editable prose and tables
- `about/*.md` uses frontmatter arrays for partner data
- Route `.astro` files stay thin and mostly render collection content

---

## Design tokens (tokens.css)

Read `references/tokens.md` for the full list of custom properties.

Principles:
- Primary colour `#364b9b`, secondary `#e63323`
- Grey scale: `#fff` → `#dadada` → `#878787` → `#000`
- Dark mode via `@media (prefers-color-scheme: dark)` on the same variables
- Typography: News Cycle (Google Fonts), modular scale in `rem`
- Spacing: scale in `rem` (0.25 → 0.5 → 1 → 1.5 → 2 → 3 → 4 → 6 → 8)

---

## i18n

Read `references/i18n.md` for the JSON structure and Astro helpers.

Principles:
- Routing: `/` (en, default), `/it/`, `/pl/` — `/` is English
- Each page duplicated in the three folders, content via `t('key')`
- Language in `<html lang="">` and meta tags
- Accessible language switcher in the nav

---

## Accessibility

- **Visible focus**: never `outline: none` without a replacement. Use `outline` on `:focus-visible`
- **Contrast**: respect WCAG AA (4.5:1 normal text, 3:1 large text)
- **Dark mode**: same contrast ratios, same layout
- **Scroll behaviour**: `html { scroll-behavior: smooth }` in `tokens.css`
- **Skip link**: first element in `<body>` → `#main-content`
- **Aria**: roles, labels and live regions where needed
- **Keyboard nav**: Tab, Shift+Tab, Enter/Space, Escape (modal), arrows (menu)

---

## Responsive and layout

- CSS Grid as the main system, Flexbox for linear alignment
- **Intrinsic web design**: `minmax()`, `auto-fill`, `auto-fit`, `clamp()`
- Light breakpoints with `@media` only where intrinsic is not enough
- No mandatory fixed breakpoints — adapts to content
- Container with `max-width` and `margin-inline: auto`

---

## Components

Read `references/components.md` for HTML, CSS and JS patterns for each:
- Navigation / Header
- Hero / Banner
- Card and Grid layout
- Form and Input
- Modal / Overlay
- Animations / Transitions
- Footer

---

## Deploy

Read `references/deploy.md` for the complete GitHub Actions workflow.

Principles:
- Build with `npm run build` → output in `dist/`
- Deploy on `gh-pages` branch via `actions/deploy-pages`
- Trigger on push to `main`
- Node LTS version

---

## Checklist before delivery

- [ ] No pixels in CSS (all in `rem`)
- [ ] No inline CSS except where required by JS
- [ ] All strings in all three JSON files
- [ ] Visible focus on every interactive element
- [ ] Dark mode tested
- [ ] Grid / layout works without fixed breakpoints where possible
- [ ] `lang` attribute updated per page
- [ ] GitHub Actions workflow present
- [ ] All internal hrefs use `import.meta.env.BASE_URL` prefix

------

## Project architecture

The project architecture is described in /architecture.md.
The contents inside /contents populate the site sections (Program, Lectures, About) and the details of
the partners and students involved, sourced from .md and .pdf files in references.
Do not generate invented content — only use what is present in the reference files.
If sections are missing, insert a placeholder with a description of the missing content.

---

## Project structure

```
/
├── public/
│   └── fonts/          # Benton Sans (thin → black)
├── src/
│   ├── assets/
│   ├── components/     # One .astro file per component
│   ├── i18n/
│   │   ├── it.json
│   │   ├── en.json
│   │   ├── pl.json
│   │   └── utils.ts    # Helper useTranslations()
│   ├── layouts/
│   │   └── Base.astro
│   ├── pages/
│   │   ├── it/
│   │   ├── en/
│   │   └── pl/
│   └── styles/
│       ├── tokens.css      # var() CSS: colors, typography, spacing
│       ├── reset.css
│       ├── typography.css
│       ├── utilities.css
│       └── components/     # Dedicated CSS for each component
├── .github/
│   └── workflows/
│       └── deploy.yml
└── astro.config.mjs
```

**Organisation rules:**
- Each component has its own `.astro` file + its `.css` in `styles/components/`
- Inline CSS only if strictly required by JS (e.g. dynamic modal positioning)
- Selectors always by class (`.nav-link`), never ID — unless required by JS for performance

---

## Design tokens (tokens.css)

Read `references/tokens.md` for the full list of custom properties.

Principles:
- Primary colour `#364b9b`, secondary `#e63323`
- Grey scale: `#fff` → `#dadada` → `#878787` → `#000`
- Dark mode via `@media (prefers-color-scheme: dark)` on the same variables
- Typography: Benton Sans, modular scale in `rem`
- Spacing: scale in `rem` (0.25 → 0.5 → 1 → 1.5 → 2 → 3 → 4 → 6 → 8)

---

## i18n

Read `references/i18n.md` for the JSON structure and Astro helpers.

Principles:
- Routing: `/it/`, `/en/`, `/pl/` — `/` redirects to the default language (`it`)
- Each page duplicated in the three folders, content via `t('key')`
- Language in `<html lang="">` and meta tags
- Accessible language switcher in the nav

---

## Accessibility

- **Visible focus**: never `outline: none` without a replacement. Use `outline` on `:focus-visible`
- **Contrast**: respect WCAG AA (4.5:1 normal text, 3:1 large text)
- **Dark mode**: same contrast ratios, same layout
- **Scroll behaviour**: `html { scroll-behavior: smooth }` in `tokens.css`
- **Skip link**: first element in `<body>` → `#main-content`
- **Aria**: roles, labels and live regions where needed
- **Keyboard nav**: Tab, Shift+Tab, Enter/Space, Escape (modal), arrows (menu)

---

## Responsive and layout

- CSS Grid as the main system, Flexbox for linear alignment
- **Intrinsic web design**: `minmax()`, `auto-fill`, `auto-fit`, `clamp()`
- Light breakpoints with `@media` only where intrinsic is not enough
- No mandatory fixed breakpoints — adapts to content
- Container with `max-width` and `margin-inline: auto`

---

## Componenti

Leggi `references/components.md` per pattern HTML, CSS e JS di ciascuno:
- Navigation / Header
- Hero / Banner
- Card e Grid layout
- Form e Input
- Modal / Overlay
- Animazioni / Transizioni
- Footer

---

## Deploy

Leggi `references/deploy.md` per il workflow GitHub Actions completo.

Principi:
- Build con `npm run build` → output in `dist/`
- Deploy su `gh-pages` branch via `actions/deploy-pages`
- Trigger su push a `main`
- Node versione LTS

---

## Checklist prima di consegnare

- [ ] Nessun pixel nel CSS (tutto in `rem`)
- [ ] Nessun CSS inline tranne dove JS lo richiede
- [ ] Tutte le stringhe in tutti e tre i file JSON
- [ ] Focus visible su ogni elemento interattivo
- [ ] Dark mode testata
- [ ] Grid / layout funziona senza breakpoint fissi ove possibile
- [ ] `lang` attribute aggiornato per pagina
- [ ] GitHub Actions workflow presente

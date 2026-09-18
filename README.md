# Bezisten restaurant website

A static, mobile-first React + TypeScript restaurant website with a multilingual paper-style menu and generated A4 PDF menus. **Bezisten is a working name. All dishes and prices are examples. This is a working implementation awaiting verified restaurant content, not an approved restaurant menu.** See `CONTENT_TODO.md` before publishing.

## Quick start

Requires Node.js 22.12+ and npm. No database, API keys, backend or external content service.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173`.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

The build generates all three PDFs, bundles the frontend and emits static route files plus SEO files. Preview serves `dist` at `http://127.0.0.1:4173`, including real HTTP 404 responses. Development uses Vite; unknown development paths use its SPA fallback, while the production static server serves `404.html`.

```sh
npx playwright install chromium
npm run test:e2e
```

E2E tests run against a production build, so run `npm run build` first. They launch the preview automatically. Screenshots go into ignored `tmp/`. Traces for failures go into `test-results/`.

## Architecture

- `src/config/restaurant.ts`: working identity, currency, verified contact fields, review model and empty reviews.
- `src/data/{menu,categories,allergens}.ts`: the only source of truth for dishes, sorting, translations and allergens.
- `src/features/menu/types.ts`: strict models.
- `src/features/menu/layout.ts`: filtering, deterministic content-budget pagination, category-to-page and page-to-spread mapping, language fallback.
- `src/features/menu/`: reusable book, page, item, toolbar and overflow components.
- `src/i18n/`: all UI text and browser-language selection.
- `src/styles/main.css`: design tokens, responsive layouts, page animation, focus and reduced motion rules.
- `scripts/generate-menu-pdf.ts`: Node/PDFKit generator using the same content. It measures text, prevents item splits and orphan headings, embeds DejaVu fonts, draws vector price boxes and numbered allergen badges with a legend.
- `scripts/generate-static.ts`: route files, canonical/OG and verified Restaurant JSON-LD, robots and sitemap.
- `tests/`: logic, price separation, generated-PDF and browser tests.

### Web and print separation

Web items display dish name, ingredients, weight and accessible allergen icons. **No price is read by the web item renderer**, including hidden markup. Data and downloadable PDFs are intentionally public, so prices are not secrets. Print items include a fixed right-hand price box from the same numeric `price` field. Web and print have independent pagination appropriate to their medium; they share content, ordering and enabled-item filtering, not page numbers.

### Menu interaction

Below 900px the viewer shows one page; at 900px and above it shows two. CSS perspective rotates an inert copy of the outgoing paper page around the center edge. Buttons, horizontal touch swipes and Left/Right arrows navigate. The viewer is keyboard focusable; native text/select controls retain their arrow behavior. Reduced motion disables animation. Zoom (85–145%) reflows text inside pages instead of creating horizontal panning; native browser pinch zoom remains available, and swipe page navigation is disabled during multi-touch or custom text zoom. Toolbar reset restores 100%. Categories map to the first actual page containing their dishes. A category may continue across pages or share a page.

The overflow has a language-specific download and reset. It supports focus, arrow keys, Home/End, Escape, outside click and ordinary Tab navigation. Optional fullscreen is deliberately omitted.

## Content and images

Read `MENU_GUIDE.md` for menu edits. Replace working business values in `src/config/restaurant.ts`. Null contacts are hidden; reviews stay hidden until authentic entries are supplied. Never substitute guessed information. The geometric location artwork is illustrative and is not a navigable map.

Current SVG artwork is a locally authored, labeled placeholder, not a photograph of the restaurant:

- `public/images/restaurant/courtyard.svg` → replace hero with approved restaurant photos, for example `courtyard-640.webp`, `courtyard-1280.webp`, `courtyard-1920.webp`.
- `public/images/bitola/clocktower.svg` → replace with approved Bitola/restaurant context photography.
- `public/images/food/` → optional approved dish photography.

Update `Home.tsx` image paths and localized alt text; supply `srcSet`/`sizes` for multiple photo resolutions and retain intrinsic width/height and aspect ratios. Keep the hero eager; other images are lazy. Remove the illustration captions only when actual photos are installed. Fonts are bundled locally; no third-party requests are needed at runtime. Print fonts and their redistribution license are in `public/fonts/`.

## Languages

Macedonian (`mk`), English (`en`), German (`de`). Browser language is detected on first visit; unsupported languages fall back to English. Explicit choice is stored in `restaurant-language` localStorage. Storage failure is harmless. Missing dish translations fall back to English. Downloads follow the selected language. Full UI translation and document language/metadata update together.

## Printable menus

```sh
npm run generate:menu
```

Produces `public/menu/menu-mk.pdf`, `menu-en.pdf`, `menu-de.pdf`. These are committed build outputs. Regenerate after every content or currency edit; `npm run build` does so automatically. A4 portrait, 45pt (15.9mm) margins, embedded fonts, vector text/lines, aligned price boxes and page numbers. No screenshot rasterization and no browser print dialog. Print at 100% actual size. PDFs carry a localized demonstration notice until `sampleMenu` is false. Ask a print shop to check a physical proof before a large run.

## Deployment: Cloudflare Pages

Connect this GitHub repository to a Pages project:

- Production branch: `main`
- Build command: `npm ci && npm run build`
- Output directory: `dist`
- Node version: 22.12 or newer (use Node 24 LTS where available)
- No functions, workers or SPA catch-all rewrite required.

Real `/menu/index.html` and `/privacy/index.html` make direct navigation work. Top-level `404.html` handles missing paths with the correct HTTP status. `_headers` supplies CSP, basic security headers and immutable hashed-asset caching; PDFs revalidate so a new price is not stuck in cache.

To launch with a custom domain, add it to the Pages project and configure DNS as directed by the host. Set `restaurant.domain` to its absolute HTTPS origin. Add a real social image path. Confirm identity/contact content; set `nameIsPlaceholder` and `sampleMenu` false only after content approval. Rebuild. Until then generated robots and meta tags discourage indexing, the sitemap is empty and unknown business data is excluded. With verified name, address and domain, the generator emits Restaurant JSON-LD, canonical URLs and a sitemap. The privacy text must be reviewed against the actual hosting arrangement. Do not add analytics without updating it.

## Verification and limitations

Tests cover all requested viewport widths: 320, 375, 390, 393, 430, 768, 1024 and 1440. Browser tests include routes, menu controls, mobile navigation, synthetic touch swipe, languages, storage, downloads, reduced motion, overflow focus, automated accessibility and horizontal overflow. Unit tests validate pagination and price separation; PDF tests extract actual generated text. Automated checks are not a substitute for real-device and screen-reader checks or verified food/allergen declarations. Lighthouse scores are not claimed without a measured deployment run.

## Git workflow

```sh
git checkout -b content/update-menu
# Edit data; regenerate and inspect PDFs.
npm run build
npm run lint
npm test
npm run test:e2e
git add src public/menu
git commit -m "Update approved restaurant menu"
git push -u origin content/update-menu
```

Origin: `https://github.com/MilenkovskiTrajche/WebAi.git`. Never force-push. Keep generated PDFs with their matching content commit. CI in `.github/workflows/verify.yml` repeats validation and checks PDF output is current.

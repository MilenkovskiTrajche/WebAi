# Maintaining the menu

You only edit the source data. The web menu and PDFs read it together.

## Add an item

Open `src/data/menu.ts` and copy one `dish(...)` entry. The helper accepts, in order: unique ID, category ID, localized name, localized ingredients, weight, allergen IDs, numeric price, numeric order.

```ts
dish('new-salad', 'salads',
  l('New salad', 'Нова салата', 'Neuer Salat'),
  l('Tomato and cheese.', 'Домат и сирење.', 'Tomate und Käse.'),
  '300 g', ['dairy'], 250, 40),
```

This is an example, not a verified allergen declaration. Validate recipes and cross-contact information with the restaurant. `l` takes English, Macedonian and German in that order. IDs must be stable and unique.

- **Delete**: remove the entry; it disappears from both outputs after rebuilding.
- **Disable**: use `{ ...dish(...), enabled: false }` to keep the record without rendering or printing it.
- **Ingredients/name**: edit all three `l(...)` values. A missing optional translation falls back to English.
- **Weight**: change `"300 g"` (or a serving volume such as `"250 ml"`).
- **Price**: change the numeric argument, without currency text. **Changing `price` changes the printable PDF but does NOT show the price on the web menu.** It also does not change web accessibility text or tooltips.
- **Allergens**: use keys from `src/data/allergens.ts`. Keep an empty list only when verified. Central definitions include translated labels, shared visual icon keys (both the web and PDFs render the same SVG pictograms).
- **Category**: change the category ID to an existing ID.
- **Order**: lower numbers appear first inside their category. Leave gaps such as 10, 20, 30 for future additions.
- **Optional fields**: full `MenuItem` records also support dietary labels and images; they are available for future presentation but currently omitted from the physical-paper layout.

## Categories and pagination

Edit `src/data/categories.ts` to add a unique ID, translated name, supported icon key and numeric order. Supported icons live in `src/components/Icons.tsx`. Navigation automatically includes categories with enabled dishes. Pages come from `paginate` in `src/features/menu/layout.ts`; no separate page files are needed. The first occurrence of a category determines its navigation destination. Desktop shows the enclosing two-page spread.

The web budget uses the longest ingredient translation. Very long text can grow the page vertically (especially at larger zoom); it will not clip. PDF pagination measures actual text and prevents item splits. Extremely long entries that cannot fit on one A4 page stop generation with a clear error so they cannot silently become clipped. Keep menu descriptions concise.

## Add a language

Add its code to `languages` / `Language` and `Localized` in `types.ts`; add complete UI strings, translations on all menu/category/allergen records, a selector option, browser detection, and a local font subset if needed. `generate:menu` iterates `languages` automatically. Add filename, rendering and detection tests. Existing `localize` supplies English fallback for untranslated optional fields. Do not advertise a new language until its UI and critical allergy text are reviewed.

## Currency

Change `restaurant.currency` in `src/config/restaurant.ts`. The numeric values must already be in the new currency: changing a symbol does not convert prices. `formatPrice` in the PDF generator controls separators and decimal places. Regenerate and check long prices fit their boxes.

## Styling

Web colors/fonts are tokens at the start of `src/styles/main.css`; `.menu-page`, `.dish` and the page-turn rules control the paper presentation. Zoom is relative text sizing. PDF fonts, A4 dimensions, margins, row measurements and price boxes are in `scripts/generate-menu-pdf.ts`. PDFs and web share page grouping and icon artwork. Print adds an unnumbered vector-logo cover, a right-hand price column and a final allergen legend. Inner pages use the small architectural mark. The cover does not change the shared dish-page numbering. Branding assets and regeneration instructions are in `public/branding/README.md`.

## Regenerate and verify

```sh
npm run generate:menu
npm test
npm run build
npm run test:e2e
```

Open all three files in `public/menu/`. Check every page: text, Cyrillic, German accents, headings, weights, allergens, page breaks, right-hand prices and footer. PDFs are searchable vector text. If Poppler is installed, render all pages for inspection:

```sh
mkdir -p tmp/pdfs
pdftoppm -png -scale-to 1200 public/menu/menu-mk.pdf tmp/pdfs/mk
pdftoppm -png -scale-to 1200 public/menu/menu-en.pdf tmp/pdfs/en
pdftoppm -png -scale-to 1200 public/menu/menu-de.pdf tmp/pdfs/de
```

Check the browser at phone width, switch languages, navigate categories, and use the three-dot download. Commit edited source and regenerated PDFs together. Never manually edit the generated PDF as a replacement for source changes.

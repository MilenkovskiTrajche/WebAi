# Trajche Bezisten identity

An original geometric stone arch frames an open doorway. Seven arch stones, a quiet copper keystone and a two-line serif inscription evoke Bezisten masonry and traditional Bitola shop signs. The geometry is constructed in code, not traced from a raster image or an existing logo. The site's illustrated postcard provided atmosphere; it is not documentary evidence of the restaurant's architecture.

## Variants

- `logo-primary.svg`: dark brown with a copper keystone; website header, menu introduction and PDF cover.
- `logo-light.svg`: warm cream for dark backgrounds, signs and other reusable applications.
- `logo-monochrome.svg`: pure black; website footer and one-color print applications.
- `logo-mark.svg`: symbol alone; menu invitation, loading state and small PDF page headers.
- `../favicon.svg`: simplified symbol with a cream tile, readable at 16 and 32 pixels.

Preview all variants at `/branding/`. Preserve the SVG viewBox and aspect ratio. Do not stretch, add effects or place the dark version over busy photography. Use the mark when the full inscription becomes too small. Recommended minimum full-lockup width: 145 CSS pixels; standalone mark height: 32 pixels. Allow clear space around the complete lockup approximately equal to the capital T height (about 43 units in its 560 × 208 viewBox), especially in print.

## Palette and typography

Dark brown `#241A14`, warm cream `#F2E7D5`, copper `#A45132`. Copper is a small optional accent; the identity also works in one color.

The inscription uses outlined Cormorant Garamond Semibold and DM Sans Medium letterforms. All production lettering is vector paths, so no installed font or external request is required. The bundled OFL licenses are retained alongside these assets. SVGs contain no raster images, scripts or external resources.

## Maintenance

Edit `scripts/generate-branding.mjs` for geometry and composition, and `src/config/brand.ts` for the shared palette and paths. Run `npm run generate:branding`, then `npm run build` to regenerate the PDF menus too. Commit generated SVGs and PDFs with their source changes. The PDF generator embeds the SVG as vector drawing commands rather than a screenshot.

Use the reusable `Logo` and `LogoMark` React components. Identity images have the accessible name “Trajche Bezisten”; decorative copies have empty alternative text. The existing lazy-menu fallback draws the arch and immediately shows a static mark when reduced motion is requested. It introduces no artificial loading delay.

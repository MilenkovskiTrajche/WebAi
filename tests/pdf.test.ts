import { readFile } from "node:fs/promises";
import { describe, it, expect } from "vitest";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { languages } from "../src/features/menu/types";
import { restaurant } from "../src/config/restaurant";
import { categories } from "../src/data/categories";
import { strings } from "../src/i18n/strings";
import { menu } from "../src/data/menu";
import { formatPrice } from "../scripts/generate-menu-pdf";
import { localize, pdfFilename, paginate } from "../src/features/menu/layout";
describe("generated printable PDFs", () => {
  for (const language of languages) {
    it(`${language}: every enabled dish and its price survive PDF generation`, async () => {
      const bytes = new Uint8Array(
        await readFile(`public/menu/${pdfFilename(language)}`),
      );
      const task = getDocument({
        data: bytes,
        useSystemFonts: true,
        disableFontFace: true,
      });
      const doc = await task.promise;
      let text = "";
      const webPages = paginate(menu, categories);
      expect(doc.numPages).toBe(webPages.length + 1);
      for (let index = 1; index <= doc.numPages; index++) {
        const page = await doc.getPage(index);
        const content = await page.getTextContent();
        text +=
          content.items
            .filter((i) => "str" in i)
            .map((i) => ("str" in i ? i.str : ""))
            .join(" ") + " ";
        const pageText = content.items
          .filter((i) => "str" in i)
          .map((i) => ("str" in i ? i.str : ""))
          .join(" ");
        if (index <= webPages.length) {
          for (const item of webPages[index - 1].sections.flatMap(
            (s) => s.items,
          )) {
            expect(pageText).toContain(localize(item.name, language));
          }
        }
        expect(pageText).toContain(restaurant.name);
        expect(pageText).not.toContain(strings[language].draft);
        // No numeric allergen codes; PDF contains actual vector pictograms instead.
        expect(
          content.items
            .filter((i) => "str" in i)
            .map((i) => ("str" in i ? i.str : "")),
        ).not.toEqual(expect.arrayContaining(["01", "03", "07"]));
        const [, , width, height] = page.view;
        expect(width).toBeCloseTo(595.28, 1);
        expect(height).toBeCloseTo(841.89, 1);
      }
      for (const item of menu.filter((item) => item.enabled)) {
        expect(text).toContain(localize(item.name, language));
        expect(text).toContain(formatPrice(item.price));
      }
      expect(text.match(/ден\./g)?.length).toBe(
        menu.filter((item) => item.enabled).length,
      );
      expect(doc.numPages).toBeGreaterThan(0);
      await task.destroy();
    });
  }
});

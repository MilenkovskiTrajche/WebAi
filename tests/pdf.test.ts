import { readFile } from "node:fs/promises";
import { describe, it, expect } from "vitest";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { languages } from "../src/features/menu/types";
import { menu } from "../src/data/menu";
import { formatPrice } from "../scripts/generate-menu-pdf";
import { localize, pdfFilename } from "../src/features/menu/layout";
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
      for (let index = 1; index <= doc.numPages; index++) {
        const page = await doc.getPage(index);
        const content = await page.getTextContent();
        text +=
          content.items
            .filter((i) => "str" in i)
            .map((i) => ("str" in i ? i.str : ""))
            .join(" ") + " ";
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

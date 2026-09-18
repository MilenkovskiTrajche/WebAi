import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { menu } from "../src/data/menu";
import { categories } from "../src/data/categories";
import { allergens } from "../src/data/allergens";
import {
  activeItems,
  categoryPageMap,
  detectLanguage,
  localize,
  orderedCategories,
  paginate,
  pdfFilename,
  spreadForPage,
} from "../src/features/menu/layout";
import { MenuItem } from "../src/features/menu/MenuItem";
import { formatPrice, printItems } from "../scripts/generate-menu-pdf";
import { languages } from "../src/features/menu/types";
describe("single source of truth", () => {
  it("sorts categories without mutating input", () => {
    expect(orderedCategories([...categories].reverse())).toEqual(categories);
  });
  it("filters disabled dishes and sorts by order", () => {
    const a = { ...menu[0], order: 20 },
      b = { ...menu[1], order: 10 },
      disabled = { ...menu[2], enabled: false };
    expect(
      activeItems([a, disabled, b], a.categoryId).map((i) => i.id),
    ).toEqual([b.id, a.id]);
  });
  it("paginates every enabled dish once with real category mapping", () => {
    const pages = paginate(menu, categories);
    expect(pages.length).toBeGreaterThan(2);
    const ids = pages.flatMap((p) =>
      p.sections.flatMap((s) => s.items.map((i) => i.id)),
    );
    expect(new Set(ids).size).toBe(menu.length);
    const map = categoryPageMap(pages);
    for (const c of categories) {
      expect(pages[map[c.id]].sections.some((s) => s.categoryId === c.id)).toBe(
        true,
      );
    }
    expect(pages.some((p) => p.sections.length > 1)).toBe(true);
    expect(pages.some((p) => p.sections.some((s) => s.continued))).toBe(true);
  });
  it("removes disabled and deleted items from pagination and print input", () => {
    const input = menu
      .map((m, i) => (i === 0 ? { ...m, enabled: false } : m))
      .slice(0, -1);
    expect(
      paginate(input, categories).flatMap((p) =>
        p.sections.flatMap((s) => s.items),
      ).length,
    ).toBe(menu.length - 2);
    expect(printItems(input)).toHaveLength(menu.length - 2);
    expect(paginate([], categories)).toEqual([]);
  });
  it("maps odd and even pages into desktop spreads", () => {
    expect([0, 1, 2, 3, 4].map(spreadForPage)).toEqual([0, 0, 2, 2, 4]);
  });
  it("detects supported languages with English fallback", () => {
    expect(
      ["mk-MK", "de-AT", "en-US", "fr-FR", null].map(detectLanguage),
    ).toEqual(["mk", "de", "en", "en", "en"]);
    expect(localize({ en: "Fallback" }, "mk")).toBe("Fallback");
  });
  it("selects language-specific filenames", () => {
    expect(languages.map(pdfFilename)).toEqual([
      "menu-mk.pdf",
      "menu-en.pdf",
      "menu-de.pdf",
    ]);
  });
  it("never renders price in visible or hidden web markup", () => {
    for (const language of languages) {
      for (const item of menu) {
        const sentinel = 987654.32;
        const html = renderToStaticMarkup(
          <MenuItem item={{ ...item, price: sentinel }} language={language} />,
        );
        expect(html).not.toContain(String(sentinel));
        expect(html).not.toMatch(/ден\.|MKD|price|987,654/);
        expect(html).toContain(
          localize(item.name, language).replaceAll("&", "&amp;"),
        );
      }
    }
  });
  it("changing price leaves web output identical and updates print output", () => {
    const item = menu[0],
      changed = { ...item, price: item.price + 20 };
    expect(renderToStaticMarkup(<MenuItem item={item} language="en" />)).toBe(
      renderToStaticMarkup(<MenuItem item={changed} language="en" />),
    );
    expect(printItems([changed])[0].formattedPrice).toBe(
      formatPrice(changed.price),
    );
    expect(printItems([item])[0].formattedPrice).not.toBe(
      printItems([changed])[0].formattedPrice,
    );
  });
  it("has valid data and complete menu translations", () => {
    expect(new Set(menu.map((m) => m.id)).size).toBe(menu.length);
    for (const item of menu) {
      expect(item.price).toBeGreaterThanOrEqual(0);
      expect(categories.some((c) => c.id === item.categoryId)).toBe(true);
      for (const id of item.allergens) expect(allergens[id]).toBeDefined();
      for (const lang of languages) {
        expect(item.name[lang]).toBeTruthy();
        expect(item.ingredients[lang]).toBeTruthy();
      }
    }
  });
});

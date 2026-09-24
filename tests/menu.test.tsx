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
import { ingredientLabels } from "../src/i18n/strings";
import { languages, secondaryLanguages } from "../src/features/menu/types";
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
    for (const c of categories.filter((c) =>
      menu.some((item) => item.categoryId === c.id),
    )) {
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
  it("uses one multilingual downloadable edition", () => {
    expect(new Set(languages.map(pdfFilename))).toEqual(
      new Set(["menu-multilingual.pdf"]),
    );
  });
  it("preserves canonical category order and unique immutable waiter codes", () => {
    expect(categories.map((c) => c.id)).toEqual([
      "salads",
      "cold-appetizers",
      "hot-appetizers",
      "grill",
      "grill-specialties",
      "fish",
      "sides",
      "desserts",
      "non-alcoholic",
      "spirits",
      "wine",
      "hot-drinks",
    ]);
    expect(new Set(menu.map((item) => item.code)).size).toBe(menu.length);
    for (const item of menu) {
      expect(item.code).toMatch(/^[A-Z]{2}\d{2}$/);
      for (const language of languages.filter((l) => l !== "mk")) {
        const html = renderToStaticMarkup(
          <MenuItem item={item} language={language} />,
        );
        expect(html).toContain(item.name.mk!);
        expect(html).toContain(item.code);
      }
    }
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
        expect(item.ingredients[lang]?.trim()).toBeTruthy();
      }
    }
  });
});

describe("bilingual ingredients", () => {
  it("shows only canonical and selected ingredient languages for every dish", () => {
    for (const item of menu)
      for (const language of secondaryLanguages) {
        const html = renderToStaticMarkup(
          <MenuItem item={item} language={language} />,
        );
        expect(html).toContain(`ingredients-primary" lang="mk"`);
        expect(html).toContain(`ingredients-secondary" lang="${language}"`);
        expect(html).toContain(item.ingredients.mk!);
        expect(html).toContain(item.ingredients[language]!);
        expect(html).toContain(ingredientLabels[language]);
        expect(html.match(/ingredients-secondary/g)).toHaveLength(1);
      }
  });
  it("omits absent or blank translations instead of mislabelling a fallback", () => {
    for (const missing of [undefined, "", "  "]) {
      const item = {
        ...menu[0],
        ingredients: { ...menu[0].ingredients, sr: missing },
      };
      const html = renderToStaticMarkup(<MenuItem item={item} language="sr" />);
      expect(html).toContain(item.ingredients.mk!);
      expect(html).not.toContain("ingredients-secondary");
      expect(html).not.toMatch(/undefined|null|TODO|MISSING_TRANSLATION/);
    }
  });
});

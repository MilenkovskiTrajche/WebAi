import { menu } from "../../src/data/menu";
import { secondaryLanguages } from "../../src/features/menu/types";
import { ingredientLabels } from "../../src/i18n/strings";
import { test, expect } from "@playwright/test";
for (const width of [320, 375, 390, 393, 430, 768, 1024, 1440]) {
  test(`responsive routes and menu at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const path of ["/", "/menu", "/privacy", "/not-a-page"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    await page.goto("/menu");
    await expect(page.locator(".menu-spread > .menu-page")).toHaveCount(
      width >= 900 ? 2 : 1,
    );
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      animations: "disabled",
      path: `tmp/menu-${width}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Next pages", exact: true }).click();
    await expect(page.locator(".page-status")).toContainText(
      width >= 900 ? "3" : "2",
    );
    await page
      .getByRole("button", { name: "Previous pages", exact: true })
      .click();
    await expect(page.locator(".page-status")).toContainText("1");
    await page.getByRole("button", { name: "Zoom in", exact: true }).click();
    await expect(page.locator(".zoom-value")).toHaveText("115%");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "More menu options" }).click();
    await page.getByRole("menuitem", { name: "Reset zoom" }).click();
    await expect(page.locator(".zoom-value")).toHaveText("100%");
    await page
      .getByRole("button", { name: "Топли напитоци Hot drinks", exact: true })
      .click();
    await expect(page.locator(".menu-spread")).toContainText("Espresso");
    expect(errors).toEqual([]);
  });
}
test("languages, matching downloads, overflow focus, keyboard and price privacy", async ({
  page,
}) => {
  await page.goto("/menu");
  await page
    .getByRole("region", { name: "Interactive restaurant menu" })
    .focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".page-status")).toContainText("3");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".page-status")).toContainText("1");
  for (const lang of ["en", "de", "el", "sr", "sq"]) {
    await page.locator(".tools select").selectOption(lang);
    await expect(page.locator(".menu-spread .dish h3").first()).toContainText(
      "Шопска салата",
    );
    await expect(
      page.locator(".menu-spread .dish-translation").first(),
    ).toHaveAttribute("lang", lang);
    const button = page.getByRole("button", { name: "More menu options" });
    await button.click();
    const link = page.getByRole("menuitem", { name: "Download menu (PDF)" });
    await expect(link).toBeFocused();
    await expect(link).toHaveAttribute("href", "/menu/menu-multilingual.pdf");
    const [file] = await Promise.all([
      page.waitForEvent("download"),
      link.click(),
    ]);
    expect(file.suggestedFilename()).toBe("restaurant-menu-multilingual.pdf");
    expect(await file.failure()).toBeNull();
    await button.click();
    await page.keyboard.press("Escape");
    await expect(button).toBeFocused();
    await expect(page.getByRole("menu")).toHaveCount(0);
    await button.click();
    await page.locator(".page-status").click();
    await expect(page.getByRole("menu")).toHaveCount(0);
    expect(await page.locator(".menu-spread").innerHTML()).not.toMatch(
      /ден\.|MKD|price/,
    );
  }
  await page.reload();
  await expect(page.locator(".tools select")).toHaveValue("sq");
});
test("mobile navigation, swipe, allergen legend and reduced motion", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: "en-US",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .locator("#navigation")
    .getByRole("link", { name: "The menu" })
    .click();
  await expect(page.locator("h1")).toHaveText("Trajche Bezisten · Мени");
  const viewer = page.locator(".book-viewport");
  await viewer.dispatchEvent("touchstart", {
    touches: [{ identifier: 1, clientX: 300, clientY: 400 }],
  });
  await viewer.dispatchEvent("touchend", {
    changedTouches: [{ identifier: 1, clientX: 70, clientY: 403 }],
  });
  await expect(page.locator(".page-status")).toContainText("2");
  await expect(page.locator(".turning-sheet")).toHaveCount(0);
  await page.locator("summary").click();
  await expect(
    page.getByText("Please speak with our team", { exact: false }),
  ).toBeVisible();
  await context.close();
});
test("browser language detection and unsupported fallback", async ({
  browser,
}) => {
  for (const [locale, expected] of [
    ["mk-MK", "mk"],
    ["de-DE", "de"],
    ["fr-FR", "en"],
  ]) {
    const context = await browser.newContext({ locale });
    const page = await context.newPage();
    await page.goto("/menu");
    await expect(page.locator("html")).toHaveAttribute("lang", expected);
    await context.close();
  }
});
test("static deployment responses and accessibility", async ({ page }) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  for (const path of ["/", "/menu", "/privacy", "/missing-page"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(path === "/missing-page" ? 404 : 200);
    await page.locator("h1").waitFor();
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(report.violations).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/menu");
  await page.getByRole("button", { name: "More menu options" }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
test("homepage visual inspection captures", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator('#story, a[href$="#story"]')).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `tmp/home-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
  }
});
test("all languages fit small phones and tablet at maximum text zoom", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/menu");
    for (const language of ["en", "de", "el", "sr", "sq"]) {
      await page.locator(".tools select").selectOption(language);
      for (let i = 0; i < 3; i++)
        await page.locator(".zoom-controls .icon-button").last().click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      for (const category of await page.locator(".category-nav button").all()) {
        await category.click();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
      await page.locator(".zoom-value").click();
    }
  }
});

test("turning sheet keeps both paper faces and the stationary page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/menu");
  await expect(page.locator(".sample-note")).toHaveCount(0);
  await expect(page.locator(".header .logo")).toHaveAccessibleName(
    "Trajche Bezisten",
  );
  await page.clock.install({ time: new Date("2026-09-19T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-09-19T00:00:01Z"));
  await page.getByRole("button", { name: "Next pages", exact: true }).click();
  // Freeze the CSS animation mid-turn to verify actual geometry and capture both sides.
  await page.locator(".turning-sheet").evaluate((el) => {
    for (const animation of el.getAnimations()) {
      animation.pause();
      animation.currentTime = 350;
    }
  });
  await expect(page.locator(".sheet-front .dish-code").first()).toBeVisible();
  await expect(page.locator(".sheet-back .dish-code").first()).toBeAttached();
  await expect(page.locator(".stationary-sheet")).toContainText(
    "Shopska salad",
  );
  await expect(page.locator(".book-transition")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  // Hold a visual copy independently of the JS cleanup timer so screenshot timing
  // cannot accidentally capture the already-completed spread.
  await page.evaluate(() => {
    const original = document.querySelector(".book-transition")!;
    const clone = original.cloneNode(true) as HTMLElement;
    clone.classList.add("turn-inspection");
    const sheet = clone.querySelector<HTMLElement>(".turning-sheet")!;
    sheet.style.animation = "none";
    sheet.style.transform = "rotateY(-65deg)";
    original.parentElement!.append(clone);
  });
  await page.screenshot({ path: "tmp/turn-front-visual.png", fullPage: true });
  await page.evaluate(() => {
    document.querySelector<HTMLElement>(
      ".turn-inspection .turning-sheet",
    )!.style.transform = "rotateY(-130deg)";
  });
  await page.screenshot({ path: "tmp/turn-back-visual.png", fullPage: true });
  await page.evaluate(() =>
    document.querySelector(".turn-inspection")?.remove(),
  );
  await page.locator(".turning-sheet").evaluateAll((elements) => {
    for (const el of elements)
      for (const animation of el.getAnimations()) animation.finish();
  });
  await page.clock.resume();
  await expect(page.locator(".book-transition")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Previous pages", exact: true })
    .click();
  await expect(page.locator(".sheet-back .dish-code").first()).toBeAttached();
  await expect(page.locator(".book-transition")).toHaveCount(0);
  await expect(page.locator(".menu-spread")).toContainText("Shopska salad");
  await expect(page.locator(".menu-spread .allergen").first()).toHaveAttribute(
    "aria-label",
    "Milk",
  );
  await expect(page.locator(".menu-spread .allergen").first()).toHaveText("");
});

test("brand assets stay sharp, accessible and proportional at mobile and desktop sizes", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const logo = page.locator(".header .brand-logo");
    await expect(logo).toHaveAttribute("alt", "Trajche Bezisten");
    const box = await logo.boundingBox();
    expect(box!.width / box!.height).toBeCloseTo(560 / 208, 1);
    expect(
      await logo.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    ).toBe(true);
    await expect(page.locator(".footer-main .brand-logo")).toHaveAttribute(
      "src",
      "/branding/logo-monochrome.svg",
    );
  }
  await page.goto("/branding/");
  await expect(page.locator("h1")).toHaveText("The stone doorway.");
  for (const img of await page.locator("img").all())
    expect(
      await img.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      ),
    ).toBe(true);
  await page.screenshot({ path: "tmp/brand-reference.png", fullPage: true });
  await page.goto("/menu");
  await expect(page.locator(".menu-heading")).toHaveCount(0);
  await page.locator(".header .logo").click();
  await expect(page).toHaveURL("http://127.0.0.1:4173/");
});

test("existing menu loading state draws the mark and respects reduced motion", async ({
  page,
}) => {
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(/\/assets\/Menu-[^/]+\.js$/, async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/menu", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("status")).toBeVisible();
  await expect(page.locator(".draw-outer")).toHaveCSS(
    "stroke-dasharray",
    "1px",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".brand-loading-drawing svg")).toBeHidden();
  await expect(page.locator(".brand-loading .brand-mark")).toHaveCSS(
    "opacity",
    "1",
  );
  release();
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(page.locator(".menu-spread")).toBeVisible();
});

test("ingredient languages change together and remain readable on desktop, tablet and phone", async ({
  page,
}) => {
  const item = menu.find((item) => item.id === "shopska")!;
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/menu");
    for (const language of secondaryLanguages) {
      await page.locator(".tools select").selectOption(language);
      const dish = page.locator(".menu-spread .dish").first();
      await expect(dish.locator(".ingredients-primary")).toHaveText(
        `${ingredientLabels.mk}: ${item.ingredients.mk}`,
      );
      await expect(dish.locator(".ingredients-secondary")).toHaveText(
        `${ingredientLabels[language]}: ${item.ingredients[language]}`,
      );
      await expect(dish.locator(".ingredients-secondary")).toHaveAttribute(
        "lang",
        language,
      );
      await expect(dish.locator(".ingredients-secondary")).toHaveCount(1);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await dish.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
      if (width === 320 || width === 1440)
        await page.screenshot({
          path: `tmp/ingredients-${language}-${width}.png`,
          fullPage: true,
          animations: "disabled",
        });
    }
  }
});

import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";
import { brand } from "../src/config/brand";
import { createWriteStream } from "node:fs";
import { mkdir, readFile, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { menu } from "../src/data/menu";
import { categories } from "../src/data/categories";
import { allergens } from "../src/data/allergens";
import { restaurant } from "../src/config/restaurant";
import {
  activeItems,
  orderedCategories,
  localize,
  pdfFilename,
} from "../src/features/menu/layout";
import {
  languages,
  type Category,
  type Language,
  type MenuItem,
} from "../src/features/menu/types";
import { drawMenuIcon } from "./draw-menu-icon";
import { strings } from "../src/i18n/strings";
export const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(price)} ${restaurant.currency.symbol}`;
export const printItems = (items: MenuItem[]) =>
  items
    .filter((item) => item.enabled)
    .map((item) => ({ ...item, formattedPrice: formatPrice(item.price) }));
const ink = "#30251d",
  gold = "#8c6c3c",
  muted = "#626253";
export async function generatePDF(language: Language = "mk") {
  await mkdir("public/menu", { recursive: true });
  const [logoSvg, markSvg] = await Promise.all([
    readFile(`public${brand.primary}`, "utf8"),
    readFile(`public${brand.mark}`, "utf8"),
  ]);
  const doc = new PDFDocument({
    size: "A4",
    margin: 45,
    bufferPages: true,
    autoFirstPage: false,
    info: {
      Title: `${restaurant.name} - ${strings[language].menu}`,
      Author: restaurant.name,
      CreationDate: new Date("2026-01-01T00:00:00Z"),
      ModDate: new Date("2026-01-01T00:00:00Z"),
    },
  });
  doc.registerFont("serif", "public/fonts/PrintSerif.ttf");
  doc.registerFont("sans", "public/fonts/PrintSans.ttf");
  const output = createWriteStream(`public/menu/${pdfFilename(language)}`);
  doc.pipe(output);
  const t = strings[language];
  let y = 0;
  const newPage = () => {
    doc.addPage();
    SVGtoPDF(doc, markSvg, 45, 35, { width: 24, height: 30, assumePt: true });
    doc.fillColor(ink).font("serif").fontSize(14).text(restaurant.name, 80, 43);
    doc
      .font("sans")
      .fontSize(7)
      .fillColor(gold)
      .text(`${restaurant.established}  /  BITOLA`, 400, 47, {
        width: 150,
        align: "right",
      });
    doc
      .moveTo(45, 79)
      .lineTo(550, 79)
      .strokeColor("#cfc8b8")
      .lineWidth(0.6)
      .stroke();
    y = 102;
  };
  const secondaryLanguages = ["en", "de", "el", "sr", "sq"] as const;
  const heading = (category: Category, continued = false) => {
    doc
      .font("sans")
      .fontSize(7)
      .fillColor(gold)
      .text(
        category.order >= 90 ? "ПИЈАЛОЦИ / DRINKS" : "КУЈНА / KITCHEN",
        45,
        y,
        { width: 505, align: "center" },
      );
    y += 16;
    doc.font("serif").fontSize(19).fillColor(ink);
    doc.text(category.name.mk! + (continued ? " · продолжение" : ""), 45, y, {
      width: 505,
      align: "center",
    });
    y = doc.y + 7;
    doc.font("sans").fontSize(7).fillColor(muted);
    doc.text(
      secondaryLanguages
        .map((lang) => localize(category.name, lang))
        .join(" · "),
      45,
      y,
      { width: 505, align: "center" },
    );
    y = doc.y + 17;
  };
  // The SVG cover remains vector all the way to print; outlined lettering has no font dependency.
  // It is unnumbered, so inner menu pages retain their existing web page numbers.
  doc.addPage();
  doc.rect(45, 45, 505, 707).lineWidth(0.7).strokeColor("#cfc8b8").stroke();
  SVGtoPDF(doc, logoSvg, 100, 190, {
    width: 395,
    height: 146.71,
    assumePt: true,
  });
  doc
    .font("sans")
    .fontSize(11)
    .fillColor(brand.dark)
    .text(t.traditionalRestaurant, 65, 366, { width: 465, align: "center" });
  doc
    .fontSize(9)
    .fillColor(muted)
    .text(t.place, 65, 393, { width: 465, align: "center" });
  doc
    .moveTo(224, 440)
    .lineTo(280, 440)
    .strokeColor(gold)
    .lineWidth(0.7)
    .stroke();
  doc.moveTo(315, 440).lineTo(371, 440).stroke();
  doc.path("M297.5 435L302.5 440L297.5 445L292.5 440Z").fill(brand.copper);
  doc
    .font("serif")
    .fontSize(34)
    .fillColor(brand.dark)
    .text("МЕНИ", 65, 477, { width: 465, align: "center" });
  doc
    .font("sans")
    .fontSize(10)
    .fillColor(muted)
    .text("MENU · SPEISEKARTE · ΜΕΝΟΥ · ЈЕЛОВНИК · MENY", 65, 532, {
      width: 465,
      align: "center",
    });
  doc
    .fontSize(8)
    .text("MK · EN · DE · EL · SR · SQ", 65, 557, {
      width: 465,
      align: "center",
    });
  doc
    .font("sans")
    .fontSize(8)
    .fillColor(muted)
    .text(t.since, 65, 634, { width: 465, align: "center" });
  doc
    .fontSize(7)
    .text(restaurant.name, 65, 720, { width: 465, align: "center" });
  // One multilingual edition: each canonical item is printed once, with its immutable code.
  // Measure complete blocks before placing them; never split a dish across paper pages.
  newPage();
  for (const category of orderedCategories(categories)) {
    const items = printItems(activeItems(menu, category.id));
    if (!items.length) continue;
    let needsHeading = true;
    for (const item of items) {
      doc.font("serif").fontSize(13);
      const nameHeight = doc.heightOfString(`${item.code} · ${item.name.mk}`, {
        width: 395,
      });
      doc.font("sans").fontSize(8);
      const translations = secondaryLanguages.map(
        (lang) => `${lang.toUpperCase()} · ${localize(item.name, lang)}`,
      );
      const rows = [0, 2, 4].map((i) =>
        Math.max(
          ...translations
            .slice(i, i + 2)
            .map((text) =>
              doc.heightOfString(text, { width: 240, lineGap: 1 }),
            ),
        ),
      );
      doc.fontSize(7.5);
      const description = item.ingredients.mk || item.ingredients.en;
      const descriptionHeight = doc.heightOfString(description, {
        width: 505,
        lineGap: 1,
      });
      const height =
        nameHeight +
        rows.reduce((a, b) => a + b + 4, 0) +
        descriptionHeight +
        41;
      if (height > 520)
        throw new Error(`Dish ${item.id} is too long for a print page.`);
      if (y + height + (needsHeading ? 90 : 0) > 738) {
        newPage();
        heading(category, !needsHeading);
        needsHeading = false;
      }
      if (needsHeading) {
        heading(category);
        needsHeading = false;
      }
      const top = y;
      doc
        .font("serif")
        .fontSize(13)
        .fillColor(ink)
        .text(`${item.code} · ${item.name.mk}`, 45, y, { width: 395 });
      doc
        .rect(456, top - 3, 94, 27)
        .lineWidth(0.6)
        .strokeColor("#b7a17e")
        .stroke();
      doc
        .font("sans")
        .fontSize(10)
        .text(item.formattedPrice, 460, top + 5, {
          width: 86,
          align: "center",
        });
      y += nameHeight + 9;
      doc.font("sans").fontSize(8).fillColor(muted);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 2; col++) {
          const text = translations[row * 2 + col];
          if (text)
            doc.text(text, 45 + col * 260, y, { width: 240, lineGap: 1 });
        }
        y += rows[row] + 4;
      }
      doc
        .fontSize(7.5)
        .text(description, 45, y + 2, { width: 505, lineGap: 1 });
      y += descriptionHeight + 13;
      doc.fontSize(7).text(item.weight, 45, y);
      item.allergens.forEach((id, index) =>
        drawMenuIcon(doc, allergens[id].icon, 105 + index * 23, y - 3, 13),
      );
      y = top + height;
      doc
        .moveTo(45, y - 9)
        .lineTo(550, y - 9)
        .lineWidth(0.35)
        .strokeColor("#ded3bf")
        .stroke();
    }
    y += 9;
  }
  newPage();
  doc
    .font("serif")
    .fontSize(22)
    .fillColor(ink)
    .text("Алергени / Allergens", 45, y, { width: 505 });
  y = doc.y + 12;
  doc
    .font("sans")
    .fontSize(8)
    .fillColor(muted)
    .text(strings.mk.allergenNote + "\n" + strings.en.allergenNote, 45, y, {
      width: 505,
      lineGap: 3,
    });
  y = doc.y + 24;
  for (const allergen of Object.values(allergens)) {
    drawMenuIcon(doc, allergen.icon, 45, y, 18);
    doc
      .font("sans")
      .fontSize(9)
      .fillColor(ink)
      .text(allergen.name.mk!, 78, y, { width: 470 });
    doc
      .fontSize(7)
      .fillColor(muted)
      .text(
        secondaryLanguages
          .map(
            (lang) => `${lang.toUpperCase()} ${localize(allergen.name, lang)}`,
          )
          .join(" · "),
        78,
        y + 15,
        { width: 470 },
      );
    y = doc.y + 15;
  }
  const range = doc.bufferedPageRange();
  for (let index = 1; index < range.count; index++) {
    doc.switchToPage(index);
    doc
      .moveTo(45, 762)
      .lineTo(550, 762)
      .lineWidth(0.5)
      .strokeColor("#cfc8b8")
      .stroke();
    doc
      .font("sans")
      .fontSize(6.5)
      .fillColor(muted)
      .text(restaurant.sampleMenu ? t.draft : t.footer, 45, 774, {
        width: 445,
        lineBreak: false,
      });
    doc.text(`${index} / ${range.count - 1}`, 505, 774, {
      width: 45,
      align: "right",
      lineBreak: false,
    });
  }
  doc.end();
  await new Promise<void>((resolve, reject) => {
    output.on("finish", resolve);
    output.on("error", reject);
    doc.on("error", reject);
  });
  console.log(`Generated ${pdfFilename(language)} (${range.count} A4 pages)`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await generatePDF();
  // Preserve existing bookmarked downloads; every alias contains the same six-language edition.
  for (const language of languages)
    await copyFile(
      `public/menu/${pdfFilename()}`,
      `public/menu/menu-${language}.pdf`,
    );
}

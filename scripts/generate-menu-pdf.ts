import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";
import { brand } from "../src/config/brand";
import { createWriteStream } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { menu } from "../src/data/menu";
import { categories } from "../src/data/categories";
import { allergens } from "../src/data/allergens";
import { restaurant } from "../src/config/restaurant";
import { paginate, localize, pdfFilename } from "../src/features/menu/layout";
import {
  languages,
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
const ink = "#233d32",
  gold = "#8c6c3c",
  muted = "#626253";
export async function generatePDF(language: Language) {
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
  const heading = (name: string, icon: string, continued = false) => {
    drawMenuIcon(doc, icon, 285, y, 24);
    doc
      .moveTo(241, y + 12)
      .lineTo(270, y + 12)
      .strokeColor(gold)
      .lineWidth(0.5)
      .stroke();
    doc
      .moveTo(324, y + 12)
      .lineTo(353, y + 12)
      .stroke();
    y += 36;
    doc.font("serif").fontSize(23).fillColor(ink);
    const title = name + (continued ? ` (${t.continued})` : "");
    const height = doc.heightOfString(title, { width: 505, align: "center" });
    doc.text(title, 45, y, { width: 505, align: "center" });
    y += height + 27;
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
    .text(t.menuCoverTitle, 65, 477, { width: 465, align: "center" });
  doc
    .font("sans")
    .fontSize(8)
    .fillColor(muted)
    .text(t.since, 65, 634, { width: 465, align: "center" });
  doc
    .fontSize(7)
    .text(restaurant.name, 65, 720, { width: 465, align: "center" });
  // Keep category grouping and page order identical to the web book.
  // Printing adds the price column and a final full allergen legend.
  for (const page of paginate(menu, categories)) {
    newPage();
    for (const section of page.sections) {
      const category = categories.find((c) => c.id === section.categoryId)!;
      heading(
        localize(category.name, language),
        category.icon,
        section.continued,
      );
      for (const item of printItems(section.items)) {
        const name = localize(item.name, language),
          ingredients = localize(item.ingredients, language);
        const width = 385;
        doc.font("serif").fontSize(12);
        const nameHeight = doc.heightOfString(name, { width });
        doc.font("sans").fontSize(8.5);
        const ingredientHeight = doc.heightOfString(ingredients, {
          width,
          lineGap: 2,
        });
        const height = nameHeight + ingredientHeight + 48;
        if (height > 570)
          throw new Error(
            `Dish ${item.id} is too long for one print page; shorten its text.`,
          );
        if (y + height > 735) {
          newPage();
          heading(localize(category.name, language), category.icon, true);
        }
        doc
          .font("serif")
          .fontSize(12)
          .fillColor(ink)
          .text(name, 45, y, { width });
        doc
          .font("sans")
          .fontSize(8.5)
          .fillColor(muted)
          .text(ingredients, 45, y + nameHeight + 6, { width, lineGap: 2 });
        const detailY = y + nameHeight + ingredientHeight + 16;
        doc.fontSize(7).text(item.weight, 45, detailY);
        let ax = 100;
        for (const id of item.allergens) {
          const allergen = allergens[id];
          if (!allergen) throw new Error(`Unknown allergen: ${id}`);
          drawMenuIcon(doc, allergen.icon, ax, detailY - 3, 15);
          ax += 23;
        }
        // All item prices use the same right-aligned box independent of description length.
        doc
          .rect(452, y - 4, 98, 34)
          .lineWidth(0.6)
          .strokeColor("#bdb198")
          .stroke();
        doc
          .font("sans")
          .fontSize(10)
          .fillColor(ink)
          .text(item.formattedPrice, 456, y + 7, {
            width: 90,
            align: "center",
          });
        y += height;
        doc
          .moveTo(45, y - 13)
          .lineTo(550, y - 13)
          .lineWidth(0.4)
          .strokeColor("#ded8ca")
          .stroke();
      }
      y += 13;
    }
  }
  newPage();
  heading(t.legend, "leaf");
  doc
    .font("sans")
    .fontSize(9)
    .fillColor(muted)
    .text(t.allergenNote, 45, y, { width: 505, lineGap: 3 });
  y = doc.y + 30;
  for (const allergen of Object.values(allergens)) {
    drawMenuIcon(doc, allergen.icon, 45, y, 19);
    doc.font("sans").fillColor(ink);
    doc.fontSize(10).text(localize(allergen.name, language), 82, y + 3);
    y += 31;
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
  for (const language of languages) await generatePDF(language);
}

import { mkdir, writeFile, copyFile } from "node:fs/promises";
import * as fontkit from "fontkit";
import console from "node:console";
import { brand, archDrawing } from "../src/config/brand.ts";

// Intentionally constructed geometry, never traced from a photograph or raster logo.
const palette = brand;
const serif = fontkit.openSync(
  "node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff",
);
const sans = fontkit.openSync(
  "node_modules/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff",
);
const round = (n) => Math.round(n * 100) / 100;
const point = (r, angle) => {
  const a = (angle * Math.PI) / 180;
  return `${round(64 + r * Math.cos(a))} ${round(62 + r * Math.sin(a))}`;
};
function symbol(color, accent = color) {
  const stones = Array.from({ length: 7 }, (_, i) => {
    const start = 180 + (i * 180) / 7 + 1.5,
      end = 180 + ((i + 1) * 180) / 7 - 1.5;
    return `<path${i === 3 ? ` fill="${accent}"` : ""} d="M${point(54, start)}A54 54 0 0 1 ${point(54, end)}L${point(36, end)}A36 36 0 0 0 ${point(36, start)}Z"/>`;
  }).join("");
  return `<g id="symbol" fill="${color}">${stones}<path d="M10 65h18v24H10zm0 27h18v24H10zm0 27h18v23H10zm90-54h18v24h-18zm0 27h18v24h-18zm0 27h18v23h-18zM8 148h112v6H8z"/><path d="${archDrawing.inner}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
}
function lettering(text, font, x, baseline, width, tracking = 0) {
  const run = font.layout(text);
  const advance =
    run.positions.reduce((sum, p) => sum + p.xAdvance, 0) +
    tracking * (run.glyphs.length - 1);
  const scale = width / advance;
  let cursor = 0;
  const paths = run.glyphs
    .map((glyph, i) => {
      const p = run.positions[i];
      const d = glyph.path
        .toSVG()
        .replace(/-?\d*\.?\d+/g, (n) => String(round(Number(n))));
      const path = `<path transform="translate(${round(cursor + p.xOffset)} ${round(p.yOffset)})" d="${d}"/>`;
      cursor += p.xAdvance + tracking;
      return path;
    })
    .join("");
  return `<g transform="translate(${x} ${baseline}) scale(${round(scale * 100000) / 100000} -${round(scale * 100000) / 100000})">${paths}</g>`;
}
function svg(body, viewBox = "0 0 560 208", title = "Trajche Bezisten") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="title"><title id="title">${title}</title>${body}</svg>\n`;
}
function lockup(color, accent = color) {
  return svg(
    `<g transform="translate(26 23)">${symbol(color, accent)}</g><g id="wordmark" fill="${color}">${lettering("TRAJCHE", serif, 210, 77, 297, 28)}${lettering("BEZISTEN", serif, 192, 143, 334, 12)}</g><g id="subtitle" fill="${color}">${lettering("BITOLA", sans, 327, 180, 66, 200)}<path d="M245 175h58v1.5h-58zm172 0h58v1.5h-58z"/></g>`,
  );
}
await mkdir("public/branding", { recursive: true });
await writeFile(
  "public/branding/logo-primary.svg",
  lockup(palette.dark, palette.copper),
);
await writeFile("public/branding/logo-light.svg", lockup(palette.cream));
await writeFile("public/branding/logo-monochrome.svg", lockup("#000000"));
await writeFile(
  "public/branding/logo-mark.svg",
  svg(symbol(palette.dark), "0 0 128 160"),
);
// Fewer joints and a heavier doorway keep the family resemblance at 16px.
await writeFile(
  "public/favicon.svg",
  svg(
    `<rect width="32" height="34" rx="3" fill="${palette.cream}"/><path fill="${palette.dark}" d="M5 27V14a11 11 0 0 1 22 0v13h-4V14a7 7 0 0 0-14 0v13zm-2 2h26v3H3z"/><path d="M12 27V15a4 4 0 0 1 8 0v12" fill="none" stroke="${palette.dark}" stroke-width="2"/>`,
    "0 0 32 34",
  ),
);
await copyFile(
  "node_modules/@fontsource/cormorant-garamond/LICENSE",
  "public/branding/FONT-LICENSE-Cormorant.txt",
);
await copyFile(
  "node_modules/@fontsource/dm-sans/LICENSE",
  "public/branding/FONT-LICENSE-DM-Sans.txt",
);
console.log(
  "Generated four standalone outlined SVG logos and a simplified favicon.",
);

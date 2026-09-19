import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SVGtoPDF from "svg-to-pdfkit";
import { Icon } from "../src/components/Icons";

// Print the very same Lucide SVG used by the web menu as crisp vector paths.
export function drawMenuIcon(
  doc: PDFKit.PDFDocument,
  name: string,
  x: number,
  y: number,
  size: number,
) {
  const svg = renderToStaticMarkup(
    createElement(Icon, { name, size }),
  ).replaceAll("currentColor", "#233d32");
  SVGtoPDF(doc, svg, x, y, { width: size, height: size, assumePt: true });
}

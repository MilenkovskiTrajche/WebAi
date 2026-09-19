import React from "react";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Logo, LogoMark } from "../src/components/Logo";

describe("reusable vector identity", () => {
  for (const variant of ["primary", "light", "monochrome", "mark"]) {
    it(`${variant} is self-contained vector artwork`, async () => {
      const svg = await readFile(`public/branding/logo-${variant}.svg`, "utf8");
      expect(svg).toContain('<title id="title">Trajche Bezisten</title>');
      expect(svg).toContain('role="img"');
      expect(svg).toContain('viewBox="0 0');
      expect(svg).toContain('id="symbol"');
      expect(svg).not.toMatch(
        /<image\b|<text\b|<script\b|base64|@font-face|font-family|xlink:href|foreignObject/,
      );
      expect(svg.length).toBeLessThan(35000);
      if (variant !== "mark") {
        expect(svg).toContain('id="wordmark"');
        expect(svg).toContain('id="subtitle"');
      }
      if (variant === "monochrome")
        expect(
          [...svg.matchAll(/#[0-9A-Fa-f]{6}/g)].every(
            (match) => match[0] === "#000000",
          ),
        ).toBe(true);
    });
  }
  it("gives identity instances a name and decorative instances empty alt", () => {
    expect(renderToStaticMarkup(<Logo linked />)).toContain(
      'alt="Trajche Bezisten"',
    );
    expect(renderToStaticMarkup(<Logo linked />)).toContain('href="/"');
    expect(renderToStaticMarkup(<LogoMark decorative />)).toContain('alt=""');
    expect(renderToStaticMarkup(<Logo variant="light" />)).toContain(
      "/branding/logo-light.svg",
    );
    expect(renderToStaticMarkup(<Logo variant="monochrome" />)).toContain(
      "/branding/logo-monochrome.svg",
    );
  });
  it("keeps the favicon to an architectural mark", async () => {
    const svg = await readFile("public/favicon.svg", "utf8");
    expect(svg).not.toMatch(/<text\b|<image\b|wordmark/);
    expect(svg).toContain("<path");
    expect(svg.length).toBeLessThan(1000);
  });
});

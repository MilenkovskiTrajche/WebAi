import { readFile, writeFile, mkdir } from "node:fs/promises";
import { restaurant } from "../src/config/restaurant";
const html = await readFile("dist/index.html", "utf8");
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
// Emit real route files; a top-level 404.html keeps unknown routes at HTTP 404 on Cloudflare Pages.
for (const route of ["", "menu", "privacy", "404"]) {
  const title =
    route === "menu"
      ? "The menu"
      : route === "privacy"
        ? "Privacy"
        : route === "404"
          ? "404"
          : "A place at the table";
  let output = html.replace(
    /<title>.*?<\/title>/,
    `<title>${title} · ${escape(restaurant.name)}</title>`,
  );
  if (restaurant.sampleMenu || restaurant.nameIsPlaceholder || route === "404")
    output = output.replace(
      "</head>",
      '<meta name="robots" content="noindex, nofollow"/></head>',
    );
  if (restaurant.domain && route !== "404") {
    const url = new URL(
      route,
      restaurant.domain.endsWith("/")
        ? restaurant.domain
        : restaurant.domain + "/",
    ).href;
    output = output.replace(
      "</head>",
      `<link rel="canonical" href="${escape(url)}"/><meta property="og:url" content="${escape(url)}"/></head>`,
    );
    if (restaurant.socialImage)
      output = output.replace(
        "</head>",
        `<meta property="og:image" content="${escape(new URL(restaurant.socialImage, restaurant.domain).href)}"/></head>`,
      );
    if (!restaurant.nameIsPlaceholder && restaurant.address)
      output = output.replace(
        "</head>",
        `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Restaurant", name: restaurant.name, address: restaurant.address, url: restaurant.domain, foundingDate: String(restaurant.established), ...(restaurant.phone ? { telephone: restaurant.phone } : {}) }).replace(/</g, "\\u003c")}</script></head>`,
      );
  }
  if (route && route !== "404") {
    await mkdir(`dist/${route}`, { recursive: true });
    await writeFile(`dist/${route}/index.html`, output);
  } else
    await writeFile(`dist/${route === "404" ? "404" : "index"}.html`, output);
}
const ready =
  restaurant.domain && !restaurant.nameIsPlaceholder && !restaurant.sampleMenu;
await writeFile(
  "dist/robots.txt",
  `User-agent: *\n${ready ? "Allow: /" : "Disallow: /"}\n${ready ? `Sitemap: ${new URL("sitemap.xml", restaurant.domain!).href}\n` : ""}`,
);
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${ready ? ["", "menu", "privacy"].map((route) => `<url><loc>${escape(new URL(route, restaurant.domain!.endsWith("/") ? restaurant.domain! : restaurant.domain! + "/").href)}</loc></url>`).join("") : ""}</urlset>`,
);

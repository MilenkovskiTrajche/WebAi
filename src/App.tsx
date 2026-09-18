import { lazy, Suspense, useEffect } from "react";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import { useLanguage } from "./i18n/LanguageContext";
import { restaurant } from "./config/restaurant";
const Menu = lazy(() => import("./pages/Menu"));
export default function App() {
  const { t, language } = useLanguage();
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const valid = ["/", "/menu", "/privacy"].includes(path);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = `${path === "/menu" ? t.menu : path === "/privacy" ? t.privacy : !valid ? "404" : t.title} · ${restaurant.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t.description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", t.description);
  }, [t, language, path, valid]);
  return (
    <Layout>
      {path === "/" ? (
        <Home />
      ) : path === "/menu" ? (
        <Suspense
          fallback={
            <main id="main" className="text-page">
              <h1>{t.menu}</h1>
              <p>{t.empty}</p>
            </main>
          }
        >
          <Menu />
        </Suspense>
      ) : path === "/privacy" ? (
        <main id="main" className="text-page">
          <p className="eyebrow">{t.privacy}</p>
          <h1>{t.privacyTitle}</h1>
          <p>{t.privacyBody}</p>
          <p>{t.privacyPending}</p>
        </main>
      ) : (
        <main id="main" className="text-page">
          <p className="eyebrow">404</p>
          <h1>{t.notFound}</h1>
          <p>{t.notFoundText}</p>
          <div className="error-actions">
            <a className="button" href="/">
              {t.back}
            </a>
            <a className="underlined-link" href="/menu">
              {t.readMenu}
            </a>
          </div>
        </main>
      )}
    </Layout>
  );
}

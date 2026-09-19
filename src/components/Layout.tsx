import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { restaurant } from "../config/restaurant";
import { useLanguage } from "../i18n/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
export function Logo() {
  return (
    <a href="/" className="logo" aria-label={restaurant.name}>
      <svg
        viewBox="0 0 48 48"
        width="39"
        height="39"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 41V21a17 17 0 0 1 34 0v20M14 41V22a10 10 0 0 1 20 0v19M21 41V23a3 3 0 0 1 6 0v18M4 41h40"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      <span>
        {restaurant.name}
        <small>BITOLA · {restaurant.established}</small>
      </span>
    </a>
  );
}
export function Layout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <>
      <a className="skip" href="#main">
        {t.skip}
      </a>
      <header className="header" ref={header}>
        <Logo />
        <nav
          id="navigation"
          className={open ? "navigation is-open" : "navigation"}
          aria-label={t.openNav}
          onClick={() => setOpen(false)}
        >
          <a href="/">{t.home}</a>
          <a href="/#location">{t.location}</a>
          <a className="nav-menu" href="/menu">
            {t.menu}
            <ArrowUpRight size={15} />
          </a>
        </nav>
        <LanguageSelector />
        <button
          className="mobile-toggle icon-button"
          ref={button}
          aria-label={open ? t.closeNav : t.openNav}
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>
      {children}
      <footer>
        <div className="footer-main">
          <div>
            <Logo />
            <p>{t.footer}</p>
          </div>
          <nav aria-label={t.menu}>
            <a href="/menu">{t.menu}</a>
            <a href="/#location">{t.location}</a>
            <a href="/privacy">{t.privacy}</a>
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone.replace(/\s/g, "")}`}>
                {restaurant.phone}
              </a>
            )}
            {restaurant.mapsUrl && (
              <a href={restaurant.mapsUrl} target="_blank" rel="noreferrer">
                {t.maps}
              </a>
            )}
          </nav>
          <p className="footer-place">
            {t.place}
            <br />
            {restaurant.address || t.locationText}
          </p>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {restaurant.name}
          </span>
          {restaurant.nameIsPlaceholder && <span>{t.workingName}</span>}
        </div>
      </footer>
    </>
  );
}

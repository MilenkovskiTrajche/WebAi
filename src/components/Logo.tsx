import { brand, archDrawing } from "../config/brand";
import { restaurant } from "../config/restaurant";
import { useLanguage } from "../i18n/LanguageContext";

type Variant = "primary" | "light" | "monochrome";
export function Logo({
  variant = "primary",
  linked = false,
  decorative = false,
  className = "",
}: {
  variant?: Variant;
  linked?: boolean;
  decorative?: boolean;
  className?: string;
}) {
  const image = (
    <img
      src={brand[variant]}
      width={560}
      height={208}
      alt={decorative ? "" : restaurant.name}
      className={`brand-logo ${className}`}
    />
  );
  return linked ? (
    <a className="logo" href="/">
      {image}
    </a>
  ) : (
    image
  );
}
export function LogoMark({
  decorative = false,
  className = "",
}: {
  decorative?: boolean;
  className?: string;
}) {
  return (
    <img
      className={`brand-mark ${className}`}
      src={brand.mark}
      width={128}
      height={160}
      alt={decorative ? "" : restaurant.name}
    />
  );
}
// Used only by the existing lazy-menu fallback; it never delays menu access.
export function BrandLoading() {
  const { t } = useLanguage();
  return (
    <div className="brand-loading" role="status">
      <div className="brand-loading-drawing" aria-hidden="true">
        <LogoMark decorative />
        <svg viewBox="0 0 128 160" fill="none" aria-hidden="true">
          <path
            className="draw-outer"
            d={archDrawing.outer}
            pathLength="1"
            strokeWidth="18"
          />
          <path
            className="draw-inner"
            d={archDrawing.inner}
            pathLength="1"
            strokeWidth="5"
          />
          <path
            className="draw-sill"
            d={archDrawing.sill}
            pathLength="1"
            strokeWidth="6"
          />
        </svg>
      </div>
      <p>{t.empty}</p>
    </div>
  );
}

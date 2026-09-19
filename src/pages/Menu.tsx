import { Logo } from "../components/Logo";
import MenuBook from "../features/menu/MenuBook";
import { useLanguage } from "../i18n/LanguageContext";
import { restaurant } from "../config/restaurant";
export default function Menu() {
  const { t } = useLanguage();
  return (
    <main id="main" className="menu-main">
      <div className="menu-heading">
        <Logo className="menu-cover-logo" />
        <p className="eyebrow">
          {t.traditionalRestaurant} · {t.place}
        </p>
        <h1>{t.menu}</h1>
        <p>{t.menuSubtitle}</p>
        {restaurant.sampleMenu && (
          <small className="sample-note">{t.sample}</small>
        )}
      </div>
      <MenuBook />
    </main>
  );
}

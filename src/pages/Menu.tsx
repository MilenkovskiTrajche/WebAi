import MenuBook from '../features/menu/MenuBook';
import { useLanguage } from '../i18n/LanguageContext';
import { restaurant } from '../config/restaurant';
export default function Menu(){const {t}=useLanguage();return <main id="main" className="menu-main"><div className="menu-heading"><p className="eyebrow">{t.place} <span> / </span> {restaurant.established}</p><h1>{t.menu}</h1><p>{t.menuSubtitle}</p>{restaurant.sampleMenu&&<small className="sample-note">{t.sample}</small>}</div><MenuBook/></main>;}

import { useLanguage } from "../i18n/LanguageContext";
import type { Language } from "../features/menu/types";
export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <label className="language-select">
      <span className="sr-only">{t.language}</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
      >
        <option value="mk">MK</option>
        <option value="en">EN</option>
        <option value="de">DE</option>
      </select>
    </label>
  );
}

export function MenuLanguageSelector() {
  const { secondary, setSecondary } = useLanguage();
  return (
    <label className="language-select menu-language-select">
      <span lang="mk">МК +</span>
      <select
        aria-label="Secondary menu language / Втор јазик"
        value={secondary}
        onChange={(e) =>
          setSecondary(
            e.target
              .value as import("../features/menu/types").SecondaryLanguage,
          )
        }
      >
        <option value="en" aria-label="English">
          EN
        </option>
        <option value="de" aria-label="Deutsch">
          DE
        </option>
        <option value="el" aria-label="Ελληνικά">
          GR
        </option>
        <option value="sr" aria-label="Српски">
          SR
        </option>
        <option value="sq" aria-label="Shqip">
          AL
        </option>
      </select>
    </label>
  );
}

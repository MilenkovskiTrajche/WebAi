import { useLanguage } from "../i18n/LanguageContext";
import {
  secondaryLanguages,
  type SecondaryLanguage,
  type Language,
} from "../features/menu/types";
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
        onChange={(e) => setSecondary(e.target.value as SecondaryLanguage)}
      >
        {secondaryLanguages.map((code) => (
          <option key={code} value={code} aria-label={languageNames[code]}>
            {languageCodes[code]}
          </option>
        ))}
      </select>
    </label>
  );
}

const languageNames: Record<SecondaryLanguage, string> = {
  en: "English",
  de: "Deutsch",
  el: "Ελληνικά",
  sr: "Српски",
  sq: "Shqip",
};
const languageCodes: Record<SecondaryLanguage, string> = {
  en: "EN",
  de: "DE",
  el: "GR",
  sr: "SR",
  sq: "AL",
};

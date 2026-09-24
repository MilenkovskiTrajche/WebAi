import { createContext, useContext, useState, type ReactNode } from "react";
import type { Language, SecondaryLanguage } from "../features/menu/types";
import { detectLanguage } from "../features/menu/layout";
import { strings } from "./strings";
const detectSiteLanguage = (value: string | null): Language => {
  const language = detectLanguage(value);
  return language === "mk" || language === "de" ? language : "en";
};
const Context = createContext({
  language: "en" as Language,
  setLanguage: (_language: Language) => {},
  t: strings.en,
  secondary: "en" as SecondaryLanguage,
  setSecondary: (_language: SecondaryLanguage) => {},
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, set] = useState<Language>(() => {
    try {
      return detectSiteLanguage(
        localStorage.getItem("restaurant-language") || navigator.language,
      );
    } catch {
      return detectSiteLanguage(navigator.language);
    }
  });
  const [secondary, setSecondaryState] = useState<SecondaryLanguage>(() => {
    try {
      const saved = detectLanguage(
        localStorage.getItem("menu-secondary-language") || navigator.language,
      );
      return saved === "mk" ? "en" : saved;
    } catch {
      return "en";
    }
  });
  const setSecondary = (value: SecondaryLanguage) => {
    setSecondaryState(value);
    try {
      localStorage.setItem("menu-secondary-language", value);
    } catch {
      /* Optional browser preference. */
    }
  };
  const setLanguage = (lang: Language) => {
    set(lang);
    try {
      localStorage.setItem("restaurant-language", lang);
    } catch {
      /* Browsing without storage still works. */
    }
  };
  return (
    <Context.Provider
      value={{
        language,
        setLanguage,
        t: strings[language],
        secondary,
        setSecondary,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useLanguage = () => useContext(Context);

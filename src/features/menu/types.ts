export const languages = ["mk", "en", "de", "el", "sr", "sq"] as const;
export type Language = (typeof languages)[number];
export type Localized = { en: string } & Partial<Record<Language, string>>;
export type SecondaryLanguage = Exclude<Language, "mk">;
export const secondaryLanguages = languages.filter(
  (language): language is SecondaryLanguage => language !== "mk",
);
export interface Category {
  id: string;
  name: Localized;
  icon: string;
  order: number;
}
export interface MenuItem {
  code: string;
  id: string;
  categoryId: string;
  name: Localized;
  ingredients: Localized;
  weight: string;
  allergens: string[];
  price: number;
  dietaryLabels?: string[];
  image?: string;
  enabled: boolean;
  order: number;
}
export interface MenuSection {
  categoryId: string;
  items: MenuItem[];
  continued: boolean;
}
export interface MenuPageData {
  sections: MenuSection[];
}

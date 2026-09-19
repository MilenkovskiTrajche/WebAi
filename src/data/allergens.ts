import type { Localized } from "../features/menu/types";
export interface Allergen {
  code: string;
  icon: string;
  name: Localized;
}
export const allergens: Record<string, Allergen> = {
  gluten: {
    code: "01",
    icon: "wheat",
    name: { en: "Gluten", mk: "Глутен", de: "Gluten" },
  },
  crustaceans: {
    code: "02",
    icon: "crustacean",
    name: { en: "Crustaceans", mk: "Ракови", de: "Krebstiere" },
  },
  eggs: {
    code: "03",
    icon: "egg",
    name: { en: "Eggs", mk: "Јајца", de: "Eier" },
  },
  fish: {
    code: "04",
    icon: "fish",
    name: { en: "Fish", mk: "Риба", de: "Fisch" },
  },
  peanuts: {
    code: "05",
    icon: "peanut",
    name: { en: "Peanuts", mk: "Кикиритки", de: "Erdnüsse" },
  },
  soy: {
    code: "06",
    icon: "bean",
    name: { en: "Soy", mk: "Соја", de: "Soja" },
  },
  dairy: {
    code: "07",
    icon: "milk",
    name: { en: "Milk", mk: "Млеко", de: "Milch" },
  },
  nuts: {
    code: "08",
    icon: "nut",
    name: { en: "Tree nuts", mk: "Јаткасти плодови", de: "Schalenfrüchte" },
  },
  celery: {
    code: "09",
    icon: "leaf",
    name: { en: "Celery", mk: "Целер", de: "Sellerie" },
  },
  mustard: {
    code: "10",
    icon: "seed",
    name: { en: "Mustard", mk: "Сенф", de: "Senf" },
  },
  sesame: {
    code: "11",
    icon: "sesame",
    name: { en: "Sesame", mk: "Сусам", de: "Sesam" },
  },
  sulphites: {
    code: "12",
    icon: "wine",
    name: { en: "Sulphites", mk: "Сулфити", de: "Sulfite" },
  },
  lupin: {
    code: "13",
    icon: "flower",
    name: { en: "Lupin", mk: "Лупина", de: "Lupinen" },
  },
  molluscs: {
    code: "14",
    icon: "shell",
    name: { en: "Molluscs", mk: "Мекотели", de: "Weichtiere" },
  },
};

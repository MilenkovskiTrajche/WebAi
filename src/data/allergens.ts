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
    name: {
      en: "Gluten",
      mk: "Глутен",
      de: "Gluten",
      el: "Γλουτένη",
      sr: "Глутен",
      sq: "Gluten",
    },
  },
  crustaceans: {
    code: "02",
    icon: "crustacean",
    name: {
      en: "Crustaceans",
      mk: "Ракови",
      de: "Krebstiere",
      el: "Καρκινοειδή",
      sr: "Ракови",
      sq: "Krustace",
    },
  },
  eggs: {
    code: "03",
    icon: "egg",
    name: {
      en: "Eggs",
      mk: "Јајца",
      de: "Eier",
      el: "Αυγά",
      sr: "Јаја",
      sq: "Vezë",
    },
  },
  fish: {
    code: "04",
    icon: "fish",
    name: {
      en: "Fish",
      mk: "Риба",
      de: "Fisch",
      el: "Ψάρια",
      sr: "Риба",
      sq: "Peshk",
    },
  },
  peanuts: {
    code: "05",
    icon: "peanut",
    name: {
      en: "Peanuts",
      mk: "Кикиритки",
      de: "Erdnüsse",
      el: "Αράπικα φιστίκια",
      sr: "Кикирики",
      sq: "Kikirikë",
    },
  },
  soy: {
    code: "06",
    icon: "bean",
    name: {
      en: "Soy",
      mk: "Соја",
      de: "Soja",
      el: "Σόγια",
      sr: "Соја",
      sq: "Sojë",
    },
  },
  dairy: {
    code: "07",
    icon: "milk",
    name: {
      en: "Milk",
      mk: "Млеко",
      de: "Milch",
      el: "Γάλα",
      sr: "Млеко",
      sq: "Qumësht",
    },
  },
  nuts: {
    code: "08",
    icon: "nut",
    name: {
      en: "Tree nuts",
      mk: "Јаткасти плодови",
      de: "Schalenfrüchte",
      el: "Καρποί με κέλυφος",
      sr: "Језграсто воће",
      sq: "Fruta arrore",
    },
  },
  celery: {
    code: "09",
    icon: "leaf",
    name: {
      en: "Celery",
      mk: "Целер",
      de: "Sellerie",
      el: "Σέλινο",
      sr: "Целер",
      sq: "Selino",
    },
  },
  mustard: {
    code: "10",
    icon: "seed",
    name: {
      en: "Mustard",
      mk: "Сенф",
      de: "Senf",
      el: "Μουστάρδα",
      sr: "Сенф",
      sq: "Mustardë",
    },
  },
  sesame: {
    code: "11",
    icon: "sesame",
    name: {
      en: "Sesame",
      mk: "Сусам",
      de: "Sesam",
      el: "Σουσάμι",
      sr: "Сусам",
      sq: "Susam",
    },
  },
  sulphites: {
    code: "12",
    icon: "wine",
    name: {
      en: "Sulphites",
      mk: "Сулфити",
      de: "Sulfite",
      el: "Θειώδη",
      sr: "Сулфити",
      sq: "Sulfite",
    },
  },
  lupin: {
    code: "13",
    icon: "flower",
    name: {
      en: "Lupin",
      mk: "Лупина",
      de: "Lupinen",
      el: "Λούπινο",
      sr: "Лупина",
      sq: "Lupinë",
    },
  },
  molluscs: {
    code: "14",
    icon: "shell",
    name: {
      en: "Molluscs",
      mk: "Мекотели",
      de: "Weichtiere",
      el: "Μαλάκια",
      sr: "Мекушци",
      sq: "Molusqe",
    },
  },
};

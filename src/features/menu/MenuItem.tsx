import type { MenuItem as Item, Language } from "./types";
import { localize } from "./layout";
import { allergens } from "../../data/allergens";
import { Icon } from "../../components/Icons";
export function AllergenIcon({
  id,
  language,
}: {
  id: string;
  language: Language;
}) {
  const allergen = allergens[id];
  if (!allergen) return null;
  return (
    <span
      className="allergen"
      role="img"
      aria-label={localize(allergen.name, language)}
      title={localize(allergen.name, language)}
    >
      <Icon name={allergen.icon} size={17} />
    </span>
  );
}
// The web presentation deliberately never reads price, including aria labels and data attributes.
export function MenuItem({
  item,
  language,
}: {
  item: Item;
  language: Language;
}) {
  return (
    <article className="dish">
      <h3 lang="mk">
        <span className="dish-code">{item.code}</span>
        {item.name.mk || item.name.en}
      </h3>
      <p className="dish-translation" lang={language}>
        {localize(item.name, language)}
      </p>
      <p
        className="dish-description"
        lang={item.ingredients[language] ? language : "en"}
      >
        {localize(item.ingredients, language)}
      </p>
      <div className="dish-details">
        <span>{item.weight}</span>
        {item.allergens.map((id) => (
          <AllergenIcon key={id} id={id} language={language} />
        ))}
      </div>
    </article>
  );
}

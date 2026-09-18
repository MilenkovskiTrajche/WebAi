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
      <Icon name={allergen.icon} size={14} />
      <span aria-hidden="true">{allergen.code}</span>
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
      <h3>{localize(item.name, language)}</h3>
      <p>{localize(item.ingredients, language)}</p>
      <div className="dish-details">
        <span>{item.weight}</span>
        {item.allergens.map((id) => (
          <AllergenIcon key={id} id={id} language={language} />
        ))}
      </div>
    </article>
  );
}

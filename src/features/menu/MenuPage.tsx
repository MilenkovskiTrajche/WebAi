import type { MenuPageData, Language } from "./types";
import { categories } from "../../data/categories";
import { localize } from "./layout";
import { MenuItem } from "./MenuItem";
import { restaurant } from "../../config/restaurant";
import { strings } from "../../i18n/strings";

export function MenuPage({
  page,
  index,
  language,
}: {
  page: MenuPageData;
  index: number;
  language: Language;
}) {
  return (
    <section
      className="menu-page"
      aria-label={`${strings[language].page} ${index + 1}`}
    >
      <div className="page-running">
        <span>{restaurant.name}</span>
        <span>{restaurant.established}</span>
      </div>
      <div className="page-content">
        {page.sections.map((section) => {
          const category = categories.find((c) => c.id === section.categoryId)!;
          return (
            <section
              key={section.categoryId}
              className={`menu-category category-${category.id}`}
            >
              <p className="menu-section-label" lang="mk">
                {category.order >= 90 ? "ПИЈАЛОЦИ" : "КУЈНА"}
              </p>
              <h2 lang="mk">{category.name.mk}</h2>
              <p className="category-translation" lang={language}>
                {localize(category.name, language)}
              </p>
              <div className="category-flourish" aria-hidden="true">
                <span />◆<span />
              </div>
              {section.continued && (
                <p className="continued">{strings[language].continued}</p>
              )}
              {section.items.map((item) => (
                <MenuItem item={item} language={language} key={item.id} />
              ))}
            </section>
          );
        })}
      </div>
      <div className="page-number">
        <span /> {String(index + 1).padStart(2, "0")} <span />
      </div>
    </section>
  );
}

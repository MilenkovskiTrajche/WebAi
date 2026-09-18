import type { Category, Language, Localized, MenuItem, MenuPageData } from './types';
export const localize = (value: Localized, lang: Language) => value[lang] || value.en;
export function detectLanguage(value: string | null): Language { const code = value?.split('-')[0].toLowerCase(); return code === 'mk' || code === 'de' ? code : 'en'; }
export const pdfFilename = (lang: Language) => `menu-${lang}.pdf`;
export const spreadForPage = (page: number) => Math.floor(page / 2) * 2;
export const orderedCategories = (categories: Category[]) => [...categories].sort((a,b) => a.order - b.order);
export const activeItems = (items: MenuItem[], categoryId: string) => items.filter(i => i.enabled && i.categoryId === categoryId).sort((a,b) => a.order - b.order || a.id.localeCompare(b.id));
// Content-based budget considers the longest translation. Categories can continue across pages,
// and the next category can begin on the same page. No category-to-spread assumption.
export function paginate(items: MenuItem[], categories: Category[], capacity = 16): MenuPageData[] {
 const pages: MenuPageData[] = []; let page: MenuPageData = {sections:[]}; let used = 0;
 for (const category of orderedCategories(categories)) {
  const dishes = activeItems(items, category.id); let continued = false;
  for (const item of dishes) {
   const longest = Math.max(...Object.values(item.ingredients).map(s => s.length));
   const cost = 2 + Math.ceil(longest / 65);
   const newSection = page.sections.at(-1)?.categoryId !== category.id;
   if (used && used + cost + (newSection ? 2 : 0) > capacity) { pages.push(page); page = {sections:[]}; used = 0; }
   if (page.sections.at(-1)?.categoryId !== category.id) { page.sections.push({categoryId:category.id,items:[],continued}); used += 2; }
   page.sections.at(-1)!.items.push(item); used += cost; continued = true;
  }
 }
 if(page.sections.length) pages.push(page);
 return pages;
}
export function categoryPageMap(pages: MenuPageData[]): Record<string,number> { const map: Record<string,number> = {}; pages.forEach((page,index)=>page.sections.forEach(s=>{map[s.categoryId] ??= index;})); return map; }

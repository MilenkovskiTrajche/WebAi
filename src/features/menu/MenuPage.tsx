import type { MenuPageData, Language } from './types';
import { categories } from '../../data/categories';
import { localize } from './layout';
import { MenuItem } from './MenuItem';
import { restaurant } from '../../config/restaurant';
import { strings } from '../../i18n/strings';
import { Icon } from '../../components/Icons';
export function MenuPage({page,index,language}:{page:MenuPageData;index:number;language:Language}){return <section className="menu-page" aria-label={`${strings[language].page} ${index+1}`}><div className="page-running"><span>{restaurant.name}</span><span>{restaurant.established}</span></div><div className="page-content">{page.sections.map(section=>{const category=categories.find(c=>c.id===section.categoryId)!;return <section key={section.categoryId} className="menu-category"><div className="category-flourish"><span/><Icon name={category.icon} size={24}/><span/></div><h2>{localize(category.name,language)}</h2>{section.continued&&<p className="continued">{strings[language].continued}</p>}{section.items.map(item=><MenuItem item={item} language={language} key={item.id}/>)}</section>;})}</div><div className="page-number"><span/> {String(index+1).padStart(2,'0')} <span/></div></section>;}

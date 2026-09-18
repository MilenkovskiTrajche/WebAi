import { useEffect, useRef, useState } from 'react';
import { menu } from '../../data/menu';
import { categories } from '../../data/categories';
import { allergens } from '../../data/allergens';
import { paginate, categoryPageMap, localize, orderedCategories, spreadForPage } from './layout';
import { MenuPage } from './MenuPage';
import { MenuToolbar } from './MenuToolbar';
import { AllergenIcon } from './MenuItem';
import { Icon } from '../../components/Icons';
import { useLanguage } from '../../i18n/LanguageContext';
const pages=paginate(menu,categories);const categoryMap=categoryPageMap(pages);
export default function MenuBook(){const {t,language}=useLanguage();const [desktop,setDesktop]=useState(()=>window.matchMedia('(min-width: 900px)').matches);const [page,setPage]=useState(0);const [zoom,setZoom]=useState(100);const [direction,setDirection]=useState(0);const [turnId,setTurnId]=useState(0);const [turningPage,setTurningPage]=useState<number|null>(null);const gesture=useRef<{x:number;y:number}|null>(null);const step=desktop?2:1;const shown=desktop?spreadForPage(page):page;
 useEffect(()=>{const query=window.matchMedia('(min-width: 900px)');const update=()=>setDesktop(query.matches);query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
 useEffect(()=>{if(turningPage===null)return;const timer=setTimeout(()=>setTurningPage(null),680);return()=>clearTimeout(timer);},[turningPage,turnId]);
 const animate=(dir:number)=>{setDirection(dir);setTurnId(id=>id+1);if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)setTurningPage(dir>0?Math.min(shown+step-1,pages.length-1):shown);};
 const turn=(dir:number)=>{const next=shown+dir*step;if(next<0||next>=pages.length)return;animate(dir);setPage(next);};
 if(!pages.length)return <p>{t.empty}</p>;
 return <div className="menu-experience" role="region" aria-label={t.menuBook} tabIndex={0} onKeyDown={e=>{if(e.altKey||e.metaKey||e.ctrlKey||e.shiftKey||['SELECT','INPUT','TEXTAREA','A'].includes((e.target as HTMLElement).tagName))return;if(e.key==='ArrowRight'){e.preventDefault();turn(1);}if(e.key==='ArrowLeft'){e.preventDefault();turn(-1);}}}>
 <nav className="category-nav" aria-label={t.categories}>{orderedCategories(categories).filter(c=>categoryMap[c.id]!==undefined).map(c=><button key={c.id} aria-current={pages.slice(shown,shown+step).some(p=>p.sections.some(s=>s.categoryId===c.id))?'page':undefined} onClick={()=>{const target=categoryMap[c.id];animate(target<shown?-1:1);setPage(target);}}><Icon name={c.icon}/><span>{localize(c.name,language)}</span></button>)}</nav>
 <MenuToolbar page={shown} count={pages.length} step={step} turn={turn} zoom={zoom} setZoom={setZoom}/>
 <div className="book-viewport" onTouchStart={e=>{gesture.current=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;}} onTouchEnd={e=>{const start=gesture.current;gesture.current=null;if(!start||zoom!==100)return;const dx=e.changedTouches[0].clientX-start.x;const dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)turn(dx<0?1:-1);}}>
 <div className={`menu-spread ${desktop?'two-pages':'one-page'} ${direction>0?'turn-forward':'turn-backward'}`} key={`${shown}-${turnId}`} style={{fontSize:`${zoom}%`}}><MenuPage page={pages[shown]} index={shown} language={language}/>{desktop&&(pages[shown+1]?<MenuPage page={pages[shown+1]} index={shown+1} language={language}/>:<div className="menu-page end-page"><Icon name="utensils" size={36}/><p>{t.footer}</p></div>)}</div>{turningPage!==null&&<div key={turnId} className={`turning-sheet ${desktop?'desktop-sheet':'mobile-sheet'} ${direction>0?'sheet-forward':'sheet-backward'}`} aria-hidden="true" inert style={{fontSize:`${zoom}%`}}><MenuPage page={pages[turningPage]} index={turningPage} language={language}/></div>}</div>
 <p className="swipe-hint"><span>←</span>{t.swipe}<span>→</span></p><details className="allergen-legend"><summary>{t.allergens}</summary><p>{t.allergenNote}</p><div>{Object.entries(allergens).map(([id,a])=><span key={id}><AllergenIcon id={id} language={language}/>{localize(a.name,language)}</span>)}</div></details></div>;
}

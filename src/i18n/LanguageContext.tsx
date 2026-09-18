import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Language } from '../features/menu/types';
import { detectLanguage } from '../features/menu/layout';
import { strings } from './strings';
const Context = createContext({language:'en' as Language,setLanguage:(_language:Language)=>{},t:strings.en});
export function LanguageProvider({children}:{children:ReactNode}) {
 const [language,set] = useState<Language>(()=>{try{return detectLanguage(localStorage.getItem('restaurant-language') || navigator.language);}catch{return detectLanguage(navigator.language);}});
 const setLanguage=(lang:Language)=>{set(lang);try{localStorage.setItem('restaurant-language',lang);}catch{/* Browsing without storage still works. */}};
 return <Context.Provider value={{language,setLanguage,t:strings[language]}}>{children}</Context.Provider>;
}
export const useLanguage=()=>useContext(Context);

import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../features/menu/types';
export function LanguageSelector(){const {language,setLanguage,t}=useLanguage();return <label className="language-select"><span className="sr-only">{t.language}</span><select value={language} onChange={e=>setLanguage(e.target.value as Language)}><option value="mk">MK</option><option value="en">EN</option><option value="de">DE</option></select></label>;}

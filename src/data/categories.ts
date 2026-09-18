import type { Category } from '../features/menu/types';
export const categories: Category[] = [
 {id:'breakfast',name:{en:'A slow beginning',mk:'Убав почеток',de:'Ein ruhiger Anfang'},icon:'sun',order:10},
 {id:'salads',name:{en:'From the garden',mk:'Од градината',de:'Aus dem Garten'},icon:'leaf',order:20},
 {id:'mains',name:{en:'Around the table',mk:'Околу трпезата',de:'Am gemeinsamen Tisch'},icon:'utensils',order:30},
 {id:'desserts',name:{en:'Something sweet',mk:'Нешто слатко',de:'Etwas Süßes'},icon:'cake',order:40},
 {id:'drinks',name:{en:'Raise a glass',mk:'Да наздравиме',de:'Zum Wohl'},icon:'wine',order:50},
];

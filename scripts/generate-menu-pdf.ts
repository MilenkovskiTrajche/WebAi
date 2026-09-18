import PDFDocument from 'pdfkit';
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { menu } from '../src/data/menu';
import { categories } from '../src/data/categories';
import { allergens } from '../src/data/allergens';
import { restaurant } from '../src/config/restaurant';
import { activeItems, localize, orderedCategories, pdfFilename } from '../src/features/menu/layout';
import { languages, type Language, type MenuItem } from '../src/features/menu/types';
import { strings } from '../src/i18n/strings';
export const formatPrice=(price:number)=>`${new Intl.NumberFormat('en-GB',{maximumFractionDigits:2}).format(price)} ${restaurant.currency.symbol}`;
export const printItems=(items:MenuItem[])=>items.filter(item=>item.enabled).map(item=>({...item,formattedPrice:formatPrice(item.price)}));
const ink='#233d32', gold='#8c6c3c', muted='#626253';
export async function generatePDF(language:Language){
 await mkdir('public/menu',{recursive:true});
 const doc=new PDFDocument({size:'A4',margin:45,bufferPages:true,autoFirstPage:false,info:{Title:`${restaurant.name} - ${strings[language].menu}`,Author:restaurant.name,CreationDate:new Date('2026-01-01T00:00:00Z'),ModDate:new Date('2026-01-01T00:00:00Z')}});
 doc.registerFont('serif','public/fonts/PrintSerif.ttf');doc.registerFont('sans','public/fonts/PrintSans.ttf');
 const output=createWriteStream(`public/menu/${pdfFilename(language)}`);doc.pipe(output);const t=strings[language];let y=0;
 const newPage=()=>{doc.addPage();doc.fillColor(ink).font('serif').fontSize(24).text(restaurant.name,45,40);doc.font('sans').fontSize(7).fillColor(gold).text(`${restaurant.established}  /  BITOLA`,400,47,{width:150,align:'right'});doc.moveTo(45,79).lineTo(550,79).strokeColor('#cfc8b8').lineWidth(.6).stroke();y=102;};
 const heading=(name:string,continued=false)=>{doc.font('serif').fontSize(21).fillColor(ink);const title=name+(continued?` (${t.continued})`:'');const height=doc.heightOfString(title,{width:505});doc.text(title,45,y,{width:505});y+=height+18;};
 newPage();
 for(const category of orderedCategories(categories)){
  const items=activeItems(menu,category.id);if(!items.length)continue;
  doc.font('serif').fontSize(21);const headingHeight=doc.heightOfString(localize(category.name,language),{width:505})+18;
  doc.font('serif').fontSize(12);const firstNameHeight=doc.heightOfString(localize(items[0].name,language),{width:385});
  doc.font('sans').fontSize(8.5);const firstHeight=firstNameHeight+doc.heightOfString(localize(items[0].ingredients,language),{width:385,lineGap:2})+48;
  if(y+headingHeight+firstHeight>735)newPage();heading(localize(category.name,language));
  for(const item of printItems(items)){
   const name=localize(item.name,language),ingredients=localize(item.ingredients,language);const width=385;
   doc.font('serif').fontSize(12);const nameHeight=doc.heightOfString(name,{width});
   doc.font('sans').fontSize(8.5);const ingredientHeight=doc.heightOfString(ingredients,{width,lineGap:2});
   const height=nameHeight+ingredientHeight+48;
   if(height>570)throw new Error(`Dish ${item.id} is too long for one print page; shorten its text.`);
   if(y+height>735){newPage();heading(localize(category.name,language),true);}
   doc.font('serif').fontSize(12).fillColor(ink).text(name,45,y,{width});
   doc.font('sans').fontSize(8.5).fillColor(muted).text(ingredients,45,y+nameHeight+6,{width,lineGap:2});
   const detailY=y+nameHeight+ingredientHeight+16;
   doc.fontSize(7).text(item.weight,45,detailY);
   let ax=100;
   for(const id of item.allergens){const allergen=allergens[id];if(!allergen)throw new Error(`Unknown allergen: ${id}`);doc.roundedRect(ax,detailY-2,18,13,3).lineWidth(.5).strokeColor(gold).stroke();doc.fontSize(6.5).fillColor(ink).text(allergen.code,ax,detailY+1,{width:18,align:'center'});ax+=23;}
   // All item prices use the same right-aligned box independent of description length.
   doc.rect(452,y-4,98,34).lineWidth(.6).strokeColor('#bdb198').stroke();doc.font('sans').fontSize(10).fillColor(ink).text(item.formattedPrice,456,y+7,{width:90,align:'center'});
   y+=height;doc.moveTo(45,y-13).lineTo(550,y-13).lineWidth(.4).strokeColor('#ded8ca').stroke();
  }
  y+=13;
 }
 newPage();heading(t.legend);doc.font('sans').fontSize(9).fillColor(muted).text(t.allergenNote,45,y,{width:505,lineGap:3});y=doc.y+30;
 for(const allergen of Object.values(allergens)){doc.roundedRect(45,y,23,19,3).strokeColor(gold).lineWidth(.6).stroke();doc.fontSize(8).fillColor(ink).text(allergen.code,45,y+5,{width:23,align:'center'});doc.fontSize(10).text(localize(allergen.name,language),82,y+3);y+=31;}
 const range=doc.bufferedPageRange();for(let index=0;index<range.count;index++){doc.switchToPage(index);doc.moveTo(45,762).lineTo(550,762).lineWidth(.5).strokeColor('#cfc8b8').stroke();doc.font('sans').fontSize(6.5).fillColor(muted).text(restaurant.sampleMenu?t.draft:t.footer,45,774,{width:445,lineBreak:false});doc.text(`${index+1} / ${range.count}`,505,774,{width:45,align:'right',lineBreak:false});}
 doc.end();await new Promise<void>((resolve,reject)=>{output.on('finish',resolve);output.on('error',reject);doc.on('error',reject);});
 console.log(`Generated ${pdfFilename(language)} (${range.count} A4 pages)`);
}
if(process.argv[1]===fileURLToPath(import.meta.url)){for(const language of languages)await generatePDF(language);}

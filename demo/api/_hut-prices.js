const sources={
 'osm-way-200336118':{url:'https://rifugiolagazuoi.com/EN/p2-Overnight-stay-at-Rifugio-Lagazuoi',adapter:'lagazuoi'},
 'osm-way-83855898':{url:'https://www.drei-schuster-huette.com/it/prezzi-prenotazione-online.php',adapter:'scarperi'},
 'osm-way-200335125':{url:'https://www.rifugio5torri.it/en/rooms.html',adapter:'cinque'},
 'osm-relation-19526395':{url:'https://www.rifugiogalassi.it/en_GB/prezzi/',adapter:'galassi'},
 'osm-way-121491779':{url:'https://rifugiobiella.it/en/hut/',adapter:'biella'}
};
function text(html){return html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|#160);/g,' ').replace(/&euro;|&#8364;/g,'€').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
function amount(value){const m=value.match(/(?:€\s*(\d+(?:[.,]\d{1,2})?)|(\d+(?:[.,]\d{1,2})?)\s*(?:€|euros?))/i);return m?Number((m[1]||m[2]).replace(',','.')):null;}
function parse(html,adapter){
 const rates=[];let year=null;
 if(adapter==='galassi'){
 const headings=[...html.matchAll(/<h[12]\b[^>]*>([\s\S]*?)<\/h[12]>/gi)].map(m=>text(m[1]));
 const years=headings.map(h=>h.match(/\b(20\d{2})\s+Prices\b/i)?.[1]).filter(Boolean);if(new Set(years).size!==1)throw Error('Price year is unclear.');year=Number(years[0]);
 for(const table of html.match(/<table\b[^>]*>[\s\S]*?<\/table>/gi)||[]){
 const rows=[...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(row=>[...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c=>text(c[1])));
 const header=rows.find(c=>c.join(' ').match(/Under 25/i)&&c.join(' ').match(/Not members/i));if(!header)continue;
 const groups=header.slice(-3);if(!/Under 25.*Members/i.test(groups[0])||!/^Alpin(?:e)? Club Members$/i.test(groups[1])||!/^Not members$/i.test(groups[2]))throw Error('Membership columns changed.');
 for(const cells of rows){const basis=/^Half board\*?$/i.test(cells[0])?'Half-board':/^Overnight stay$/i.test(cells[0])?'Bed only':null;if(!basis){if(cells.some(cell=>amount(cell)!==null))throw Error('Unrecognized package row.');continue;}if(cells.length!==4)throw Error('Rate columns changed.');for(let i=0;i<3;i++){const value=amount(cells[i+1]);if(!(value>0&&value<1000))throw Error('Rate is unclear.');rates.push({package:basis,eligibility:groups[i],amount:value,currency:'EUR',unit:'per person / night'});}}
 }
 if(rates.length!==6)throw Error('Complete rate table unavailable.');
 }else if(adapter==='lagazuoi'){
 const labels={'ONE BED in DORMITORY in BB (per person)':['Bed and breakfast · dormitory','per person / night'],'Double room in BB':['Bed and breakfast · double room','per room / night'],'Twin room with balcony in BB':['Bed and breakfast · twin room with balcony','per room / night'],'Triple room with wall bed in BB':['Bed and breakfast · triple room with wall bed','per room / night'],'Twin room with bunk bed in BB':['Bed and breakfast · twin room with bunk bed','per room / night'],'Triple room in BB':['Bed and breakfast · triple room','per room / night'],'Quadruple room with one wall bed in BB':['Bed and breakfast · quadruple room with wall bed','per room / night']};
 const extras=/^(?:SAUNA NO GUESTS|Luggage transport|Dinner with half board|New Year's Eve Dinner)/i;
 const unique=new Map();let seasonKey=null;
 for(const table of html.match(/<table\b[^>]*>[\s\S]*?<\/table>/gi)||[]){
 const rows=[...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(row=>[...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c=>text(c[1])));
 const header=rows.find(c=>c.length===3&&/^Summer 20\d{2}$/.test(c[1])&&/^Winter 20\d{2}$/.test(c[2]));if(!header)continue;
 if(seasonKey&&seasonKey!==header.slice(1).join('|'))throw Error('Season columns conflict.');seasonKey=header.slice(1).join('|');
 for(const cells of rows){
 if(cells===header||cells.every(c=>!c)||extras.test(cells[0]))continue;
 const basis=labels[cells[0]];if(!basis||cells.length!==3)throw Error('Accommodation row changed.');
 for(let i=1;i<3;i++){
 const value=amount(cells[i]);if(!(value>0&&value<1000))throw Error('Season rate unavailable.');
 const key=cells[0]+'|'+header[i],old=unique.get(key);if(old&&old.amount!==value)throw Error('Conflicting seasonal rates.');
 unique.set(key,{package:basis[0],eligibility:header[i]+' · standard rate',amount:value,currency:'EUR',unit:basis[1],year:Number(header[i].slice(-4)),season:header[i].split(' ')[0].toLowerCase()});
 }
 }
 }
 rates.push(...unique.values());if(rates.length!==14)throw Error('Complete seasonal accommodation table unavailable.');
 }else if(adapter==='scarperi'){
 const ages={'Bambini fino 3,99 anni':'Children under 4','Bambini 4-6,99 anni':'Children ages 4–6.99','Junior 7-13,99 anni':'Juniors ages 7–13.99','a partire da 14 anni':'Ages 14 and above'};
 const packages={'MP dormitorio':'Half-board · dormitory','MP camera 20 posti':'Half-board · 20-bed room','MP camera doppia':'Half-board · double room'};
 const seen=new Set();let age=null;
 for(const table of html.match(/<table\b[^>]*>[\s\S]*?<\/table>/gi)||[]){
 const rows=[...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(row=>[...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c=>text(c[1])));
 if(!rows.some(c=>c.includes('SOCI C.A.I.')))continue;
 for(const cells of rows){
 if(ages[cells[0]]){if(cells.length!==3||cells[1]!=='SOCI C.A.I.'||cells[2]!=='NON SOCI')throw Error('Age or member columns changed.');age=ages[cells[0]];continue;}
 if(!age)throw Error('Age group unavailable.');
 const free=age==='Children under 4'&&cells.length===3&&cells.slice(1).every(c=>/^gratis$/i.test(c));
 const basis=free?'Accommodation · free for children under 4':packages[cells[0]];
 if(!basis||cells.length!==3)throw Error('Accommodation row changed.');
 for(let i=0;i<2;i++){
 const value=free?0:amount(cells[i+1]),eligibility=age+' · '+(i===0?'CAI members':'Nonmembers'),key=basis+'|'+eligibility;
 if(value===null||!(value>=0&&value<1000)||seen.has(key))throw Error('Rate unclear or duplicated.');seen.add(key);
 rates.push({package:basis,eligibility,amount:value,currency:'EUR',unit:'per person / night'});
 }
 }
 }
 if(rates.length!==20)throw Error('Complete age and membership table unavailable.');
 }else if(adapter==='cinque'){
 const plain=text(html),years=[...plain.matchAll(/RATES AND CONDITIONS\s+(20\d{2})\s+SEASON/gi)].map(m=>Number(m[1]));
 if(new Set(years).size!==1)throw Error('Price year is unclear.');year=years[0];
 for(const room of ['Private Room','Dormitory']){
 const pattern=new RegExp(room+':\\s*\\*?\\s*Half board:\\s*(\\d+(?:[.,]\\d{1,2})?)\\s*€/person\\s*\\|\\s*B&B:\\s*(\\d+(?:[.,]\\d{1,2})?)\\s*€/person','gi');
 const matches=[...plain.matchAll(pattern)];if(matches.length!==1)throw Error('Complete room rates unavailable.');
 for(const [index,basis] of ['Half-board','Bed and breakfast'].entries()){
 const value=Number(matches[0][index+1].replace(',','.'));if(!(value>0&&value<1000))throw Error('Rate is unclear.');
 rates.push({package:basis,eligibility:room==='Private Room'?'Private room · standard rate':'Shared dormitory · standard rate',amount:value,currency:'EUR',unit:'per person / night'});
 }
 }
 }else if(adapter==='biella'){
 const plain=text(html);const labels=[['Half-board',/Half board\s*:\s*(\d+(?:[.,]\d{1,2})?)\s*euros?/gi],['Bed only',/Overnight stay\s*:\s*(\d+(?:[.,]\d{1,2})?)\s*euros?/gi],['Bed and breakfast',/Bed\s*(?:&|and)\s*breakfast\s*:\s*(\d+(?:[.,]\d{1,2})?)\s*euros?/gi]];
 for(const [basis,pattern] of labels){const matches=[...plain.matchAll(pattern)],values=[...new Set(matches.map(m=>Number(m[1].replace(',','.'))))];if(values.length>1)throw Error('Conflicting package rates.');if(values.length===1&&values[0]>0&&values[0]<1000)rates.push({package:basis,eligibility:'Published standard rate',amount:values[0],currency:'EUR',unit:'per person / night'});}
 if(!rates.length)throw Error('Readable overnight prices unavailable.');
 }else throw Error('Unsupported adapter.');
 return {rates,year};
}
async function fetchRates(id){const source=sources[id];if(!source)return null;
 const response=await fetch(source.url,{redirect:'manual',headers:{'User-Agent':'Traversa/0.4 (public operator rate check)'},signal:AbortSignal.timeout(10000)});
 if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))throw Error('Price source unavailable.');
 const reader=response.body.getReader();let size=0,parts=[];try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>1000000)throw Error('Price page too large.');parts.push(Buffer.from(value));}}finally{await reader.cancel().catch(()=>{});}
 return {...parse(Buffer.concat(parts).toString('utf8'),source.adapter),hutId:id,sourceUrl:source.url,checkedAt:new Date().toISOString(),status:'checked',availability:'Not checked'};
}
module.exports={sources,parse,fetchRates};

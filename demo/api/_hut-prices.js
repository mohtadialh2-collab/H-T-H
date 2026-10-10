const sources={
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

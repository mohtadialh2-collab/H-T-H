const reviewedWebsites=require('../data/hut-websites.json');
const regions={dolomites:[46.1,11.3,46.85,12.6],cortina:[46.4,11.95,46.65,12.3],cinque:[46.49,12.035,46.515,12.06]};
async function overpass(query){let last;for(const host of ['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter']){try{const r=await fetch(host,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','User-Agent':'Traversa/0.2 (public OSM hiking catalogue)'},body:new URLSearchParams({data:query}),signal:AbortSignal.timeout(25000)});if(!r.ok)throw Error('Map source returned '+r.status);const data=await r.json();if(data.remark)throw Error('Map source query was incomplete.');return data;}catch(e){last=e;}}throw last||Error('Map sources unavailable.');}
function safeUrl(value){try{const normalized=typeof value==='string'&&/^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/:?#]|$)/i.test(value.trim())?'https://'+value.trim():value;const u=new URL(normalized);return ['http:','https:'].includes(u.protocol)?u.href:null;}catch{return null;}}
function facilityDescription(tags){const labels={drinking_water:'Drinking water',shower:'Showers',toilets:'Toilets',internet_access:'Internet',electricity:'Electricity',wheelchair:'Wheelchair access','diet:vegetarian':'Vegetarian meals','diet:vegan':'Vegan meals'};return Object.entries(labels).filter(([key])=>tags[key]).map(([key,label])=>label+': '+tags[key]).join(' · ')||null;}
function reportedPrice(tags){
 const match=typeof tags.charge==='string'&&tags.charge.match(/^(\d+(?:[.,]\d+)?)\s+EUR\s+(half-board|overnight|bed)$/i);
 if(!match)return null;
 const amount=Number(match[1].replace(',','.'));if(!Number.isFinite(amount)||amount<=0)return null;
 return {amount,currency:'EUR',basis:match[2].toLowerCase(),checkedAt:typeof tags['charge:check_date']==='string'?tags['charge:check_date']:null};
}
function catalogue(data,region){return {region,retrievedAt:new Date().toISOString(),coverage:'OSM alpine_hut records inside the selected bounding box; completeness is not guaranteed.',license:'Open Database License (ODbL) / OpenStreetMap contributors',huts:(data.elements||[]).filter(e=>e.tags?.tourism==='alpine_hut'&&e.tags.name).map(e=>{const c=e.type==='node'?e:e.center;const [south,west,north,east]=regions[region]||[];return ['node','way','relation'].includes(e.type)&&Number.isSafeInteger(e.id)&&e.id>0&&typeof e.tags.name==='string'&&e.tags.name.trim()&&c&&Number.isFinite(c.lat)&&Number.isFinite(c.lon)&&c.lat>=south&&c.lat<=north&&c.lon>=west&&c.lon<=east?{id:`osm-${e.type}-${e.id}`,name:e.tags.name,lat:c.lat,lng:c.lon,height:e.tags.ele?e.tags.ele+' m':'Elevation not recorded',site:safeUrl(e.tags.website)||safeUrl(e.tags['contact:website'])||safeUrl(reviewedWebsites[`osm-${e.type}-${e.id}`]?.site),...(reviewedWebsites[`osm-${e.type}-${e.id}`]?{websiteEvidence:reviewedWebsites[`osm-${e.type}-${e.id}`]}:{}),phone:e.tags.phone||e.tags['contact:phone']||null,beds:e.tags.beds||null,price:reportedPrice(e.tags),opening:e.tags.opening_hours||null,facilities:facilityDescription(e.tags),accommodation:'Unconfirmed',source:`https://www.openstreetmap.org/${e.type}/${e.id}`,position:'OSM mapped location / building centre; entrance unreviewed',verification:'source_reported'}:null;}).filter(Boolean).sort((a,b)=>a.name.localeCompare(b.name))};}
function flagPossibleDuplicates(huts){
 const distance=require('../graph').distance;
 const records=huts.map(({possibleDuplicates,...hut})=>({...hut}));
 for(let i=0;i<records.length;i++)for(let j=i+1;j<records.length;j++){
  const a=records[i],b=records[j];
  if(a.name.trim().toLocaleLowerCase()===b.name.trim().toLocaleLowerCase()&&distance([a.lng,a.lat],[b.lng,b.lat])<=150){
   (a.possibleDuplicates??=[]).push(b.id);(b.possibleDuplicates??=[]).push(a.id);
  }
 }
 return records;
}
function mergeCatalogue(retained,fresh){
 if(!fresh.huts.length)throw Error('No valid hut records.');
 const huts=new Map(retained.huts.map(h=>[h.id,h]));
 for(const hut of fresh.huts)huts.set(hut.id,{...hut,lastSeenAt:fresh.retrievedAt});
 return {...retained,...fresh,completeCells:false,coverage:'Merged source-reported OSM huts; retained records are preserved. Completeness and current operation are not guaranteed.',huts:flagPossibleDuplicates([...huts.values()]).sort((a,b)=>a.name.localeCompare(b.name)),retainedCount:retained.huts.filter(h=>!fresh.huts.some(n=>n.id===h.id)).length};
}
module.exports={regions,overpass,catalogue,mergeCatalogue,flagPossibleDuplicates,reportedPrice};

const graph=require('../graph');
const catalogue=require('../data/dolomites.json');
const aliases={cinque:'osm-way-200335125',scoiattoli:'osm-way-200335135',averau:'osm-way-200335813',nuvolau:'osm-way-200226208'};
const levels={hiking:1,mountain_hiking:2,demanding_mountain_hiking:3};
function normalize(data,start,end,difficulty){
 const feature=data.features?.[0],coords=feature?.geometry?.coordinates,p=feature?.properties,summary=p?.summary;
 if(feature?.geometry?.type!=='LineString'||!Array.isArray(coords)||coords.length<2||coords.length>25000||!coords.every(c=>Array.isArray(c)&&c.length>=2&&c.slice(0,2).every(Number.isFinite)&&c[0]>=11.25&&c[0]<=12.65&&c[1]>=46.05&&c[1]<=46.9)||!summary||!Number.isFinite(summary.distance)||summary.distance<=0||!Number.isFinite(summary.duration)||summary.duration<0)throw Error('ORS returned an invalid route. No stage was added.');
 const geometry=coords.map(c=>c.slice(0,2));const startGapM=graph.distance(start,geometry[0]),endGapM=graph.distance(end,geometry.at(-1));
 if(startGapM>100||endGapM>100)throw Error('ORS snapped more than 100 m from a selected hut. This route was rejected.');
 const difficultyValues=p.extras?.traildifficulty?.values;
 if(Array.isArray(difficultyValues)&&difficultyValues.some(v=>!Array.isArray(v)||v.length!==3||!v.every(Number.isFinite)||v[2]<0||v[2]>6))throw Error('ORS returned invalid difficulty metadata.');
 if(difficultyValues?.some(v=>v[2]>levels[difficulty]))throw Error('ORS found a route above your selected recorded difficulty. Try the mapped-trail provider or different huts.');
 const unknownDifficulty=!difficultyValues?.length||difficultyValues.some(v=>v[2]===0)?1:0;
 const elevations=coords.every(c=>Number.isFinite(c[2]))?coords.map(c=>c[2]):null;
 const sample= elevations?Array.from({length:Math.min(80,elevations.length)},(_,i)=>elevations[Math.round(i*(elevations.length-1)/(Math.min(80,elevations.length)-1))]):null;
 const ascent=Number.isFinite(p.ascent)?p.ascent:p.segments?.every(s=>Number.isFinite(s.ascent))?p.segments.reduce((sum,s)=>sum+s.ascent,0):undefined;
 const descent=Number.isFinite(p.descent)?p.descent:p.segments?.every(s=>Number.isFinite(s.descent))?p.segments.reduce((sum,s)=>sum+s.descent,0):undefined;
 return {provider:'ors',geometry,distanceM:summary.distance,startGapM,endGapM,ways:[],unknownDifficulty,verification:'mapped_trails_unreviewed_hut_access',hours:summary.duration/3600,timeSource:'openrouteservice walking-time estimate',...(sample?{elevation:sample,elevationSource:'openrouteservice elevation model'}:{}),...(ascent>=0?{ascentM:Math.round(ascent)}:{}),...(descent>=0?{descentM:Math.round(descent)}:{}),source:'openrouteservice / OpenStreetMap contributors',sourceUrl:'https://openrouteservice.org/',retrievedAt:new Date().toISOString(),warnings:['ORS provider route; hut approaches, current restrictions and via ferrata exclusion have not been independently verified.','The reported endpoint offsets are not confirmed walking connections.',...(unknownDifficulty?['Some sections have no recorded difficulty.']:[])]};
}
async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Use GET.'});
 const configured=Boolean(process.env.ORS_API_KEY);
 if(!req.query.start&&!req.query.end)return res.status(200).json({configured,provider:'openrouteservice',profile:'foot-hiking'});
 res.setHeader('Cache-Control','no-store');
 if(!configured)return res.status(503).json({error:'ORS is not configured for this deployment. Choose the mapped-trail provider.'});
 const find=id=>catalogue.huts.find(h=>h.id===(aliases[id]||id));const start=find(req.query.start),end=find(req.query.end),difficulty=req.query.difficulty||'mountain_hiking';
 if(!start||!end||start.id===end.id||!levels[difficulty])return res.status(400).json({error:'Choose two different indexed huts and a supported difficulty.'});
 const coordinates=[[start.lng,start.lat],[end.lng,end.lat]];
 if(graph.distance(...coordinates)>25000)return res.status(422).json({error:'Choose intermediate huts. Individual ORS stages are limited to huts up to 25 km apart.'});
 try{
 const response=await fetch('https://api.openrouteservice.org/v2/directions/foot-hiking/geojson',{method:'POST',headers:{'Authorization':process.env.ORS_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({coordinates,radiuses:[100,100],elevation:true,instructions:false,extra_info:['traildifficulty','surface','waytype'],options:{avoid_features:['ferries','fords']}}),signal:AbortSignal.timeout(20000)});
 if(!response.ok){const errors={401:'ORS rejected the key. Check its configuration in Vercel.',403:'ORS denied this request. Check the key’s permissions or quota.',429:'ORS quota or rate limit reached. Wait and retry, or choose mapped trails.',404:'ORS could not find a hiking route between these huts.',400:'ORS could not route these locations with the requested options.'};return res.status(response.status===429?429:502).json({error:errors[response.status]||'ORS is temporarily unavailable. Your plan is preserved.'});}
 const result=normalize(await response.json(),coordinates[0],coordinates[1],difficulty);res.setHeader('Cache-Control','public, s-maxage=1800, stale-while-revalidate=3600');return res.status(200).json(result);
 }catch(e){return res.status(422).json({error:e.name==='TimeoutError'||e.name==='AbortError'?'ORS timed out. Retry or choose mapped trails. Your plan is preserved.':e.message?.startsWith('ORS ')?e.message:'The ORS service could not be reached. Your plan is preserved.'});}
}
module.exports=handler;module.exports.normalize=normalize;

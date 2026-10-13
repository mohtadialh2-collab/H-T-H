const {regions,overpass,catalogue,mergeCatalogue}=require('./_providers');
const findings=require('../data/hut-review-findings.json');
const reviews=require('../data/hut-prices-reviewed.json'),{reviewedRecord}=require('./_reviewed-prices');
function withPrices(data){return {...data,huts:data.huts.map(h=>{const r=reviewedRecord(reviews,h.id);return {...h,...(r?{operatorPrices:r}:{}),...(findings[h.id]?{priceReview:findings[h.id]}:{})};})};}
const snapshot=require('../data/dolomites.json');
module.exports=async function(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Use GET.'});
 const region=req.query.region||'dolomites';if(!regions[region])return res.status(400).json({error:'Unknown destination.'});
 const [s,w,n,e]=regions[region];const retained={...snapshot,region,huts:snapshot.huts.filter(h=>h.lng>=w&&h.lng<=e&&h.lat>=s&&h.lat<=n)};
 if(req.query.refresh!=='1'){res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');return res.status(200).json(withPrices(retained));}
 try{const data=await overpass(`[out:json][timeout:20];nwr["tourism"="alpine_hut"](${regions[region].join(',')});out center tags;`);const result=catalogue(data,region);if(!result.huts.length)throw Error('No records.');return res.status(200).json(withPrices(mergeCatalogue(retained,result)));}catch{return res.status(503).json({error:'Live hut refresh is temporarily unavailable. The retained catalogue remains visible. Try refreshing later.'});}
};

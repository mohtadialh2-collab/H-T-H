const {regions,overpass,catalogue,mergeCatalogue}=require('./_providers');
const snapshot=require('../data/dolomites.json');
module.exports=async function(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Use GET.'});
 const region=req.query.region||'dolomites';if(!regions[region])return res.status(400).json({error:'Unknown destination.'});
 const [s,w,n,e]=regions[region];const retained={...snapshot,region,huts:snapshot.huts.filter(h=>h.lng>=w&&h.lng<=e&&h.lat>=s&&h.lat<=n)};
 if(req.query.refresh!=='1'){res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');return res.status(200).json(retained);}
 try{const data=await overpass(`[out:json][timeout:20];nwr["tourism"="alpine_hut"](${regions[region].join(',')});out center tags;`);const result=catalogue(data,region);if(!result.huts.length)throw Error('No records.');return res.status(200).json(mergeCatalogue(retained,result));}catch{return res.status(503).json({error:'Live hut refresh is temporarily unavailable. The retained catalogue remains visible. Try refreshing later.'});}
};

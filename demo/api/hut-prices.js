const catalogue=require('../data/dolomites.json');
const {sources,fetchRates}=require('./_hut-prices');
const aliases={nuvolau:'osm-way-200226208',cinque:'osm-way-200335125',scoiattoli:'osm-way-200335135',averau:'osm-way-200335813'};
module.exports=async(req,res)=>{
 if(req.method!=='GET')return res.status(405).json({error:'Use GET.'});
 const id=typeof req.query.hut==='string'?(aliases[req.query.hut]||req.query.hut):null;
 if(!id||!catalogue.huts.some(h=>h.id===id))return res.status(400).json({error:'Choose an indexed hut.'});
 if(!sources[id]){res.setHeader('Cache-Control','public, s-maxage=3600');return res.status(200).json({hutId:id,status:'unsupported',rates:[],message:'Automatic price checking is not available for this operator yet. Check its website for published rates.'});}
 try{const result=await fetchRates(id);res.setHeader('Cache-Control','public, s-maxage=21600');return res.status(200).json(result);}catch{res.setHeader('Cache-Control','no-store');return res.status(503).json({hutId:id,status:'unavailable',rates:[],message:'The operator price page could not be read. Previous recorded prices are preserved; confirm directly with the hut.'});}
};

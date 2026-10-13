const {test}=require('node:test'),assert=require('node:assert/strict'),{validRecord,reviewedRecord}=require('../demo/api/_reviewed-prices'),records=require('../demo/data/hut-prices-reviewed.json'),catalogue=require('../demo/data/dolomites.json'),prices=require('../demo/api/hut-prices'),catalogueApi=require('../demo/api/catalogue'),{queue}=require('../scripts/hut-price-review.cjs');
const res=()=>({setHeader(){},status(code){this.code=code;return this;},json(data){this.data=data;return this;}});
test('multi-night package totals retain duration and cannot pass validation without a bounded stay length',async()=>{
 const record=records['osm-node-439594940'];assert(validRecord(record));assert.equal(record.rates[3].amount,1000);assert.equal(record.rates[3].stayNights,7);
 for(const stayNights of [undefined,0,31,4.5])assert.equal(validRecord({...record,rates:[{...record.rates[0],stayNights}]}),false);
 const r=res();await prices({method:'GET',query:{hut:record.hutId}},r);assert.equal(r.code,200);assert.equal(r.data.rates[3].unit,'per person / stay');assert.equal(r.data.rates[3].amount,1000);assert.equal(r.data.rates[3].stayNights,7);
});
test('every reviewed rate has canonical identity and primary-source evidence; formats cannot become fictional prices',()=>{
 for(const [id,r] of Object.entries(records)){assert.equal(id,r.hutId);assert(validRecord(r));assert(catalogue.huts.some(h=>h.id===id));assert.equal(reviewedRecord(records,id,Date.parse(r.checkedAt)).reviewOverdue,false);assert.equal(reviewedRecord(records,id,Date.parse(r.reviewDueAt)).reviewOverdue,true);}
 const r=records['osm-way-200336118'];assert.equal(validRecord({...r,sourceUrl:'javascript:alert(1)'}),false);assert.equal(validRecord({...r,evidence:''}),false);assert.equal(validRecord({...r,rates:[{...r.rates[0],amount:-1}]}),false);assert.equal(validRecord({...r,rates:[{...r.rates[0],unit:'guessed per person'}]}),false);
});
test('reviewed Lagazuoi prices survive external fetch failure and retain original verification dates',async()=>{
 const previous=global.fetch;global.fetch=()=>{throw Error('Must not contact external operator');};try{const r=res();await prices({method:'GET',query:{hut:'osm-way-200336118'}},r);assert.equal(r.code,200);assert.equal(r.data.rates.length,14);assert.equal(r.data.checkedAt,records[r.data.hutId].checkedAt);assert.equal(r.data.verification,'chat_reviewed');}finally{global.fetch=previous;}
});
test('catalogue returns reviewed prices before hut clicks and retains region filtering',async()=>{const r=res();await catalogueApi({method:'GET',query:{region:'dolomites'}},r);assert.equal(r.code,200);assert.equal(r.data.huts.filter(h=>h.operatorPrices).length,Object.keys(records).length);const cortina=res();await catalogueApi({method:'GET',query:{region:'cortina'}},cortina);assert(cortina.data.huts.every(h=>h.lat>=46.4&&h.lat<=46.65));});
test('monthly review queue keeps unvisited records pending and preserves unresolved findings',()=>{const q=queue(records,{'osm-way-200335813':{status:'no_readable_prices',reason:'Inspected accommodation page'}});assert.equal(Object.keys(q).length,296);assert.equal(q['osm-way-200335813'].status,'no_readable_prices');assert.equal(q['osm-way-200336118'].status,'verified');assert(Object.values(q).some(i=>i.status==='missing_website'));assert(Object.values(q).some(i=>i.status==='pending'));});
test('range prices preserve both bounds and reject invalid ranges; corrected links and no-overnight findings reach catalogue',async()=>{
 const record=records['osm-way-200799530'];assert(validRecord(record));assert.equal(record.rates[0].maxAmount,150);assert.equal(validRecord({...record,rates:[{...record.rates[0],maxAmount:130}]}),false);
 const r=res();await catalogueApi({method:'GET',query:{region:'dolomites'}},r);assert.equal(r.data.huts.find(h=>h.id==='osm-way-118944262').priceReview.status,'no_overnight');assert.equal(r.data.huts.find(h=>h.id==='osm-way-200785544').site,'https://rifugiocittadicarpi.it/');
});

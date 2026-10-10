const {test}=require('node:test'),assert=require('node:assert/strict');
const {catalogue,mergeCatalogue}=require('../demo/api/_providers');
const {importCatalogue}=require('../scripts/import-overpass-catalogue.cjs');
const element={type:'relation',id:123,center:{lat:46.5,lon:12.1},tags:{tourism:'alpine_hut',name:'New hut',website:'javascript:alert(1)'}};
test('bounded source normalization and preservation',()=>{
 const fresh=catalogue({elements:[element,{...element,id:124,center:{lat:0,lon:0}},{...element,id:-1},{...element,type:'unknown'}]},'dolomites');
 assert.equal(fresh.huts.length,1);assert.equal(fresh.huts[0].site,null);
 const retained={huts:[{id:'old',name:'Old hut'}],completeCells:false};
 assert.equal(mergeCatalogue(retained,fresh).huts.length,2);
 assert.throws(()=>mergeCatalogue(retained,{huts:[]}));
 const imported=importCatalogue(JSON.stringify({elements:[element,element]}),retained,'2026-10-09T10:00:00Z');
 assert.equal(imported.huts.length,2);assert.equal(imported.completeCells,false);assert.equal(imported.sources[0].sha256.length,64);
 assert.equal(imported.huts.find(h=>h.id==='osm-relation-123').lastSeenAt,'2026-10-09T10:00:00.000Z');
 assert.throws(()=>importCatalogue('{"remark":"timeout","elements":[]}',retained,'2026-10-09'));
});
test('new huts are verified by identity before ORS can use them',async()=>{
 const {resolveHut}=require('../demo/api/ors');const original=global.fetch;let calls=0;
 global.fetch=async(url,options)=>{calls++;assert.match(options.body.get('data'),/relation\(123\)/);return {ok:true,json:async()=>({elements:[element]})};};
 try{assert.equal(await resolveHut('https://example.com'),null);assert.equal(calls,0);assert.equal((await resolveHut('osm-relation-123')).name,'New hut');assert.equal((await resolveHut('osm-relation-123')).name,'New hut');assert.equal(calls,1);}finally{global.fetch=original;}
});
test('possible duplicate hut records are flagged without merging different source identities',()=>{
 const {flagPossibleDuplicates}=require('../demo/api/_providers');
 const records=[{id:'a',name:'Same hut',lat:46.5,lng:12.1},{id:'b',name:'Same hut',lat:46.5001,lng:12.1},{id:'c',name:'Same hut',lat:46.6,lng:12.1}];
 const result=flagPossibleDuplicates(records);assert.equal(result.length,3);assert.deepEqual(result[0].possibleDuplicates,['b']);assert.deepEqual(result[1].possibleDuplicates,['a']);assert.equal(result[2].possibleDuplicates,undefined);assert.equal(records[0].possibleDuplicates,undefined);
});
test('expanded retained catalogue huts are accepted by ORS routing without another source lookup',async()=>{
 const handler=require('../demo/api/ors'),snapshot=require('../demo/data/dolomites.json');
 const start=snapshot.huts.find(h=>h.id==='osm-way-74495662'),end=snapshot.huts.find(h=>h.id==='osm-way-123811150');
 assert(start&&end);const previousFetch=global.fetch,previousKey=process.env.ORS_API_KEY;process.env.ORS_API_KEY='test-only';let request;
 global.fetch=async(url,options)=>{assert.equal(url,'https://api.openrouteservice.org/v2/directions/foot-hiking/geojson');request=JSON.parse(options.body);return {ok:true,json:async()=>({features:[{geometry:{type:'LineString',coordinates:[[start.lng,start.lat,2000],[end.lng,end.lat,2001]]},properties:{summary:{distance:900,duration:900},extras:{traildifficulty:{values:[[0,1,1]]}}}}]})};};
 const res={setHeader(){},status(code){this.code=code;return this;},json(data){this.data=data;return this;}};
 try{await handler({method:'GET',query:{start:start.id,end:end.id,difficulty:'any'}},res);assert.equal(res.code,200);assert.equal(res.data.provider,'ors');assert.deepEqual(request.coordinates,[[start.lng,start.lat],[end.lng,end.lat]]);}finally{global.fetch=previousFetch;if(previousKey===undefined)delete process.env.ORS_API_KEY;else process.env.ORS_API_KEY=previousKey;}
});
test('expanded snapshot has valid unique IDs and destination API filters every record by bounds',async()=>{
 const snapshot=require('../demo/data/dolomites.json'),handler=require('../demo/api/catalogue'),{regions}=require('../demo/api/_providers');
 assert.equal(new Set(snapshot.huts.map(h=>h.id)).size,snapshot.huts.length);
 assert(snapshot.huts.every(h=>/^osm-(node|way|relation)-[1-9][0-9]*$/.test(h.id)&&Number.isFinite(h.lat)&&Number.isFinite(h.lng)));
 for(const region of Object.keys(regions)){
  const [s,w,n,e]=regions[region],expected=snapshot.huts.filter(h=>h.lat>=s&&h.lat<=n&&h.lng>=w&&h.lng<=e);
  const res={setHeader(){},status(code){this.code=code;return this;},json(data){this.data=data;return this;}};
  await handler({method:'GET',query:{region}},res);assert.equal(res.code,200);assert.deepEqual(res.data.huts.map(h=>h.id),expected.map(h=>h.id));
 }
});
test('reported prices require an explicit amount, currency and package; free Wi-Fi and fee tags are not overnight prices',()=>{
 const {reportedPrice}=require('../demo/api/_providers');
 assert.deepEqual(reportedPrice({charge:'72 EUR half-board','charge:check_date':'2024-10-10'}),{amount:72,currency:'EUR',basis:'half-board',checkedAt:'2024-10-10'});
 assert.equal(reportedPrice({fee:'no','internet_access:fee':'no'}),null);
 assert.equal(reportedPrice({charge:'72 EUR'}),null);assert.equal(reportedPrice({charge:'72 USD half-board'}),null);
});
test('source websites with a bare domain are restored; unsafe schemes do not replace valid contact websites',()=>{
 const source={...element,tags:{...element.tags,website:'www.flaggerschartenhuette.it/'}};
 assert.equal(catalogue({elements:[source]},'dolomites').huts[0].site,'https://www.flaggerschartenhuette.it/');
 source.tags.website='javascript:alert(1)';source.tags['contact:website']='https://example.com/hut';
 assert.equal(catalogue({elements:[source]},'dolomites').huts[0].site,'https://example.com/hut');
});

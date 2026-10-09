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

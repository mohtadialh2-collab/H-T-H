const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const {parse,fetchRates}=require('../demo/api/_hut-prices'),handler=require('../demo/api/hut-prices').createHandler({});
const html=fs.readFileSync(path.join(__dirname,'fixtures/galassi-prices.html'),'utf8');
test('retains every package and member column without mistaking extras or currency decimals',()=>{
 const result=parse(html,'galassi');assert.equal(result.year,2026);assert.equal(result.rates.length,6);assert.deepEqual(result.rates.map(r=>r.amount),[45,55,69,20,27.5,34.5]);assert(result.rates.every(r=>r.unit==='per person / night'));
 assert.throws(()=>parse(html.replace('Not members','Guests'),'galassi'));
 assert.throws(()=>parse(html.replace('€ 69,00','Ask us'),'galassi'));
 assert.throws(()=>parse(html.replace('</table>','<tr><td>Full board</td><td>€ 70</td><td>€ 80</td><td>€ 90</td></tr></table>'),'galassi'));
});
test('does not infer a rate year from copyright or use sleeping-bag charges as accommodation rates',()=>{
 const result=parse(fs.readFileSync(path.join(__dirname,'fixtures/biella-prices.html'),'utf8'),'biella');assert.equal(result.year,null);assert.equal(result.rates.length,1);assert.equal(result.rates[0].amount,90);
 assert.throws(()=>parse('<p>Half board: 90 euros</p><p>Half board: 99 euros</p>','biella'));
});
const res=()=>({setHeader(k,v){(this.headers??={})[k]=v;},status(code){this.code=code;return this;},json(body){this.data=body;return this;}});
test('only configured operator URLs are fetched; unsupported and invalid hut requests do not fetch',async()=>{
 const previous=global.fetch;let calls=0;global.fetch=async(url,options)=>{calls++;assert.equal(url,'https://www.rifugiogalassi.it/en_GB/prezzi/');assert.equal(options.redirect,'manual');return new Response(html,{headers:{'content-type':'text/html'}});};
 try{const response=res();await handler({method:'GET',query:{hut:'osm-relation-19526395'}},response);assert.equal(response.code,200);assert.equal(response.data.rates.length,6);assert.match(response.headers['Cache-Control'],/21600/);
 const unsupported=res();await handler({method:'GET',query:{hut:'averau'}},unsupported);assert.equal(unsupported.data.status,'unsupported');
 const invalid=res();await handler({method:'GET',query:{hut:'https://127.0.0.1/'}},invalid);assert.equal(invalid.code,400);assert.equal(calls,1);
 }finally{global.fetch=previous;}
});
test('redirects, source failures and changed tables do not become a successful price check',async()=>{
 const previous=global.fetch;try{global.fetch=async()=>new Response('',{status:302,headers:{location:'http://127.0.0.1'}});await assert.rejects(fetchRates('osm-relation-19526395'));
 global.fetch=async()=>new Response('<h1>2026 Prices</h1>',{headers:{'content-type':'text/html'}});const response=res();await handler({method:'GET',query:{hut:'osm-relation-19526395'}},response);assert.equal(response.code,503);assert.equal(response.data.rates.length,0);
 }finally{global.fetch=previous;}
});
test('Cinque Torri preserves both rooms and packages and reads only the explicit rate year',()=>{
 const page=fs.readFileSync(path.join(__dirname,'fixtures/cinque-prices.html'),'utf8'),result=parse(page,'cinque');
 assert.equal(result.year,2026);assert.deepEqual(result.rates.map(r=>r.amount),[97,77,86,66]);
 assert.deepEqual(result.rates.map(r=>r.package),['Half-board','Bed and breakfast','Half-board','Bed and breakfast']);
 assert.match(result.rates[0].eligibility,/Private room/);assert.match(result.rates[2].eligibility,/Shared dormitory/);
 assert.equal(parse(page.replace('2026 SEASON','2028 SEASON'),'cinque').year,2028);
 assert.throws(()=>parse(page.replace('2026 SEASON','SEASON'),'cinque'));
 assert.throws(()=>parse(page.replace('66 &euro;','Ask us &euro;'),'cinque'));
 assert.throws(()=>parse(page+ '<p>RATES AND CONDITIONS 2025 SEASON</p>','cinque'));
 assert.throws(()=>parse(page.replace('Dormitory:*','Suite:'),'cinque'));
});
test('Tre Scarperi preserves free child accommodation and all age, room and member rates',()=>{
 const page=fs.readFileSync(path.join(__dirname,'fixtures/scarperi-prices.html'),'utf8'),r=parse(page,'scarperi');
 assert.equal(r.year,null);assert.equal(r.rates.length,20);assert.deepEqual(r.rates.slice(0,2).map(r=>r.amount),[0,0]);
 assert.deepEqual(r.rates.slice(-6).map(r=>r.amount),[70,80,74,84,79,89]);assert.match(r.rates.at(-1).eligibility,/Ages 14 and above · Nonmembers/);
 assert.throws(()=>parse(page.replace('79 €','Ask operator'),'scarperi'));
 assert.throws(()=>parse(page.replace('NON SOCI','Guests'),'scarperi'));
 assert.throws(()=>parse(page.replace('a partire da 14 anni','Adult prices'),'scarperi'));
 assert.throws(()=>parse(page.replace('MP camera doppia','MP suite'),'scarperi'));
});
test('Lagazuoi retains season years and room units without treating dinners or extras as accommodation',()=>{
 const page=fs.readFileSync(path.join(__dirname,'fixtures/lagazuoi-prices.html'),'utf8'),r=parse(page,'lagazuoi');
 assert.equal(r.year,null);assert.equal(r.rates.length,14);assert.equal(r.rates.filter(r=>r.unit==='per person / night').length,2);assert.equal(r.rates.filter(r=>r.unit==='per room / night').length,12);assert.deepEqual(r.rates.slice(0,2).map(r=>r.year),[2026,2027]);assert(r.rates.every(r=>r.amount>=85));
 assert.equal(parse(page+page,'lagazuoi').rates.length,14);
 assert.throws(()=>parse(page.replace('€ 260,00','Ask operator'),'lagazuoi'));
 assert.throws(()=>parse(page+page.replaceAll('€ 260,00','€ 270,00'),'lagazuoi'));
 assert.throws(()=>parse(page.replace('Double room in BB','Suite in BB'),'lagazuoi'));
 assert.throws(()=>parse(page.replace('Winter 2027','Winter prices'),'lagazuoi'));
});

'use strict';
let priceRequest=null,priceRevision=0;
const priceTTL=6*60*60*1000;
function validOperatorPrices(data){return data&&data.status==='checked'&&typeof data.hutId==='string'&&typeof data.sourceUrl==='string'&&/^https:\/\//.test(data.sourceUrl)&&Number.isFinite(Date.parse(data.checkedAt))&&(data.year===null||Number.isInteger(data.year)&&data.year>=2000&&data.year<=2100)&&Array.isArray(data.rates)&&data.rates.length>0&&data.rates.length<=20&&data.rates.every(r=>r&&r.currency==='EUR'&&Number.isFinite(r.amount)&&r.amount>0&&r.amount<1000&&['package','eligibility','unit'].every(k=>typeof r[k]==='string'&&r[k].length<=100));}
function operatorPriceHtml(data){const requestedYear=Number(planPreferences.startDate?.slice(0,4));return `<h3>Published operator rates</h3><p>${data.year?'Rate year: '+data.year:'The operator has not stated a rate year.'}${data.year&&data.year!==requestedYear?' These are not confirmed rates for your '+requestedYear+' trip.':''}</p><ul class="hut-rates">${data.rates.map(r=>`<li><strong>${esc(r.package)} · €${esc(r.amount.toFixed(2))}</strong><small>${esc(r.eligibility)} · ${esc(r.unit)}</small></li>`).join('')}</ul><p class="catalogue-status">Last checked: ${esc(new Date(data.checkedAt).toLocaleString())}. No package has been selected. Published rates do not confirm availability or your booking price; taxes and extras may apply.</p><a href="${esc(data.sourceUrl)}" target="_blank" rel="noopener noreferrer">Operator price page ↗</a>`;}
async function checkHutPrices(hut,target,revision){
 const controller=new AbortController();priceRequest=controller;let previous=hut.operatorPrices;
 const canonicalId=Object.entries(legacyIds).find(([,legacy])=>legacy===hut.id)?.[0]||hut.id;
 const valid=data=>validOperatorPrices(data)&&data.hutId===canonicalId;
 const current=()=>revision===priceRevision&&target.isConnected&&$('detail').open&&!controller.signal.aborted;
 try{
 if(storageReady&&!previous){const cached=await read('hut-prices-'+hut.id);if(valid(cached))previous=cached;}
 if(!current())return;
 if(previous&&valid(previous)){hut.operatorPrices=previous;target.innerHTML=operatorPriceHtml(previous);}
 if(previous&&Date.now()-Date.parse(previous.checkedAt)>=0&&Date.now()-Date.parse(previous.checkedAt)<priceTTL)return;
 target.insertAdjacentHTML('beforeend','<p class="catalogue-status" data-price-check>Checking the operator’s published prices…</p>');
 const response=await fetch('/api/hut-prices?hut='+encodeURIComponent(hut.id),{signal:controller.signal});const data=await response.json();if(!current())return;
 target.querySelector('[data-price-check]')?.remove();
 if(response.ok&&data.status==='unsupported'){target.insertAdjacentHTML('beforeend','<p class="catalogue-status">Automatic price checking is not available for this hut yet. Use its operator website for current prices.</p>');return;}
 if(!response.ok||!valid(data))throw Error('Unavailable');
 hut.operatorPrices=data;target.innerHTML=operatorPriceHtml(data);renderCatalogue();
 if(storageReady)await write('hut-prices-'+hut.id,data).catch(()=>{});
 }catch{if(current()){target.querySelector('[data-price-check]')?.remove();target.insertAdjacentHTML('beforeend',`<p class="note">The operator price check is unavailable. ${previous?'The last recorded operator rates above may be outdated.':'Any source-reported price above may be outdated.'} Confirm current rates directly with the hut.</p>`);}}
}
const priceShowHut=showHut;showHut=function(id){priceRequest?.abort();const revision=++priceRevision;priceShowHut(id);const target=$('hut-live-prices'),hut=planCandidates().find(h=>h.id===id)||tripStops.find(h=>h.id===id);if(target&&hut)checkHutPrices(hut,target,revision);};
$('detail').addEventListener('close',()=>{priceRequest?.abort();priceRevision++;});

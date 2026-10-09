'use strict';
let tripStops=[],stopDraftReady=false,stopWrite=Promise.resolve(),stopTimer=null,lastPlanSignature='';
let mapPicking=false,tripCalculationAbort=null;
let stopUndo=[],rememberedStops=[];
function resetStopUndo(){stopUndo=[];rememberedStops=structuredClone(tripStops);}

$('map').insertAdjacentHTML('afterend','<div class="map-picking"><button class="primary" id="pick-map-huts" aria-pressed="false">Pick huts on map</button><p id="map-pick-help" role="status" hidden></p><button class="text-button" id="restart-map-picks" hidden>Start a new hut selection</button></div>');
function updateMapPicking(){
 $('pick-map-huts').setAttribute('aria-pressed',String(mapPicking));$('pick-map-huts').textContent=mapPicking?'Done picking huts':'Pick huts on map';$('pick-map-huts').disabled=planBusy;
 $('map-pick-help').hidden=!mapPicking;$('restart-map-picks').hidden=!mapPicking;$('restart-map-picks').disabled=planBusy;
 $('map-pick-help').textContent=`Next hut: ${tripStops.length+1} · click to add`;
}
function hutMarkerAppearance(hut){const positions=tripStops.flatMap((h,i)=>h.id===hut.id?[i+1]:[]);return {className:'hut-marker'+(positions.length?' selected-hut-marker':''),html:positions.length>2?positions[0]+'+':positions.length?positions.join('·'):'⌂',iconSize:[positions.length>1?42:32,32],iconAnchor:[positions.length>1?21:16,16]};}
function selectMapHut(hut){
 if(!mapPicking){showHut(hut.id);return;}
 if(planBusy)return notify('Wait for route calculation to finish.');
 if(tripStops.at(-1)?.id===hut.id)return notify('This hut is already your last stop. Pick the next hut.');
 tripStops.push(hut);rememberStops();renderStops();syncStart();notify(`Stop ${tripStops.length}: ${hut.name}`);
}
$('pick-map-huts').onclick=()=>{if(planBusy)return;mapPicking=!mapPicking;if(mapPicking){view('explore');routeTabs(true);tripMode(false);}updateMapPicking();renderCatalogue();};
$('restart-map-picks').onclick=()=>{if(planBusy)return;tripStops=[];latestStage=null;rememberStops();renderStops();$('route-result').innerHTML='';notify('Hut selection cleared. Click your first hut on the map.');};
const pairStart=$('route-start').closest('label'),pairEnd=$('route-end').closest('label');pairStart.hidden=true;pairEnd.hidden=true;
$('review-panel').insertAdjacentHTML('afterbegin','<p id="pending-stops-warning" class="route-caution" hidden>Your hut list has changed. These are your previous calculated routes. Return to Choose huts and calculate the updated trip.</p>');
$('build-heading').insertAdjacentHTML('afterend','<div id="trip-stops"></div><button class="outline full" id="append-hut">+ Add another hut</button><button class="outline full" id="cancel-trip-calculation" hidden>Cancel calculation</button><button class="text-button" id="undo-hut-edit" disabled>↶ Undo hut edit</button><p id="stops-status" class="catalogue-status" role="status"></p>');
function stopsSignature(){return JSON.stringify(plannedStages.map(s=>[s.start.id,s.end.id]));}
function rememberStops(track=true){if(!stopDraftReady)return;if(track&&JSON.stringify(rememberedStops.map(h=>h.id))!==JSON.stringify(tripStops.map(h=>h.id))){stopUndo.push(rememberedStops);if(stopUndo.length>20)stopUndo.shift();}rememberedStops=structuredClone(tripStops);if(!storageReady)return;clearTimeout(stopTimer);const snapshot=structuredClone(tripStops);stopTimer=setTimeout(()=>{stopWrite=stopWrite.catch(()=>{}).then(()=>write('stopDraft',snapshot)).catch(()=>notify('Could not save hut choices; keep this page open.'));},200);}
function renderStops(){
 const savedStops=plannedStages.length?[plannedStages[0].start,...plannedStages.map(s=>s.end)]:[];$('pending-stops-warning').hidden=!plannedStages.length||JSON.stringify(tripStops.map(h=>h.id))===JSON.stringify(savedStops.map(h=>h.id));
 const candidates=[...new Map([...planCandidates(),...tripStops].map(h=>[h.id,h])).values()];$('build-heading').textContent='Choose your huts in order';$('build-help').textContent='Add as many stops as you need. Calculate the trip, then select any day to see the route between its two huts.';
 $('calculate-route').textContent=planBusy?'Calculating trip…':'Calculate trip routes →';
 $('trip-stops').innerHTML=tripStops.map((hut,i)=>{const choices=ItineraryCore.nearby(candidates,tripStops[i-1]||hut);return `<div class="trip-stop"><label>${i===0?'Starting hut':'Hut '+(i+1)}<select data-stop="${i}" ${planBusy?'disabled':''}>${choices.map(h=>`<option value="${esc(h.id)}" ${h.id===hut.id?'selected':''}>${esc(h.name)}</option>`).join('')}</select></label><div class="stop-order" role="group" aria-label="Reorder hut ${i+1}"><button class="text-button" data-stop-move="${i}" data-direction="-1" aria-label="Move hut ${i+1} earlier" ${planBusy||i===0?'disabled':''}>↑ Move earlier</button><button class="text-button" data-stop-move="${i}" data-direction="1" aria-label="Move hut ${i+1} later" ${planBusy||i===tripStops.length-1?'disabled':''}>↓ Move later</button></div><div class="stop-actions"><button class="text-button" data-stop-detail="${i}">Hut details</button><button class="text-button" data-stop-remove="${i}" aria-label="Remove hut ${i+1}" ${planBusy?'disabled':''}>Remove</button></div></div>`;}).join('');
 document.querySelectorAll('[data-stop]').forEach(select=>select.onchange=()=>{tripStops[Number(select.dataset.stop)]=candidates.find(h=>h.id===select.value);rememberStops();renderStops();syncStart();});
 document.querySelectorAll('[data-stop-remove]').forEach(b=>b.onclick=()=>{if(planBusy)return;tripStops.splice(Number(b.dataset.stopRemove),1);rememberStops();renderStops();syncStart();});
 document.querySelectorAll('[data-stop-move]').forEach(b=>b.onclick=()=>{if(planBusy)return;const i=Number(b.dataset.stopMove),next=i+Number(b.dataset.direction);if(next<0||next>=tripStops.length)return;[tripStops[i],tripStops[next]]=[tripStops[next],tripStops[i]];latestStage=null;$('route-result').innerHTML='';clearRouteComparison();rememberStops();renderStops();syncStart();updateRouteSelection();const direction=b.dataset.direction;const target=document.querySelector(`[data-stop-move="${next}"][data-direction="${direction}"]`);(target?.disabled?document.querySelector(`[data-stop="${next}"]`):target)?.focus();notify(`Hut moved to stop ${next+1}. Calculate trip routes to update the itinerary.`);});
 document.querySelectorAll('[data-stop-detail]').forEach(b=>b.onclick=()=>showHut(tripStops[Number(b.dataset.stopDetail)].id));
 $('cancel-trip-calculation').hidden=!tripCalculationAbort;$('cancel-trip-calculation').disabled=Boolean(tripCalculationAbort?.signal.aborted);
 $('undo-hut-edit').disabled=planBusy||!stopUndo.length;
 $('append-hut').textContent=tripStops.length?'+ Add another hut':'+ Add a hut';updateMapPicking();$('append-hut').disabled=planBusy;$('calculate-route').disabled=planBusy||tripStops.length<2;renderCatalogue();
}
$('undo-hut-edit').onclick=()=>{if(planBusy||!stopUndo.length)return;tripStops=stopUndo.pop();latestStage=null;$('route-result').innerHTML='';clearRouteComparison();rememberStops(false);renderStops();syncStart();updateRouteSelection();$('undo-hut-edit').focus();notify('Last hut edit undone. Calculate routes if your hut list differs from the trip.');};
function syncStart(){if(tripStops[0]){$('route-start').value=tripStops[0].id;renderCatalogue();}}
$('append-hut').onclick=()=>{if(planBusy)return;const last=tripStops.at(-1);const next=ItineraryCore.nearby(planCandidates().filter(h=>h.id!==last?.id),last)[0];if(!next)return notify('Choose a destination with more huts.');tripStops.push(next);rememberStops();renderStops();};
const stopsRefresh=refreshChoices;refreshChoices=function(){stopsRefresh();renderStops();};
const stopsRenderPlan=renderPlannedStages;renderPlannedStages=function(){stopsRenderPlan();const signature=stopsSignature();if(signature!==lastPlanSignature){lastPlanSignature=signature;tripStops=plannedStages.length?[plannedStages[0].start,...plannedStages.map(s=>s.end)]:[];resetStopUndo();rememberStops(false);}renderStops();};
const stopsBusy=setPlanBusy;setPlanBusy=function(busy){stopsBusy(busy);renderStops();};
$('cancel-trip-calculation').onclick=()=>{if(!tripCalculationAbort)return;tripCalculationAbort.abort();$('cancel-trip-calculation').disabled=true;$('stops-status').textContent='Cancelling calculation…';};
$('calculate-route').onclick=async()=>{
 if(planBusy||tripStops.length<2||!capturePlanSettings())return;
 const stops=structuredClone(tripStops),provider=$('routing-provider').value,difficulty=$('route-difficulty').value;
 if(stops.some((h,i)=>i&&h.id===stops[i-1].id))return notify('Consecutive huts must be different. Remove or change the repeated stop.');
 const before=plannedStages;tripCalculationAbort=new AbortController();const signal=tripCalculationAbort.signal;setPlanBusy(true);$('route-result').innerHTML='';
 try{const next=[];for(let i=0;i<stops.length-1;i++){signal.throwIfAborted();
 $('stops-status').textContent=`Calculating leg ${i+1} of ${stops.length-1}: ${stops[i].name} → ${stops[i+1].name}…`;
 const old=before.find(s=>s.start.id===stops[i].id&&s.end.id===stops[i+1].id&&(s.provider==='ors'?'ors':'mapped')===provider&&s.difficulty===difficulty&&Number.isFinite(s.ascentM)&&Number.isFinite(s.descentM)&&Number.isFinite(s.hours));
 try{next.push(old?{...old,restAfter:Boolean(before[i]?.start.id===stops[i].id&&before[i]?.end.id===stops[i+1].id&&before[i].restAfter)}:await elevate({...await geometryFor(stops[i],stops[i+1],difficulty,provider,signal),start:stops[i],end:stops[i+1],difficulty},signal));}catch(e){throw Error(`Leg ${i+1} (${stops[i].name} → ${stops[i+1].name}): ${e.message}`);}
 }
 signal.throwIfAborted();const reconciled=ItineraryCore.reconcileStages(next,before);
 plannedStages=reconciled;tripStops=stops;resetStopUndo();latestStage=null;mapPicking=false;routePlanChanged();renderPlannedStages();renderRouteMap();syncStart();tripMode(true);$('stops-status').textContent=`${next.length} connected routes ready. Select a day to see its details.`;
 }catch(e){if(signal.aborted){$('stops-status').textContent='Calculation cancelled. Your hut choices and previous calculated trip are kept.';notify('Calculation cancelled.');}else{$('stops-status').textContent=e.message+' Your previous calculated trip is unchanged.';notify('Could not calculate every leg. Your hut choices and previous trip have been kept.');}}
 finally{tripCalculationAbort=null;setPlanBusy(false);}
};
const stopsShowHut=showHut;showHut=function(id){const saved=[...planCandidates(),...tripStops].find(h=>h.id===id);let added=false;if(saved&&!huts.some(h=>h.id===id)){huts.push(saved);added=true;}stopsShowHut(id);if(added)huts.pop();if($('route-from-hut'))$('route-from-hut').onclick=()=>{if(planBusy)return;tripStops=[saved];rememberStops();$('detail').close();view('explore');routeTabs(true);tripMode(false);renderStops();syncStart();};if($('route-to-hut'))$('route-to-hut').onclick=()=>{if(planBusy)return;if(tripStops.at(-1)?.id===id)return notify('This hut is already your last stop.');tripStops.push(saved);rememberStops();$('detail').close();view('explore');routeTabs(true);tripMode(false);renderStops();};};
const stopsShowTrip=showTrip;showTrip=function(t){stopsShowTrip(t);if($('restore-route')){const restore=$('restore-route').onclick;$('restore-route').onclick=()=>{restore();tripStops=[plannedStages[0].start,...plannedStages.map(s=>s.end)];lastPlanSignature=stopsSignature();resetStopUndo();rememberStops(false);renderStops();};}};
const stopsClear=$('clear-route').onclick;$('clear-route').onclick=()=>{if(planBusy)return;stopsClear();tripStops=[];resetStopUndo();rememberStops(false);renderStops();tripMode(false);};
async function restoreStopDraft(){for(let i=0;i<100&&(!storageReady||!localNetwork);i++)await new Promise(r=>setTimeout(r,20));try{const draft=storageReady?await read('stopDraft'):null;if(Array.isArray(draft)&&draft.every(h=>h&&typeof h.id==='string'&&typeof h.name==='string'&&Number.isFinite(h.lat)&&Number.isFinite(h.lng)))tripStops=draft;else if(plannedStages.length)tripStops=[plannedStages[0].start,...plannedStages.map(s=>s.end)];}catch{}stopDraftReady=true;resetStopUndo();lastPlanSignature=stopsSignature();renderStops();syncStart();}
renderStops();restoreStopDraft();

'use strict';
function workingPlanDirty(){
 const saved=trips.find(t=>t.id===activeRouteTripId),keys=['name','startDate','group','distance','hours','ascent','routeDifficulty'];
 const calculatedStops=plannedStages.length?[plannedStages[0].start,...plannedStages.map(s=>s.end)]:[];
 const pending=JSON.stringify(tripStops.map(h=>h.id))!==JSON.stringify(calculatedStops.map(h=>h.id));
 return Boolean(pending||plannedStages.length&&(!saved||JSON.stringify(saved.stages)!==JSON.stringify(plannedStages)||keys.some(k=>saved.preferences[k]!==planPreferences[k])));
}
function guardWorkingPlan(action){
 if(planBusy)return notify('Finish or cancel the current calculation first.');
 if(!workingPlanDirty())return action();
 const calculatedStops=plannedStages.length?[plannedStages[0].start,...plannedStages.map(s=>s.end)]:[],pending=JSON.stringify(tripStops.map(h=>h.id))!==JSON.stringify(calculatedStops.map(h=>h.id));
 detail('Keep your current work?','SWITCH TRIPS',`<p>You have changes in the current draft.${pending?' Your hut choices differ from the calculated trip; calculate them first to save those routes.':''}</p><div class="trip-actions"><button class="outline" id="keep-working-plan">Keep working</button>${plannedStages.length&&!pending&&storageReady?'<button class="primary" id="save-before-switch">Save trip & continue</button>':''}<button class="outline" id="discard-before-switch">Discard draft & continue</button></div><p class="intro">Saved trips remain in My trips. Switching replaces the current browser draft.</p>`);
 $('keep-working-plan').onclick=()=>$('detail').close();
 $('discard-before-switch').onclick=()=>{if(planBusy)return;$('detail').close();action();};
 if($('save-before-switch'))$('save-before-switch').onclick=async()=>{const revision=planRevision;const b=$('save-before-switch');b.disabled=true;await saveRoutePlan();if(!workingPlanDirty()&&revision<=planRevision){$('detail').close();action();}else{b.disabled=false;notify('The draft was not saved. Keep working or export a backup before switching.');}};
}
function openTripEditor(t){
 guardWorkingPlan(()=>{view('explore');if(t.stages?.length){showTrip(t);$('restore-route')?.click();}else{plannedStages=[];latestStage=null;planPreferences={...defaults(),...t.preferences};activeRouteTripId=t.id;tripStops=[];const hut=planCandidates().find(h=>h.id===t.preferences.startHut);if(hut)tripStops=[hut];resetStopUndo();lastPlanSignature=stopsSignature();renderPlanSettings();routePlanChanged();rememberStops(false);renderPlannedStages();renderRouteMap();routeTabs(true);tripMode(false);} $('sidebar').scrollTop=0;});
}
function startFreshTrip(){guardWorkingPlan(()=>{$('clear-route').onclick();view('explore');routeTabs(true);tripMode(false);$('sidebar').scrollTop=0;notify('New trip started. Saved trips are in My trips.');});}
$('build-panel').insertAdjacentHTML('beforeend','<button class="text-button" id="start-fresh-trip">Start a separate trip</button>');
$('start-fresh-trip').onclick=startFreshTrip;
const previousTripAction=tripAction;tripAction=async function(action,id){const t=trips.find(x=>x.id===id);if(action==='open'&&t)return openTripEditor(t);return previousTripAction(action,id);};
renderTrips=function(){
 $('trip-count').textContent=trips.length;
 $('trip-list').innerHTML=trips.length?trips.map(t=>{const p=t.preferences,stages=t.stages||[],total=ItineraryCore.totals(stages),confirmed=stages.filter((s,i)=>ItineraryCore.overnight(stages,i,p.startDate).status==='confirmed').length,checked=stages.filter((s,i)=>ItineraryCore.review(stages,i,p.startDate).count===3).length;return `<article class="trip-card"><div class="trip-cover">⌁<span>DOLOMITES, ITALY</span></div><div class="trip-body"><span class="pill">${stages.length?'SAVED ITINERARY':'PREFERENCES ONLY'}</span><h2>${esc(p.name)}</h2><p>${esc(p.startDate)} → ${esc(stages.length?ItineraryCore.dateAt(p.startDate,total.calendarDays-1):p.endDate)}</p><div class="trip-meta"><div><strong>${stages.length||p.days}</strong><small>hiking days</small></div><div><strong>${stages.length?(total.distanceM/1000).toFixed(2)+' km':p.distance===null?'Any':p.distance+' km'}</strong><small>${stages.length?'route distance':'daily limit'}</small></div><div><strong>${p.group}</strong><small>people</small></div></div><p>${stages.length?`${confirmed} / ${stages.length} overnights marked confirmed<br>${checked} / ${stages.length} days personally checked`:'Choose huts to build your itinerary.'}</p><small class="saved-trip-caution">${stages.length?'Route preview · access and conditions need checking':'No calculated routes yet'}</small><div class="trip-actions"><button class="primary" data-action="open" data-id="${esc(t.id)}">${stages.length?'Open trip →':'Build this trip →'}</button><button class="outline" data-action="duplicate" data-id="${esc(t.id)}">Duplicate</button><button class="outline" data-action="delete" data-id="${esc(t.id)}">Delete</button></div></div></article>`;}).join(''):'<div class="empty"><div class="eyebrow">YOUR FIRST JOURNEY</div><h2>Choose your huts. Build your trip.</h2><p>Explore a destination or pick huts on the map in travel order.</p><button class="primary" id="empty-new">Plan my first trip →</button></div>';
 if($('empty-new'))$('empty-new').onclick=$('new-trip').onclick;
 document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>tripAction(b.dataset.action,b.dataset.id));
};
renderTrips();

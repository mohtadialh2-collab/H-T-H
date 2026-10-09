'use strict';
function tripFileName(){return (planPreferences.name.normalize('NFKD').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'traversa-trip');}
function downloadTripFile(content,type,suffix){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=tripFileName()+suffix;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function bindTravelExports(){
 if(!$('download-gpx'))return;
 $('download-gpx').onclick=()=>{if(planBusy||!capturePlanSettings())return;try{downloadTripFile(TripExport.gpx(plannedStages,settingsFromPlan()),'application/gpx+xml','.gpx');notify('GPX downloaded. Each day is a separate track; hut approach gaps stay excluded.');}catch(e){notify(e.message);}};
 $('print-trip').onclick=()=>{if(planBusy||!capturePlanSettings())return;const stages=structuredClone(plannedStages),prefs=structuredClone(settingsFromPlan());detail('Take your trip with you','PRINT OR SAVE OFFLINE',`<p>Print or save as PDF using your browser, or download an itinerary you can open offline.</p><label class="include-notes"><input type="checkbox" id="include-booking-notes">Include private booking and review notes</label><div class="travel-actions"><button class="primary" id="print-itinerary">Print / Save as PDF</button><button class="outline" id="download-itinerary">Download offline itinerary</button></div><div id="itinerary-preview"></div>`);
 const preview=()=>{$('itinerary-preview').innerHTML=TripExport.itinerary(stages,prefs,$('include-booking-notes').checked);};preview();$('include-booking-notes').onchange=preview;
 $('download-itinerary').onclick=()=>downloadTripFile(TripExport.html(stages,prefs,$('include-booking-notes').checked),'text/html;charset=utf-8','-itinerary.html');
 $('print-itinerary').onclick=()=>{document.querySelector('.trip-print-copy')?.remove();const copy=document.createElement('div');copy.className='trip-print-copy';copy.innerHTML=$('itinerary-preview').innerHTML;document.body.append(copy);document.body.classList.add('printing-itinerary');window.print();};
 };
}
window.addEventListener('afterprint',()=>{document.body.classList.remove('printing-itinerary');document.querySelector('.trip-print-copy')?.remove();});

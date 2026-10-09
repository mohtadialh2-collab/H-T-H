(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.TrailGraph=value;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 const rad=x=>x*Math.PI/180;
 function distance(a,b){const p=rad(b[1]-a[1]),q=rad(b[0]-a[0]);const h=Math.sin(p/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(q/2)**2;return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}
 function fromOverpass(data){const nodes={};for(const e of data.elements||[])if(e.type==='node'&&Number.isFinite(e.lon)&&Number.isFinite(e.lat))nodes[e.id]=[e.lon,e.lat];const ways=(data.elements||[]).filter(e=>e.type==='way'&&['path','footway','track','steps'].includes(e.tags?.highway)&&e.nodes?.every(id=>nodes[id])).map(e=>({id:String(e.id),nodes:e.nodes.map(String),tags:e.tags||{}}));return {nodes,ways};}
 function route(network,start,end,maxDifficulty='mountain_hiking'){
 const ranks={hiking:0,mountain_hiking:1,demanding_mountain_hiking:2,alpine_hiking:3,demanding_alpine_hiking:4,difficult_alpine_hiking:5};const limit=ranks[maxDifficulty]??1;
 const adjacency=new Map(),usedWays=new Map();let unknown=0;
 for(const w of network.ways){const t=w.tags||{};if(['private','no'].includes(t.access)||['private','no'].includes(t.foot)||t.highway==='steps'&&t.via_ferrata||t.via_ferrata||t['via_ferrata:scale']||t.highway==='via_ferrata'||t.route==='via_ferrata'||t.highway==='track'&&t.foot==='no')continue;if(t.sac_scale&&(ranks[t.sac_scale]===undefined||ranks[t.sac_scale]>limit))continue;usedWays.set(w.id,w);for(let i=1;i<w.nodes.length;i++){const a=String(w.nodes[i-1]),b=String(w.nodes[i]);if(!network.nodes[a]||!network.nodes[b])continue;const d=distance(network.nodes[a],network.nodes[b]);for(const [from,to] of [[a,b],[b,a]]){if(!adjacency.has(from))adjacency.set(from,[]);adjacency.get(from).push({to,d,way:w.id});}}}
 function nearest(c){let best=null,gap=Infinity;for(const id of adjacency.keys()){const d=distance(c,network.nodes[id]);if(d<gap){gap=d;best=id;}}if(gap>100)throw Error('No eligible mapped trail lies within 100 m of this hut. No connection was created.');return {id:best,gap};}
 const a=nearest(start),b=nearest(end);if(a.id===b.id)throw Error('Both huts resolve to the same mapped trail point. Select different huts.');
 const costs=new Map([[a.id,0]]),parents=new Map(),done=new Set();let queue=[[0,a.id]];
 while(queue.length){queue.sort((a,b)=>b[0]-a[0]);const [cost,id]=queue.pop();if(done.has(id))continue;done.add(id);if(id===b.id)break;for(const edge of adjacency.get(id)||[]){const next=cost+edge.d;if(next<(costs.get(edge.to)??Infinity)){costs.set(edge.to,next);parents.set(edge.to,{id,way:edge.way});queue.push([next,edge.to]);}}}
 if(!costs.has(b.id))throw Error('The eligible mapped trails are disconnected. Try different huts or a different difficulty limit; no bridging line was invented.');
 const ids=[b.id],wayIds=new Set();let id=b.id;while(id!==a.id){const p=parents.get(id);if(!p)throw Error('Incomplete route topology.');wayIds.add(p.way);id=p.id;ids.push(id);}ids.reverse();const ways=[...wayIds].map(id=>usedWays.get(id));unknown=ways.filter(w=>!w.tags.sac_scale).length;
 return {geometry:ids.map(id=>network.nodes[id]),distanceM:costs.get(b.id),startGapM:a.gap,endGapM:b.gap,ways:ways.map(w=>({id:w.id,ref:w.tags.ref||null,name:w.tags.name||null,difficulty:w.tags.sac_scale||'unknown',surface:w.tags.surface||'unknown',source:'https://www.openstreetmap.org/way/'+w.id})),unknownDifficulty:unknown,verification:'mapped_trails_unreviewed_hut_access',warnings:['This is a route between nearby mapped trail points, not a verified hut-to-hut itinerary.','The final approaches to both huts are excluded. No straight-line connectors were added.',...(unknown?['Some trail sections have no recorded difficulty.']:[])]};
 }
 function fromOsmXml(xml){
 const decode=v=>v.replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
 const attrs=s=>Object.fromEntries([...s.matchAll(/([\w:]+)="([^"]*)"/g)].map(m=>[m[1],decode(m[2])]));
 const nodes={};for(const m of xml.matchAll(/<node\b([^>]+)>?/g)){const a=attrs(m[1]);if(a.id&&Number.isFinite(Number(a.lon))&&Number.isFinite(Number(a.lat)))nodes[a.id]=[Number(a.lon),Number(a.lat)];}
 const ways=[];for(const m of xml.matchAll(/<way\b([^>]+)>([\s\S]*?)<\/way>/g)){const a=attrs(m[1]),body=m[2],tags={};for(const t of body.matchAll(/<tag\b([^>]+)\/>/g)){const x=attrs(t[1]);tags[x.k]=x.v;}if(!['path','footway','track','steps'].includes(tags.highway))continue;const ids=[...body.matchAll(/<nd\b([^>]+)\/>/g)].map(n=>attrs(n[1]).ref);if(ids.length>=2&&ids.every(id=>nodes[id]))ways.push({id:a.id,nodes:ids,tags});}
 return {nodes,ways};
 }
 return {distance,route,fromOverpass,fromOsmXml};
});

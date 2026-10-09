"""Import a bounded public OSM hut catalogue, retaining source hashes and coverage.
Raw source XML belongs in work/ and is not deployed. No trail connections inferred.
"""
import concurrent.futures, hashlib, json, time, urllib.request, xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path('/workspace/H-T-H'); CACHE=Path('/workspace/work/regional-osm'); CACHE.mkdir(parents=True,exist_ok=True)
WEST,SOUTH,EAST,NORTH=11.3,46.1,12.6,46.85
def cell(bbox,depth=0):
    key='-'.join(f'{n:.5f}' for n in bbox); path=CACHE/(key+'.xml');url='https://api.openstreetmap.org/api/0.6/map?bbox='+','.join(map(str,bbox))
    try:
        if not path.exists():
            request=urllib.request.Request(url,headers={'User-Agent':'Traversa/0.2 (OSM catalogue research)'})
            with urllib.request.urlopen(request,timeout=75) as response:raw=response.read(40_000_001)
            if len(raw)>40_000_000:raise ValueError('Cell too large')
            path.write_bytes(raw)
        raw=path.read_bytes();root=ET.fromstring(raw);nodes={n.attrib['id']:(float(n.attrib['lon']),float(n.attrib['lat'])) for n in root.findall('node')};huts=[]
        for e in root:
            tags={t.attrib['k']:t.attrib['v'] for t in e.findall('tag')}
            if tags.get('tourism')!='alpine_hut' or not tags.get('name'):continue
            if e.tag=='node':coord=nodes[e.attrib['id']]
            elif e.tag=='way':
                points=[nodes[n.attrib['ref']] for n in e.findall('nd') if n.attrib['ref'] in nodes]
                if not points:continue
                coord=(sum(p[0] for p in points)/len(points),sum(p[1] for p in points)/len(points))
            else:continue
            if not (WEST<=coord[0]<=EAST and SOUTH<=coord[1]<=NORTH):continue
            site=tags.get('website') or tags.get('contact:website')
            if site and not site.startswith(('https://','http://')):site=None
            facility_labels={'drinking_water':'Drinking water','shower':'Showers','toilets':'Toilets','internet_access':'Internet','electricity':'Electricity','wheelchair':'Wheelchair access','diet:vegetarian':'Vegetarian meals','diet:vegan':'Vegan meals'}
            facilities=' · '.join(label+': '+tags[key] for key,label in facility_labels.items() if tags.get(key)) or None
            huts.append({'id':f'osm-{e.tag}-{e.attrib["id"]}','name':tags['name'],'lng':coord[0],'lat':coord[1],'height':tags.get('ele','Not recorded')+' m','beds':tags.get('beds'),'phone':tags.get('phone') or tags.get('contact:phone'),'site':site,'opening':tags.get('opening_hours'),'facilities':facilities,'source':f'https://www.openstreetmap.org/{e.tag}/{e.attrib["id"]}','position':'OSM node or building centre; entrance unreviewed','verification':'source_reported'})
        print(f'Cell {key}: {len(huts)} hut records',flush=True)
        return huts,[{'bbox':bbox,'url':url,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'status':'retrieved'}]
    except Exception as error:
        if depth<2 and ('400' in str(error) or 'large' in str(error)):
            w,s,e,n=bbox;mx=(w+e)/2;my=(s+n)/2;allh=[];sources=[]
            for part in [(w,s,mx,my),(mx,s,e,my),(w,my,mx,n),(mx,my,e,n)]:
                h,r=cell(part,depth+1);allh.extend(h);sources.extend(r)
            return allh,sources
        print(f'Cell {key} failed: {str(error)[:100]}',flush=True)
        return [],[{'bbox':bbox,'url':url,'status':'failed','reason':str(error)[:100]}]
cells=[(round(WEST+i*(EAST-WEST)/5,5),round(SOUTH+j*(NORTH-SOUTH)/3,5),round(WEST+(i+1)*(EAST-WEST)/5,5),round(SOUTH+(j+1)*(NORTH-SOUTH)/3,5)) for j in range(3) for i in range(5)]
retained=json.loads((ROOT/'demo/data/dolomites.json').read_text())
huts={h['id']:h for h in retained['huts']};sources=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    for found,records in pool.map(cell,cells):
        huts.update({h['id']:h for h in found});sources.extend(records)
data={'region':'dolomites','retrievedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'bbox':[WEST,SOUTH,EAST,NORTH],'huts':sorted(huts.values(),key=lambda h:h['name']),'coverage':'Named OSM alpine_hut nodes and buildings within a Dolomites bounding box, not an official boundary or guaranteed complete hut inventory. Relation-only huts are not included.','completeCells':all(s['status']=='retrieved' for s in sources),'sources':sources,'license':'OpenStreetMap contributors / Open Database License (ODbL)'}
if not any(s['status']=='retrieved' for s in sources):
    raise SystemExit('No source cells retrieved; existing catalogue left unchanged.')
data['completeCells']=False
data['coverage']='Merged partial OSM node/building import; existing huts preserved. Relation-only huts require the Overpass importer. Completeness is not guaranteed.'
data['sources']=retained.get('sources',[])+sources
output=ROOT/'demo/data/dolomites.json';temporary=output.with_suffix('.json.tmp')
temporary.write_text(json.dumps(data,separators=(',',':')));temporary.replace(output)
print(f'Imported {len(huts)} distinct huts; {sum(s["status"]=="retrieved" for s in sources)}/{len(sources)} source cells retrieved.',flush=True)

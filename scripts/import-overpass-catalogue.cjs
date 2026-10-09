// Import a previously downloaded bounded Overpass response. No network calls.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {catalogue,mergeCatalogue}=require('../demo/api/_providers');
function importCatalogue(raw,retained,observedAt){
 const data=JSON.parse(raw);
 if(data.remark||!Array.isArray(data.elements))throw Error('Incomplete or invalid source response; catalogue unchanged.');
 if(!observedAt||!Number.isFinite(Date.parse(observedAt)))throw Error('Provide the source retrieval timestamp.');
 const fresh={...catalogue(data,'dolomites'),retrievedAt:new Date(observedAt).toISOString()};
 const result=mergeCatalogue(retained,fresh);
 result.sources=[...(retained.sources||[]),{url:'https://overpass-api.de/api/interpreter',sha256:crypto.createHash('sha256').update(raw).digest('hex'),bytes:Buffer.byteLength(raw),retrievedAt:fresh.retrievedAt,status:'retrieved',records:fresh.huts.length}];
 return result;
}
if(require.main===module){
 try{
 const [input,observedAt,outputArg]=process.argv.slice(2);
 if(!input)throw Error('Usage: node scripts/import-overpass-catalogue.cjs RAW_JSON RETRIEVED_AT [OUTPUT]');
 const output=outputArg||path.join(__dirname,'../demo/data/dolomites.json');
 const raw=fs.readFileSync(input,'utf8');if(Buffer.byteLength(raw)>5000000)throw Error('Source exceeds 5 MB limit.');
 const retained=JSON.parse(fs.readFileSync(output,'utf8'));
 const result=importCatalogue(raw,retained,observedAt);
 const temporary=output+'.tmp';fs.writeFileSync(temporary,JSON.stringify(result));fs.renameSync(temporary,output);
 console.log(`Retained ${result.huts.length} huts; ${result.retainedCount} were absent from this response. Inventory remains partial.`);
 }catch(error){console.error(error.message);process.exitCode=1;}
}
module.exports={importCatalogue};

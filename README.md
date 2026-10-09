# Traversa / H-T-H

Regional Dolomites hut explorer and mapped-trail route planner, deployed at https://traversa-hth-demo.vercel.app.

## Working features
- Retained, searchable catalogue of 46 source-reported OSM huts; Dolomites, Cortina and Cinque Torri destination views, elevation and route-corridor filters.
- Interactive locally bundled Leaflet topographic/satellite map, source links, phone and reported bed/opening records where present.
- Real connected OSM trail geometry using Dijkstra routing; no straight-line hut connectors. Choose successive huts to assemble a plan.
- Mapped distance; Open-Meteo 90 m DEM elevation profile, estimated ascent/descent and Naismith-style time when the provider works.
- Browser-local IndexedDB storage, trip briefs and route previews, edit/duplicate/delete, versioned JSON export/import-as-copy.
- Vercel Node 24 APIs for catalogue, bounded route geometry and elevation; no API keys required.

## Coverage and interpretation
This is still a demo, not Phase 1 completion. The regional OSM import was quota-limited: 46 indexed huts is not the full Dolomites inventory. Source-cell coverage and hashes are retained in demo/data/dolomites.json. Relation-only huts are excluded by the snapshot importer. The region uses a bounding box, not an official boundary. Unknown records remain visible. Live Overpass refresh is optional; failures preserve the snapshot.

Route output is a **mapped trail preview**, not a verified hut-to-hut navigation itinerary. The nearest eligible mapped trail node within 100 m is selected; final gaps to hut building centres are excluded and shown numerically. Known private/no-access paths, via ferrata and excessive recorded SAC difficulty are excluded. Missing difficulty, seasonal restrictions, route closures and current conditions remain unresolved. No accommodation availability or price is asserted.

Cinque Torri has retained real graph geometry (156 ways, 3,069 nodes). Elsewhere, route requests retrieve a bounded OSM map snapshot; source outages or areas too large return explicit errors. Stages more than 18 km apart in a straight line require intermediate huts.

DEM-derived ascent/descent and time are estimates; quota or provider failure leaves these metrics unavailable. No AI route generation or application-password authentication is implemented. Existing Vercel deployment protection is preserved.

## Development
Serve demo/ locally; API handlers run on Vercel. No build or installation step. graph.js exports pure routing/XML parsing helpers for Node tests and browser use. scripts/import-regional-catalogue.py retains raw sources in /workspace/work/regional-osm, emits a catalogue with coverage evidence, and never infers hut access. Avoid refreshing all source cells repeatedly after quota responses.

## Verification
Browser checks cover the catalogue, map markers, search, destination change, actual mapped route geometry, multi-stage planning, persistence/restoration, backup import/export and mobile width. Pure route checks cover private access, via ferrata, excessive difficulty and hut-gap exclusion. Live source/provider checks are reported separately; fixtures do not establish provider readiness.

## Next milestones
Complete regional import with a production OSM data pipeline; add a geographic database and incremental updates; review hut approaches and route conditions; add identity/private user data; then rank feasible routes with AI. Use this demo to validate the destination/planning interaction without calling its data field-verified.

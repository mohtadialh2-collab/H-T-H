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

## ORS integration
Select Openrouteservice hiking in the routing provider menu. Set ORS_API_KEY as a Secret in Vercel Production and Preview and redeploy after changes. The key is only read on the server, sent to the fixed ORS API origin in the Authorization header, and never returned to the client or logged. GET /api/ors reports configuration status only; route requests accept two indexed hut IDs and a maximum recorded difficulty. Provider results are validated for geometry, metrics, endpoint snapping (100 m maximum) and recorded difficulty. Unknown difficulty and unreviewed final hut access remain explicit. Provider calls time out after 20 seconds and successful route responses cache for 30 minutes. Authentication, denied permissions, quota, invalid routes and timeouts preserve current plans; there is no silent switch of routing provider. ORS route validation does not independently verify via ferrata exclusion or seasonal restrictions.

## Itinerary editing
Meet the huts is sorted by haversine straight-line distance from the selected route-start hut (including its zero-distance starting entry). Changing the start through the dropdown or hut detail panel updates the order; filters remain applied. These are proximity distances, not route distances or reachability claims.

Saved and unfinished plans support day-by-day dates, a rest day after each overnight, daily distance/time/ascent limits and explicit exceeded/unknown checks. Replacing an overnight or moving one earlier recalculates only affected legs with each leg’s original provider and recorded difficulty setting. A failure keeps the complete original plan; no partial edit is committed. Rest days move with overnight huts. Final stages can be removed. Drafts persist in IndexedDB, saving an opened trip updates that same trip, and JSON backups retain rest-day metadata. Coverage, unknown difficulty and unreviewed hut access caveats remain unchanged.

Run `node --test tests/ors.test.cjs tests/itinerary.test.cjs`. Browser verification covers start-hut proximity order, replacement of two connected legs, overnight reorder, rest-day date changes, daily limits, draft reload, updating saved trips, provider-failure rollback and backup round trips.

## Multi-hut trip builder
Choose an ordered list of hut stops using “Add another hut”, then calculate all consecutive legs. There is no fixed hut or stage count limit. Each day opens its own route details, and map routes highlight on hover with estimated metrics. Pending stop choices and calculated plans persist separately in browser storage. Calculation commits the entire new sequence only when all legs succeed; failures retain the existing itinerary. Long-trip preferences and stages validate on restoration and backup import (32 MB backup size limit). Run `node tests/ui.browser.cjs` with Playwright and Chromium installed for the multi-hut browser regression.

## Plan by clicking the map
Use “Pick huts on map” to append huts in click order. Selected markers display stop numbers, which renumber after removal and persist with the hut draft. Previously selected huts stay visible on the map when catalogue filters change. “Done picking huts” restores normal detail clicks; stop-list detail buttons remain available during selection. “Start a new hut selection” clears pending hut choices while keeping the previously calculated itinerary until a replacement succeeds. Repeated visits share one marker with multiple stop numbers (long sequences use a compact plus badge and full numbers in the tooltip).

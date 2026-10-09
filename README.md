# Traversa / H-T-H

Regional Dolomites hut explorer and mapped-trail route planner, deployed at https://traversa-hth-demo.vercel.app.

## Working features
- Retained, searchable catalogue of 296 source-reported OSM hut records; Dolomites, Cortina and Cinque Torri destination views, elevation and route-corridor filters.
- Interactive locally bundled Leaflet topographic/satellite map, source links, phone and reported bed/opening records where present.
- Real connected OSM trail geometry using Dijkstra routing; no straight-line hut connectors. Choose successive huts to assemble a plan.
- Mapped distance; Open-Meteo 90 m DEM elevation profile, estimated ascent/descent and Naismith-style time when the provider works.
- Browser-local IndexedDB storage, trip briefs and route previews, edit/duplicate/delete, versioned JSON export/import-as-copy.
- Vercel Node 24 APIs for catalogue, bounded route geometry and elevation; no API keys required.

## Coverage and interpretation
This is still a demo, not Phase 1 completion. A bounded Overpass refresh on 2026-10-09 expanded the retained catalogue from 46 to 296 named alpine-hut records. These records are not a verified full Dolomites inventory. Four nearby same-name pairs are flagged as possible duplicates, without merging distinct OSM identities. Cortina contains 55 indexed records. Source coverage, retrieval timestamps and hashes are retained in demo/data/dolomites.json. The legacy XML importer excludes relation-only huts; the Overpass importer supports nodes, ways and relations. The region uses a bounding box, not an official boundary. Unknown records remain visible. Live Overpass refresh is optional; failures preserve the snapshot.

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
Select Openrouteservice hiking in the routing provider menu. Set ORS_API_KEY as a Secret in Vercel Production and Preview and redeploy after changes. The key is only read on the server, sent to the fixed ORS API origin in the Authorization header, and never returned to the client or logged. GET /api/ors reports configuration status only; route requests accept two hut IDs; newly discovered IDs are verified server-side against bounded OSM alpine-hut records and a maximum recorded difficulty. Provider results are validated for geometry, metrics, endpoint snapping (100 m maximum) and recorded difficulty. Unknown difficulty and unreviewed final hut access remain explicit. Provider calls time out after 20 seconds and successful route responses cache for 30 minutes. Authentication, denied permissions, quota, invalid routes and timeouts preserve current plans; there is no silent switch of routing provider. ORS route validation does not independently verify via ferrata exclusion or seasonal restrictions.

## Itinerary editing
Meet the huts is sorted by haversine straight-line distance from the selected route-start hut (including its zero-distance starting entry). Changing the start through the dropdown or hut detail panel updates the order; filters remain applied. These are proximity distances, not route distances or reachability claims.

Saved and unfinished plans support day-by-day dates, a rest day after each overnight, daily distance/time/ascent limits and explicit exceeded/unknown checks. Replacing an overnight or moving one earlier recalculates only affected legs with each leg’s original provider and recorded difficulty setting. A failure keeps the complete original plan; no partial edit is committed. Rest days move with overnight huts. Final stages can be removed. Drafts persist in IndexedDB, saving an opened trip updates that same trip, and JSON backups retain rest-day metadata. Coverage, unknown difficulty and unreviewed hut access caveats remain unchanged.

Run `node --test tests/ors.test.cjs tests/itinerary.test.cjs`. Browser verification covers start-hut proximity order, replacement of two connected legs, overnight reorder, rest-day date changes, daily limits, draft reload, updating saved trips, provider-failure rollback and backup round trips.

## Multi-hut trip builder
Choose an ordered list of hut stops using “Add another hut”, then calculate all consecutive legs. There is no fixed hut or stage count limit. Each day opens its own route details, and map routes highlight on hover with estimated metrics. Pending stop choices and calculated plans persist separately in browser storage. Calculation commits the entire new sequence only when all legs succeed; failures retain the existing itinerary. Long-trip preferences and stages validate on restoration and backup import (32 MB backup size limit). Run `node tests/ui.browser.cjs` with Playwright and Chromium installed for the multi-hut browser regression.

## Plan by clicking the map
Use “Pick huts on map” to append huts in click order. Selected markers display stop numbers, which renumber after removal and persist with the hut draft. Previously selected huts stay visible on the map when catalogue filters change. “Done picking huts” restores normal detail clicks; stop-list detail buttons remain available during selection. “Start a new hut selection” clears pending hut choices while keeping the previously calculated itinerary until a replacement succeeds. Repeated visits share one marker with multiple stop numbers (long sequences use a compact plus badge and full numbers in the tooltip).

## Trip overview (batched release)
Review trip now includes total geometry distance, estimated total walking time and ascent, calendar dates, hiking/rest-day counts and hut stops. A total stays incomplete if any hiking day lacks its estimate. Day cards flag daily-limit exceedances, missing estimates and incomplete recorded difficulty; overall hut-access, conditions and overnight warnings remain visible. Selecting a day or clicking a route synchronizes the active card and highlighted map route; mouseout preserves that selection. “Show whole trip on map” clears the selection and fits all calculated legs and hut centres.

## Overnight tracking (batched release)
Each hiking day offers hut details and a planned overnight with Not contacted, Requested or Confirmed status and private browser-local notes (up to 2,000 characters). Statuses are self-reported; this does not send requests or verify operator confirmations. Records bind to the hut, arrival date and one/two-night stay. Changing those details prompts reconfirmation; repeating a hut on different days keeps separate records. Drafts, saved trips and JSON backups preserve and validate overnight metadata; legacy backups remain supported. Source-reported facility tags are retained where present and missing season/facilities/booking data stays explicit.

## Travel exports (batched release)
Review trip provides a GPX download and a print/offline itinerary preview. GPX 1.1 exports each hiking day as a separate track using original route points and numbers hut centres as waypoints. Unreviewed hut approach gaps remain excluded; DEM samples are not assigned to unrelated geometry vertices. Printable and standalone HTML itineraries include dates, rest days, estimated metrics, source warnings, hut contacts and self-reported overnight statuses. Private booking notes are excluded by default and may be explicitly included. Offline HTML has no scripts or external assets; operator links require internet. Print / Save as PDF uses the browser print dialog. Exports represent calculated stages even when pending hut choices differ.

Validate export behavior with `node --test tests/trip-export.test.cjs` and `node tests/ui.browser.cjs`.

## Pending routing/elevation and language fixes
The builder defaults to ORS and displays the selected provider. The overview identifies the provider/time method and includes estimated ascent, descent and elevation range. Missing cached estimates trigger recalculation without silently dropping rest days or notes. ORS normalization retains vertex-aligned elevations and derives ascent/descent from those vertices when totals are absent; DEM fallback retains ORS time. Opening-hour summaries translate known Italian source comments into English, preserve unknown information without inventing translations, and expose original records separately. Run `node --test tests/hut-info.test.cjs tests/ors.test.cjs` and `node tests/provider.browser.cjs` for the added regression checks. These fixes are not deployed.

## Route comparison (pending batch)
Select a calculated hiking day, then choose Compare ORS & mapped trails. The other provider is requested only when comparing. Results show both estimates and data gaps, with optional map preview (current gold, alternative dashed purple). The providers may find the same trail. A new route is committed only after choosing it; cancellation, unavailable sources and stale comparisons preserve the current trip. Day-specific rest and booking metadata remain intact when switching. These changes and the routing/elevation/language fixes are not deployed.

The next unpublished batch includes a personal pre-trip review on each hiking day (approaches, difficulty/group suitability, conditions), with private notes. Route or date changes require fresh checks; personal reviews never replace current operator/trail information. Reviews persist in drafts, saved trips and JSON backups. Printable/offline itineraries show their status; private notes remain opt-in. Deployment remains batched and requires an explicit publish/deploy request.

## Current unpublished demo batch
Hut choices support moving earlier/later and undoing the last 20 edits in the current session. Calculation can be cancelled, aborting pending route/elevation requests and preserving the previous itinerary. Saved itineraries open directly to review; separate-trip and trip-switch actions protect unsaved work. Shared settings include dates, group size and daily limits, and long itineraries have a Save trip action in their overview. Metadata follows hut visits during reorder/insert operations, with changed date/route contexts prompting rechecks. Offline itineraries include descent, provider and group information. The retained regional catalogue remains partial after a timed-out live refresh.

Run `node --test tests/itinerary.test.cjs tests/ors.test.cjs tests/review.test.cjs tests/hut-info.test.cjs tests/trip-export.test.cjs`, then `node tests/ui.browser.cjs`, `node tests/provider.browser.cjs`, and `node tests/journeys.browser.cjs`. Browser tests use local source/provider fixtures; they do not establish live source readiness. These changes are queued with the other pending features and remain unpublished.

## Pending user-feedback fixes
Reset trip plan clears all selected and calculated huts at once, retaining saved trips. Daily ascent is a statistic without a configurable maximum. Optional limits/preferences offer Any, including daily distance/time and maximum recorded difficulty. Any difficulty removes the recorded SAC cap and can admit demanding alpine trails; it does not establish suitability or verified conditions, and mapped access/via-ferrata exclusions remain in place. Required dates, group counts and hut/provider selections still identify the actual trip. Null optional preferences persist in saved trips and backups. Run `node tests/preferences.browser.cjs` and `node --test tests/any.test.cjs` for these changes. This batch is not deployed.

Catalogue updates: download a bounded Overpass JSON response, then run `node scripts/import-overpass-catalogue.cjs RAW_JSON RETRIEVED_AT [OUTPUT]`. The import validates coordinates and identities, records the raw-source hash and retrieval timestamp, preserves retained huts absent from the response, and replaces the output atomically. Empty or incomplete responses leave the catalogue unchanged. Source refreshes do not establish complete inventory or current operation. Newly discovered ORS hut lookups cache for one hour; source failures preserve the trip.

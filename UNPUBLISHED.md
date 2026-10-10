# Published batch — 2026-10-09

Previous live version: commit f0ad73edda3b9bbeea2c7e8712502f18be150584 (numbered map hut selection).

Features included in this release:
- Trip overview with distance, estimated time/ascent, dates and hiking/rest-day counts.
- Missing estimates remain incomplete; trip and day checks flag limits and missing difficulty.
- Day selection highlights its route and card, persists after hover, and works from map clicks.
- Whole-trip map button clears day selection and fits calculated routes and hut centres.

- Hut practical details with source-reported facilities, opening records, contacts and operator/booking links; missing information stays explicit.
- Overnight statuses and notes tied to hut/date/night count, with changed stays requiring reconfirmation.
- Booking summaries, browser drafts and saved trips retain metadata; JSON backup import/export validates and preserves it.

- GPX download with numbered hut waypoints and separate original-geometry tracks for each hiking day; no invented approach connectors.
- Printable/PDF itinerary and standalone offline HTML with dates, estimates, rest days, hut contacts and overnight statuses. Private notes are opt-in; exports use the calculated trip.

Validation: Node itinerary/ORS checks and Playwright browser flow, including map selection, overview/rest-day totals, route hover/details, long-trip save/reload, failure rollback and mobile taps, plus overnight status/notes persistence, reconfirmation and backup round trips; GPX XML parsing/geometry counts, offline HTML, optional notes and print layout.

Deployment policy: build and test locally; publish only when the user says “publish” or “deploy”.

Published to https://traversa-hth-demo.vercel.app at commit f323cb77f7bd1030cb568218b98fbf1f1463073e. The release below is the previous published version. Live catalogue, ORS routing and feature assets returned successfully; feature assets matched the locally tested source. Direct automated browser access to the production host was blocked by the execution environment proxy. The complete local browser flow passed before deployment.

## Pending fixes — not deployed
- ORS selected by default and routing provider visible in the builder and trip overview.
- ORS ascent/descent derive from original elevation vertices if provider totals are absent; all vertex elevations retained for profiles and GPX.
- Elevation fallback preserves ORS time, missing cached estimates trigger recalculation, and existing rest days and booking notes survive.
- Overview includes ascent, descent and elevation range, explicitly partial or unavailable when needed.
- English opening summaries replace source-language descriptions; original records remain expandable, and offline itineraries use English summaries.

## Pending route comparison — not deployed
- Compare the current provider with ORS/mapped trails for the same hiking day.
- Side-by-side distance, time, ascent/descent, difficulty completeness and hut approach gaps.
- Preview current and alternative route geometry on the map, keep the current route or explicitly choose the alternative.
- Failures and cancelled comparisons preserve the itinerary; switching retains rest days and booking notes.
- Comparison uses real provider results and does not promise different trails or verified current conditions.

## Pending personal pre-trip review — not deployed
- Each hiking day has checks for hut approaches, group suitability/difficulty, and current conditions/closures, plus private source and follow-up notes.
- Review records bind to the hiking date, endpoints, provider, difficulty, original route geometry and approach/difficulty gaps. Changed contexts reset displayed checks and retain previous notes.
- Drafts, saved trips and validated JSON backups retain review records. Recalculations and alternative selections preserve records while flagging changed routes for review.
- Overview counts personally checked days. Offline/print itineraries include status and individual checks; private review notes are opt-in, and GPX excludes them.
- Personal tracking does not remove route warnings or claim verified safety or live conditions.
- Validation: core context/backup checks, browser save/reload and alternative-route invalidation, existing trip-building/exports regression checks.

## Pending hut ordering controls — not deployed
- Move any selected hut earlier or later in Choose huts, including the starting hut.
- Map numbers and saved pending hut choices update immediately. Existing calculated routes remain intact until recalculation; review warns when choices differ.
- Controls preserve keyboard focus and are disabled at list boundaries or during calculations.
- Browser validation covers moving both directions, renumbering, draft persistence, pending-route warnings and existing trip flows.

## Pending hut-list undo — not deployed
- Undo the last 20 hut-list edits in the current session: additions, dropdown changes, removals, reorders and map-selection resets.
- Undo updates map numbering and the pending draft without modifying calculated stages, booking records or personal reviews.
- Successful calculation, opening another trip and clearing the calculated trip start a fresh undo history; page reload restores the latest hut draft without old undo history.
- Undo is disabled during calculation and when no edit remains. Browser checks exercise removal/reset/reorder recovery and preservation of the calculated trip.

## Pending route calculation cancellation — not deployed
- Cancel an ongoing multi-leg trip calculation from the builder.
- Abort signals propagate to ORS, mapped-route API and elevation requests; elevation cancellation is not treated as missing elevation data.
- No partial result is committed. Previous calculated stages, stays/reviews, selected huts and undo history are retained; calculation can be retried.
- Browser validation holds an elevation request open, cancels it, verifies preservation and retries successfully; provider/itinerary/export checks remain covered.

## Pending demo completion and integrity fixes — not deployed
- My trips distinguishes calculated itineraries from preference-only plans, with actual distance/dates, group size, self-reported booking counts and personal-review progress. Open trip goes directly to review; empty-state planning uses the current builder.
- Start a separate trip from the builder. Switching/new-trip actions protect changed drafts with keep-working, save-and-continue (when routes match choices), and explicit discard options. Saved trips remain intact.
- Shared dates/group/daily-limit settings are accessible before calculation. Save trip is available at the top of long reviews, with saved/draft status.
- Booking notes and rest days follow individual hut visits during insertion/reordering; repeated visits retain distinct records. Review notes follow matching legs or changed hut approaches, and context checks require review again where needed.
- Formatted elevations (e.g. 2,137 m) filter correctly. Invalid calendar dates, negative imported estimates and invalid approach gaps are rejected. Dialogs have accessible names.
- Offline itineraries include descent, provider and group context; missing totals remain explicit.
- Source information explicitly describes the 46-record partial catalogue. One bounded Overpass refresh attempt returned HTTP 504; retained records were preserved, without claiming complete coverage.
- New browser checks exercise saved-trip summaries, direct opening, duplication, dirty-plan switching, fresh plans, group persistence, deletion cancellation, elevation filters and mobile overflow.

Final persistence/layout fixes: Save trip waits for the saved itinerary and the corresponding browser draft to commit, preventing immediate reload from restoring an older draft. Save controls remain disabled during that operation. Mobile/desktop zoom controls sit below the map-picking toolbar, with a browser check for non-overlapping control bounds.

Final batch verification passed: itinerary/ORS/review/hut-info/export pure checks; the 23-leg UI/save/reload/backup/GPX/offline/print/mobile browser flow; provider comparison/cancellation/elevation fallback/review persistence; saved-trip direct opening, safe switching, group-size persistence, source/elevation filters and mobile map-control spacing. Source hashes and validation are recorded in work/batch-ready.json. No deployment or GitHub main update was performed for this batch.

## Batch published — 2026-10-09
All pending features above were published to https://traversa-hth-demo.vercel.app. Commit a14f0892aed73e4dd9d1a0b2cb7160969e737f8e; deployment dpl_GagWmh4EXZsXitAyhuD6fF2SZpJW is READY. New UI assets match tested source; catalogue and live ORS routing returned HTTP 200, with ascent/descent and aligned elevation points. Full browser flows passed locally. Catalogue coverage remains partial at 46 retained huts. No further batch is pending.

## New pending feedback fixes — not deployed
- Reset trip plan is visible in the shared builder/review controls and clears every chosen hut, calculated stage, map number and active draft in one action. Saved trips are retained; cleared drafts commit before the reset completes.
- Daily ascent has no UI maximum or trip-limit warning. Route ascent/descent estimates remain in overview and exports.
- Daily distance/time support explicit Any checkboxes. Optional brief preferences include Any for experience, fitness, terrain, accommodation and scenery; blank optional distance/time/budget values represent Any.
- Maximum recorded difficulty includes Any in local mapped routing, mapped API routing and ORS normalization. Existing access and via-ferrata exclusions in the mapped provider remain; incomplete metadata remains disclosed.
- Catalogue filters expose Any labels; required trip identity/date/group/hut/provider fields retain concrete values.
- Any values and selected recorded difficulty persist in drafts/saved trips and are accepted by JSON backup validation. Legacy numeric preferences remain supported.

### Pending catalogue reliability batch
- Live refresh merges source records with retained huts instead of replacing the inventory. Invalid identities and out-of-region coordinates are excluded.
- Added offline bounded Overpass importer with node/way/relation support, retrieval evidence, SHA-256 source hashes, atomic writes, and preservation of existing records. Empty/incomplete inputs fail without overwriting the catalogue.
- Legacy XML importer preserves existing huts and refuses to overwrite after total source failure.
- ORS verifies newly discovered OSM hut IDs server-side before routing, using fixed source endpoints and a bounded one-hour cache.
- Tests: catalogue normalization, partial/duplicate imports, incomplete source rejection, new-hut lookup/cache, plus ORS/Any/itinerary regression suites passed. No new inventory claims: retained catalogue remains 46 huts. Not deployed.

## Feedback and catalogue batch published — 2026-10-09
Published commit d216d341169552f129c2c4205650ab41546246de; production deployment dpl_CdX2FMdi3UwwVmQxrTGCG2DkLD8J is READY at https://traversa-hth-demo.vercel.app. All 31 unit tests and four browser suites passed before release. Published feature assets match tested source. Live catalogue (46 huts), destination subset (4 huts), ORS configuration and real ORS route returned HTTP 200; invalid destination and repeated-hut requests returned expected HTTP 400. Real ORS leg includes 134 m ascent, 7 m descent and 43 aligned elevation points. Runtime logs contain DEP0169 url.parse() deprecation warnings, with no failed requests in the smoke checks. No url.parse call exists in application source; warning appears to originate in the platform request wrapper. Direct live browser testing remains limited by the environment proxy; full browser flows passed locally. No feature changes remain pending.

## Pending expanded catalogue batch — 2026-10-09
- Successful bounded Overpass response: 296 named alpine-hut records (267 ways, 28 nodes, 1 relation); all 46 prior records present, 250 additional records. Cortina subset has 55 records.
- Raw response SHA-256, bytes, retrieval timestamp and OSM base timestamp retained as provenance. Raw source remains in work/catalogue-refresh/overpass.json and is not deployed. No complete-inventory claim.
- Four nearby same-name pairs flagged as possible duplicates; source identities preserved and hut details explain the uncertainty.
- Coverage information reflects the loaded destination count and source type; browser regression checks derive catalogue size from the fixture.
- Added verification for duplicate detection, expanded-ID ORS request acceptance and bounded destination API output. ORS test uses mocked provider geometry; it does not verify a new real walking connection.
- Not deployed: live production still contains the previous 46-record snapshot.
- Verification: unit suites and all four browser suites passed with the 296-record snapshot. A read-only live request for Paul Preuss → Re Alberto returned HTTP 503 at the new-ID map verification step. No real route was obtained; the pending retained snapshot avoids that extra lookup after deployment. Real new-hut routing remains a post-deployment check.

## Expanded catalogue published — 2026-10-09
Published commit 10b47a09eeb472527a27b7161a3771e9106e8741; production deployment dpl_b2QC99KKLuCYW2JGC7g5K4ZNGTr3 is READY at https://traversa-hth-demo.vercel.app. Live catalogue returned 296 records and Cortina returned 55 (HTTP 200); explorer.js matches the tested source. Real ORS request Paul Preuss → Re Alberto returned HTTP 200: 1175.7 m, 0.5774167 hours, 532 m ascent, 18 m descent, and 96 aligned geometry/elevation points. This confirms the previous new-ID verification failure is avoided for retained imported huts. These are provider estimates, not independently verified access or current conditions. Unit suites passed before deployment; all four browser suites passed during batch preparation. No feature changes remain pending.

## Pending hut discovery simplification
- Explore Huts displays eight cards at a time with Show more, instead of listing every record. All matching map markers and selected trip stops remain available.
- Added max reported EUR package price (Any / €50 / €75 / €100 / not recorded) and min straight-line distance (Any / 1 / 3 / 5 / 10 km) from the last selected trip stop. Distance control waits for a selected stop; no walking distance is invented.
- Preserved explicit OSM charge metadata only when amount, EUR currency and overnight package are recorded. One existing record reports €72 half-board, dated 2024-10-10. The UI discloses price coverage, age/package uncertainty and exclusion of unknown prices under caps.
- Checking Any hides daily distance/time number inputs; unchecking restores them. Nullable preferences still save/reload.
- Unit tests and browser regression checks passed for price extraction/filtering, pagination, selected-stop preservation, mobile layout and existing flows. Focused minimum-distance and Any hide/show checks rerun after final assertions. Not deployed.

### Filter usability follow-up — 2026-10-10
- Active filter chips can be removed individually, including search; Reset hut filters clears every hut filter and restores the eight-card view without clearing the trip.
- More filters indicates the number of active price/distance settings.
- Recorded price, package and source date appear directly on hut cards. Unknown prices remain uninferred.
- Browser checks cover card price disclosures, active count, individual removal, empty-result reset and preserved numbered trip stops. This remains part of the unpublished hut discovery batch.

### Street-map option — 2026-10-10
- Added Streets using Esri World Street Map alongside existing Topographic and Satellite styles. Provider attribution remains visible; no new API key is needed.
- Layer controls expose selected state with aria-pressed; stale tile events cannot show errors for the previous layer. Map viewport, hut markers and route overlays are retained when switching.
- Verification includes a street-map preview rendered from 25 real provider tiles, desktop/mobile control layout and the full UI regression flow. Still unpublished.

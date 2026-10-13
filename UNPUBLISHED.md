# Current publication candidate — 2026-10-13

- Saved coverage: 65 huts / 419 rates; 188 of 296 catalogue records have direct website links. All 296 have review attempts. Remaining statuses: 100 need review, 108 missing verified websites, 22 without readable tariffs and 1 without overnight accommodation. Attempts are not price verifications.
- Latest batches add Berti's nine member/room/board rates, Cavallera's nine hut/tent rates, Fuciade's ten 2026 date-band rates and Plose's four 2026–27 multi-night offers.
- Multi-night prices remain per-person stay totals with explicit four/seven-night durations. The €1,000 seven-night offer is stored unchanged. Totals are neither divided into nightly rates nor matched by nightly/daily budget caps. The ambiguous spring offer remains unresolved.
- Added matching operator websites for Gardeccia, Pisciadù, Passo delle Selle and Rittner Horn; their unverified tariffs remain explicitly flagged. Preserved source-specific 403, missing-rate, inconsistent translation and unclear-unit findings rather than inferring prices.
- New API/schema and browser coverage verifies package duration, unchanged totals and exclusion of even inexpensive multi-night totals from nightly caps. Full trip and price adapter regressions are included in the publication checks.
- Not deployed. A fresh publication requires the user's approval under the agreed batch-release workflow.

# Additional unpublished tariff batch — 2026-10-13

- Added 24 rates across Torre di Pisa, Resciesa, Stöffl, Klausner and Vallaccia. Coverage is now 61 huts / 387 rates, with 105 needing further review, 112 missing verified operator websites, 17 without readable tariffs and 1 without overnight accommodation.
- Preserved per-person double-room prices, Alpine Club eligibility, four-night minimum for Stöffl's longer-stay prices, included linen/showers and separately charged extras. Years remain unknown where not explicitly published.
- Stöffl's overlapping free/discount eligibility at age three is flagged in notes; no zero rate inferred. Percentage discounts remain uncalculated.
- Removed unrelated Facebook-domain search candidates from the two Facebook-only records. The review report now matches the updated queue.
- Pure suites and reviewed-price browser regression passed. Not deployed.

# Current unpublished price-review batch — 2026-10-13

- Finished the catalogue-wide source-search pass: all 296 retained records attempted, with 56 huts / 363 accommodation rates saved. This is not complete price verification: 110 need review, 112 lack a verified operator website, 17 inspected sources lack readable tariffs, and 1 explicitly has no sleeping facilities.
- Added 30 huts / 228 rates beyond the previous 26-hut batch. Preserved all readable accommodation packages, member/age/occupancy conditions, seasonal labels and original units; ambiguous offers remain in notes or the follow-up queue.
- Visually verified operator-linked 2026 PDFs for Locatelli and Cima d'Asta. Retained Marmolada's 28 published seasonal entries without inventing blank winter bed-only prices. Scarpa keeps 23 seasonal rates and explicit warnings about conflicting summer child eligibility.
- Added 23 direct operator links (184 of 296 records now have a direct link) and replaced two domains returning unrelated content: Dibaita and Passo Principe. Website identity does not verify prices or availability.
- Saved review coverage and per-hut findings in agents/hut-price-review/review-2026-10-13.json; queue retains deeper tariff candidates and next actions. Monthly due date 13 November 2026; review starts through chat, with no hosted AI service or automatic schedule.
- All 48 pure assertions and the reviewed-price browser regression passed. Browser checks include large seasonal tables, group eligibility, price filters, no external fetch for reviewed prices, overdue labels and mobile layout. No deployment performed.

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

## Hut discovery and Streets batch published — 2026-10-10
Published commit af6abf03a870c517bbb27308f296e9d5245563a9; production deployment dpl_DT58ZUN99CiHoKCQwV68DhoaN3kx is READY at https://traversa-hth-demo.vercel.app. Live index, app, explorer, itinerary and style assets exactly match tested source. Catalogue returned 296 hut records and one explicit dated price. Real ORS Cinque Torri → Scoiattoli request returned HTTP 200 with distance, time, 134 m ascent and 7 m descent. All unit suites passed before release; four browser suites passed during preparation, with the full UI suite and real-tile street-map/mobile preview repeated after adding the map style. Direct production browser access remains constrained by the execution environment proxy; production HTTP/assets/API checks passed. No feature changes remain pending.

## Pending reported filter and website fixes — 2026-10-10
- Minimum distance is selectable before trip selection. Distance from offers a reference hut; a missing reference is disclosed rather than disabling the filter. Last selected trip hut remains the default when available.
- Price caps include unknown-price huts by default, visibly mark unknown prices and explain that they may exceed the budget. Optional checkbox excludes unknown prices for strict recorded-price filtering.
- Restored bare-domain source URLs and valid contact URLs. Added three reviewed operator links (Galassi, Biella, Tre Scarperi), with dated primary-source evidence retained separately. Direct website coverage is 152/296 records. Missing direct links offer website search, without claiming to be verified operator URLs.
- Unit suites (36 assertions before reviewed-link additions) and all four browser suites passed, including editable distance before trip selection, reference-hut filtering, price inclusion/exclusion, website search, selected-trip preservation and mobile layout. Not deployed.

### Automatic on-open operator pricing — 2026-10-10
- Hut opening checks /api/hut-prices by indexed hut ID; no client-provided fetch URLs. Initial fixed-source adapters cover Galassi and Biella. Unsupported operators are disclosed.
- User selected all packages, no default. Display retains package, eligibility, per-person/night unit, rate year and checked timestamp. Budget matches any listed rate and discloses discounted/package differences.
- Successful checks cached for six hours (CDN plus IndexedDB). Failed refreshes keep earlier rates and show outdated status; dialog close/switch cancels requests and stale results cannot overwrite another hut.
- 2026 rates are not labelled as confirmed 2027 trip rates; unknown rate years remain explicit. Availability is not checked.
- Source content reviewed via operator pages; parser/HTTP contracts tested using representative table fixtures. Live extraction has not been tested in Vercel yet. Direct Nuvolau HTML access returned HTTP 403; no bypass or guessed rate was used.
- Pure suites and automatic-price/UI/preferences browser checks passed; saved-trip/provider regressions also run. This remains in the unpublished batch, including earlier distance, unknown-price and website fixes.

### Cinque Torri automatic price coverage — 2026-10-10
- Added fixed-source Cinque Torri accommodation adapter using https://www.rifugio5torri.it/en/rooms.html. Fresh page explicitly labels 2026 season; older search snippets label 2025. Runtime extraction uses the page's explicit rate-year heading, never booking-year mentions or copyright.
- Preserves four standard packages: private-room half-board / B&B and shared-dormitory half-board / B&B. No default selected; extras and child-discount amounts are not treated as overnight packages.
- Rejects missing room/package prices, duplicate sections and conflicting or missing rate-year headings. Tests use a reviewed representative page section, with extras and unrelated years included.
- Averau and Scoiattoli public accommodation pages reviewed but no reliably readable overnight price list found. Nuvolau readable listino exposes tourist tax rather than overnight amounts; left unsupported rather than guessing.
- All pure suites passed. Live operator extraction still needs verification at the next explicitly requested batch deployment. Not published.

## Filter, website and automatic pricing batch published — 2026-10-10
Production deployment dpl_6HUsurkYuxGk2nimVsPXu7jKR22j is READY at https://traversa-hth-demo.vercel.app. GitHub commit 5163821c0314ee9a91d9ab4c4a15fbe8ee03ea60, tree 57c5350b6221526e9102b9aa99085b9c59786948.
Live index, explorer, styles and pricing script exactly match tested source. Cortina catalogue returned 55 records. All three operator extraction requests returned HTTP 200: Cinque Torri four packages (2026), Galassi six packages (2026, actual live nonmember rates 70/35), Biella one package (year not stated). Unsupported operator returns 200/unsupported; invalid ID returns 400. Real ORS Cinque Torri to Scoiattoli returned HTTP 200 with geometry, time and elevation metrics.
All eight pure-suite files passed, automatic-price browser flow and full UI regression passed. Browser checks use local rendering and fixtures; production verified via HTTP/assets/API because direct production browser access is constrained by the environment proxy. Runtime error-level scan showed only existing Node DEP0169 url.parse deprecation warnings, with no application exception in inspected records. No feature changes remain pending.

## Pending price and website coverage expansion — 2026-10-10
- Added Tre Scarperi fixed-source adapter for https://www.drei-schuster-huette.com/it/prezzi-prenotazione-online.php. Preserves all 20 listed age/membership accommodation rates: two free-under-four entries plus 18 half-board room/group rates. Rate year remains unknown because the price table does not state one.
- Budget help now explicitly discloses age as well as membership discounts. No package is chosen by default. Zero-price accommodation is accepted by client validation without treating cancellation charges as accommodation.
- Adapter rejects missing prices, unknown room labels, changed age/member headings and duplicate entries; it requires the complete table. Tests use a representative reviewed source section; live extraction needs verification at the next requested deployment.
- Added Carducci operator website and Antelao's official CAI owner hut page, each with dated primary-source provenance. Retained catalogue has 154 direct links across 296 records, still partial.
- Lagazuoi rates researched but not imported yet: seasonal columns and mixed per-room/per-person units require separate budget handling. Lavarella starting prices likewise require explicit from-price support.
- All eight pure-suite files and pricing browser test passed, including 20 displayed rates, free child rate, eligibility disclosures, budget matching, no default package and mobile layout. Not deployed.

### Lagazuoi seasonal and room pricing — 2026-10-10
- Added fixed-source Lagazuoi accommodation adapter: https://rifugiolagazuoi.com/EN/p2-Overnight-stay-at-Rifugio-Lagazuoi. Displays all 14 room/season accommodation entries: seven B&B options across Summer 2026 and Winter 2027. Each rate carries its own published season and year; no single rate year or package is chosen.
- Preserves explicitly per-person dormitory prices and per-room private-room totals. Does not divide room prices by assumed occupancy. Dinner, sauna, luggage transport, tourist tax and New Year's dinner are excluded from accommodation rates and disclosed as separate extras.
- Per-person price cap compares only explicit per-person/night operator accommodation rates; room totals cannot count as per-person prices. Help discloses comparisons across all published seasons and age/member discounts. Rate cards indicate seasonal years; dialog warns to confirm travel-date pricing.
- Parser fails on incomplete seasonal columns, unknown accommodation rows, unavailable prices and conflicting duplicate responsive tables. Identical desktop/mobile table rates deduplicate. Unit/browser tests use a reviewed representative source section; actual Vercel extraction awaits a requested deployment.
- All eight pure-suite files and pricing browser flow passed, including both seasonal labels, mixed units, extras exclusion, €75/€100 caps and an inexpensive room-only record excluded from per-person caps. This remains unpublished alongside Tre Scarperi pricing and Carducci/Antelao links.
- Full UI regression exposed a test that reloaded before the debounced hut-choice save completed. The test now awaits the in-page debounce and write promise, asserts exactly 24 persisted huts, and then checks reload. Diagnostic instrumentation was removed; no speculative application restoration change is retained. Pricing browser, unit and saved-trip browser checks passed; full UI flow passed with the corrected save wait.

## Pricing coverage batch published — 2026-10-13
Production deployment dpl_7CzVTpxtCP3HcACc5FsHwWbVN4Wi is READY at https://traversa-hth-demo.vercel.app. Commit d468b4ff1b8378188cd3a0361a147f7a9716a8fe. Tre Scarperi live extraction returned HTTP 200 with all 20 rates. ORS Cinque Torri to Scoiattoli returned HTTP 200, 753.7 m, 134 m ascent. Live pricing and explorer scripts match source. Pure suites and pricing browser checks passed; full UI and saved-trip flows passed during preparation.
Known release limitation: Lagazuoi live extraction returned HTTP 503/unavailable, preserving existing prices and advising operator confirmation. The operator page remains readable via public web research, but raw source diagnosis is restricted by cloud network policy (operator domain not allowed); no policy bypass, guessed rate, or unverified parser relaxation used. Needs further source-fetch/parser diagnosis. No claim that Lagazuoi auto-refresh works in production.

## Pending chat-operated monthly price reviewer — 2026-10-13
- Added reusable chat-review instructions, complete 296-hut queue, schema validation, merge CLI and before/after audit history. No separate paid AI runtime, external credentials or automatic scheduler added.
- First primary-source review covers 18 huts: 12 with saved usable rates, 3 needing clarification and 3 inspected pages without readable overnight amounts. Remaining 136 are pending with websites; 142 lack verified direct website links. These are not claimed reviewed.
- Saved rates: Cinque Torri, Galassi, Biella, Tre Scarperi, Lagazuoi, Carducci, Vajolet, Città di Fiume, Lavarella, Puez, Pian di Cengia and Sennes. Biella child/guide discount included; Galassi current nonmember values 70/35 retained. Sennes freshly opened page now publishes 2027 season rather than old indexed 2026 snippets.
- Catalogue/API returns stored reviewed rates before operator fetches. Frontend also loads the snapshot for the local destination and cached catalogues, so budget caps use recorded rates before clicking huts. Lagazuoi reviewed rates now available despite its live-extraction failure. Original checked dates, primary-source links, evidence, next-month due dates and overdue labels retained.
- Starting prices remain explicitly "from"; private-room totals are not divided by guessed occupancy. Per-person/day and per-person/night accommodation can match budget caps. All packages remain visible without choosing a default; discount formulas, fees and extras retained separately as notes.
- Fresh Fanes page omits amounts (old snippets not imported); Auronzo units require clarification; Locatelli PDF columns need complete visual validation. Nuvolau/Averau/Scoiattoli inspected pages do not expose usable overnight rates.
- Unit suites and reviewed-price browser flow passed, including rates before clicks, multiple budget matches, local four-hut destination, stale review labels, source links, membership/age discounts, room units and starting rates. Existing automatic-pricing and full trip UI regression checks also run. Not deployed.

### Cortina monthly-review batch 2 — 2026-10-13
- Processed 25 further catalogue records (operator-page reviews or official-website searches). Added 27 accommodation rates across eight huts: Giussani, Vallandro, Croda da Lago, Fonda Savio, Città di Carpi, Venezia, Fedare and Duca d'Aosta. Saved-price coverage now 20 huts / 116 rates.
- Fresh Vallandro amounts 86/98 for rooms and 71/83 for dormitories replace outdated search snippets. Giussani fresh page omits obsolete indexed COVID surcharges. Historical/unstated rate years remain explicit. Fedare detailed price page conflicts with its cheaper homepage teaser; recorded page values and conflict note retained, not advertised as guaranteed quotes.
- Corrected Città di Carpi's parked .com domain to verified operator .it site, with documented source override. Added verified Langalm and Aquileia websites. Retained catalogue has 156 direct website links; presence alone is not a price verification.
- Langalm operator explicitly states no sleeping facilities. Added visible no-overnight label/detail notice; excluded from accommodation price filters but kept for map/trail exploration. No zero overnight price invented.
- Public unresolved findings now accompany catalogue and local snapshot; inspected accommodation pages without readable amounts show Contact hut for prices. Blocked/dynamic pages and missing operator websites remain clearly distinguished in the review queue.
- Added range schema/validation and display for Duca d'Aosta's published 140–150 EUR/person half-board range. Both bounds retained; budget help discloses range/starting-price limits. No default package selected.
- Queue now has 43 attempted records: 20 with saved rates, 8 needing review, 8 with no readable prices, 1 without overnight accommodation, and 6 searched records still missing operator websites. 253 records await a first review. No claim of 43 price-verified huts.
- 48 pure assertions and reviewed-price browser flow passed, including corrected website, Langalm notice and displayed price range. Full trip UI regression also run. Still unpublished, including the previous chat-operated reviewer batch.

### Cortina and nearby-route review batch 3 — 2026-10-13
- Processed another 25 records with primary-site inspection or operator-site research. Added 19 original rate entries for Staulanza, Fodara Vedla, Scotter-Palatini, Vandelli, Ahner Berghof and Stiendlalm. Stored coverage now 26 huts / 135 rates.
- Staulanza's four room types retain from-price labels. Scotter retains provided-linen versus own-bag accommodation rates without computing B&B totals. Vandelli 2026 rate year is separate from its 2027 opening notice. Fodara's only readable dormitory amount is stored with explicit partial-coverage notes; other room/child tariffs are not invented.
- Stiendlalm's four seasonal whole-hut rental amounts retain per-hut/night units, published date bands, minimum three/seven-night stays and separate cleaning/pet/tax fees. No division by occupancy; per-person cap excludes whole-hut totals. Added this unit to record validation.
- Added five verified website links: Bosi, Piezza/Da Aurelio, Sasso Bianco, Vandelli and Fertazza. Source dates/provenance preserved. Palafavera starting values remain unresolved because price units are unclear. Sasso Bianco operator notice of ended summer-2026 management retained as a review reason, not treated as next-season availability.
- Total queue: 68 attempted, 228 untouched. 26 have saved rates; 13 need review, 14 inspected pages have no readable tariffs, 1 explicitly lacks overnight accommodation; 14 website searches remain unresolved. Review attempts are not all price verifications.
- Pure suites passed; reviewed-price browser flow checks new whole-hut units, fees/minimum-stay notes and exclusion of cheap whole-hut totals from per-person caps. This and previous reviewer batches remain unpublished.

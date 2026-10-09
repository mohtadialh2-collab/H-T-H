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

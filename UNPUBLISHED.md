# Batched release

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

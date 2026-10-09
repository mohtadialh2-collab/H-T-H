# Traversa / H-T-H

Working exploration and trip-brief demo for the Cinque Torri–Scoiattoli–Averau–Nuvolau group in the Dolomites. Serve `demo/` as a static website; no build or API credentials are required.

Features: interactive topographic/satellite Leaflet map, four hut information panels, three-step trip planner, IndexedDB draft and trip storage, editing, duplication, deletion with confirmation, versioned JSON export and validated import-as-copy, responsive layout.

This is a new demo rebuilt from the previous chat transcript, not a recovered copy of the original Next.js application. Marker positions are approximate orientation points and reported elevations are contextual hut information, not route measurements. Basemap trails are not a verified Traversa network. No hiking routes, AI itineraries or accommodation bookings are generated. Verified hut approach geometry remains a prerequisite for real routing. No secrets are collected. Browser-local trip data does not sync between devices; export backups.

The static demo has no application password gate. Vercel's deployment protection is preserved. Future full application work should restore the requested Next.js/TypeScript/MapLibre/Dexie architecture, password authentication, deterministic route validation and server-only providers. The demo is not Phase 1 completion.

Deployment: upload the files in `demo/` to Vercel with framework, build command and install command unset. Target the demo project, not unrelated existing deployments.

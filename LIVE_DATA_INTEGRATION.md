# GLIS — Live Data Integration Guide

## What was added

1. **`live_data_service.py`** (new backend module) — connects to real
   external APIs: data.gov.in (population), Bhuvan/NRSC (LULC, stubbed),
   NASA FIRMS (fire hotspots), OpenStreetMap Overpass (boundaries).
   Every function returns `None` on any failure so the server can fall
   back safely.

2. **`server.py`** — three new GET routes:
   - `/api/live/status` — which sources are configured
   - `/api/live/state?name=<state>` — live population + LULC for one state
   - `/api/live/fires` — live NASA FIRMS fire hotspots for India

3. **`js/liveDataEngine.js`** (new frontend engine) — calls the routes
   above, merges live data over the local `stateDatabase`, and exposes
   `renderSourceBadge()` so the UI can show a "● LIVE" / "○ STATIC" tag
   next to any number.

4. **`js/environmentalEngine.js`** — `fireHotspots` can now be replaced
   with real NASA FIRMS data via `refreshLiveFireHotspots()`.

## Why it's safe

Nothing was deleted. `stateDatabase`, `resourceDatabase`, and the static
`fireHotspots` array all still exist and load exactly as before. The
live engine only *overrides* values when a real fetch succeeds. If you
never add any API keys, the portal behaves exactly like today.

## How to activate it

1. Register for free API keys (see `.env.example`):
   - NASA FIRMS is instant — https://firms.modaps.eosdis.nasa.gov/api/
   - data.gov.in — https://api.data.gov.in (find the current population
     dataset's `resource_id` on the site and set
     `DATA_GOV_IN_POPULATION_RESOURCE_ID`)
   - Bhuvan requires NRSC registration and is left as a `TODO` stub
     because it returns raster tiles, not ready-made percentages.

2. Set the environment variables before launching `server.py`
   (see the bottom of `.env.example` for PowerShell syntax).

3. Restart the server. Visit `http://localhost:8000/api/live/status`
   to confirm which sources are active.

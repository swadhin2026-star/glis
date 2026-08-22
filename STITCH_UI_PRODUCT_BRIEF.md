# India Land Information Portal

## 1. Product Summary

India Land Information Portal is a lightweight web app for discovering and exploring Indian land, GIS, satellite, population, land-record, and modeling resources. The current implementation is a single static HTML page with inline CSS and JavaScript. It is an exploratory prototype, not yet a connected government-data platform.

The product has two related jobs:

1. Let a user search for an Indian state and inspect a compact state profile.
2. Give GIS learners, analysts, researchers, and planners one organized place to open trusted external data sources and tools.

Recommended product positioning for Stitch: **a practical GIS resource cockpit for India**, combining state discovery with a curated resource library.

## 2. Existing App Behavior

### Entry point

- File: `land.html`
- Runtime: static browser page; no backend, build system, or framework.
- External runtime dependency: Leaflet 1.9.4 CSS and JavaScript from `unpkg.com`.
- Map tiles: OpenStreetMap tile service.
- Data: hard-coded JavaScript object containing 30 Indian state records.

### Current user flow

1. User lands on the hero section.
2. User types a state name into the search field.
3. Autocomplete suggestions appear for partial matches.
4. User selects a suggestion or presses Search/Enter.
5. The page smoothly scrolls to Information.
6. State title, description, population, area, district count, capital, land-use bars, district list, and map are updated.
7. The map centers on the state and draws a 70 km orange circle with a popup.
8. Navigation anchors jump to Home, Information, Map, and About.

### Current limitations to expose in the new UI

- Empty initial state: the page does not show a selected state until a search succeeds.
- Invalid or blank searches use browser `alert()` dialogs.
- Districts are display-only; they are not clickable.
- Land-use percentages are illustrative hard-coded values and need source/year labels.
- The map shows a center circle, not an official state boundary or data layer.
- Resource downloads are not connected to the UI. The Python script saves offline HTML snapshots and a ZIP archive.
- There is no loading, retry, source freshness, attribution, or download-progress experience.
- Downloaded pages can fail or be blocked; the manifest should be treated as the source of truth for availability.

## 3. Users and Core Jobs

### Primary users

- GIS students learning where to find Indian datasets.
- Remote-sensing and land-use analysts.
- Researchers comparing state-level demographic and geographic context.
- Government, planning, and land-record users needing a starting directory.
- Python/ML practitioners looking for geospatial modeling tools.

### Core jobs to support

- Find a state quickly.
- Understand state context at a glance.
- Inspect land-use composition and administrative coverage.
- Locate a relevant data source by topic.
- Open the official source in a new tab.
- See whether a source is available, blocked, stale, or requires an account/API key.
- Move from national discovery to state and district detail without losing context.

## 4. Information Architecture / Screens

The current app has one page with anchored sections. For Stitch, model these as screens or responsive states so the design can be implemented cleanly.

### Page 1: Explorer Home / Dashboard

**Purpose:** Orient the user and provide the two primary entry points: state search and resource discovery.

**Required components:**

- Sticky header with India Land Portal brand.
- Primary navigation: Explorer, Resources, Map, About.
- Global search field with state/resource autocomplete.
- Search button and keyboard-submit behavior.
- Hero heading, short value proposition, and trust note.
- Quick-stat strip: states covered, resource groups, districts represented, source types.
- Featured resource category cards.
- “Start with a state” prompt with popular/recent state chips.
- Empty, loading, no-match, and error states.

**Interactions:** Search-as-you-type suggestions grouped by States and Resources; selecting a state opens State Overview; selecting a resource opens Resource Detail; category cards open a filtered Resource Library.

**Responsive requirements:** Desktop uses a two-column hero with prominent search and a compact India/map visual. Mobile stacks the hero, uses a full-width search, and keeps category chips horizontally scrollable.

### Page 2: State Overview

**Purpose:** Give a fast, trustworthy state profile after a state is selected.

**Required components:**

- Breadcrumb: Explorer / State name.
- State title, description, capital, and source/year metadata.
- Metric cards: population, area, district count, capital.
- Land-use composition visualization with legend for agriculture, forest, built-up, water, barren.
- Percentage bars or chart with accessible text values.
- Related resources filtered to the selected state/topic.
- District list with search/filter and district count.
- “Open map” and “View resources” actions.
- Data disclaimer and source links.

**Interactions:** Change state from persistent search; filter districts; click a district to open District Detail or focus the map; expand source/methodology details.

**States:** initial no-state, populated, source unavailable, stale data, and mobile stacked layout.

### Page 3: Interactive Map

**Purpose:** Explore geographic context and layers for India, a state, or a district.

**Required components:** Full-width Leaflet map canvas; search/location control; zoom and reset-to-India controls; layer switcher for base map, boundaries, land cover, elevation, population, and nighttime lights; legend; selected-area popup; selected-area summary panel; map loading, tile failure, no-layer, and attribution states.

**Interactions:** Selecting a state updates overview context; switching layers updates legend and metadata; clicking a district opens detail; mobile controls must not cover attribution or the selected-area sheet.

**Implementation note:** The current app only uses a center point plus a 70 km circle. A production design must make clear that official boundary geometry and actual data layers are future integrations.

### Page 4: Resource Library

**Purpose:** Browse the downloaded and curated GIS resources by topic.

**Required components:** Library header with total count and last crawl date; search by name/provider/topic; category tabs; resource cards; sort control; status badges for Available, Needs account, API required, Blocked, Snapshot only; pagination or virtualization; empty and blocked/offline states.

**Interactions:** Filter by five categories; open Resource Detail; open official source in a new tab; open local snapshot; copy URL; optionally download local archive.

### Page 5: Resource Detail

**Purpose:** Help the user decide whether and how to use one external source.

**Required components:** Resource name, provider, category, purpose, official-source action, local-snapshot/copy/favorite actions, access requirements, coverage, format, temporal range, update cadence, license/attribution, how-to steps, related resources, crawl availability panel, and disclaimer.

**States:** official page available, local snapshot available, both unavailable, external site offline, and unsupported browser.

### Page 6: About / Methodology

**Purpose:** Explain scope, provenance, limitations, and verification.

**Required components:** Product mission; source families; collection/download methodology; timestamp and manifest link; distinction between official data and portal summaries; attribution list; contact/feedback; version/changelog.

## 5. Resource Catalog

### 01 Satellite Imagery (12)

Copernicus Data Space; Copernicus Browser; Sentinel-2 Dataset Docs; Google Earth Engine; GEE Python API Docs; ESA WorldCover Viewer; ESA WorldCover Data Access; ESA WorldCover AWS; Bhuvan; Bhuvan Thematic LULC; Bhuvan Free Satellite Data; Google Dynamic World.

### 02 Elevation, Roads, Boundaries (6)

SRTM DEM GEE; OpenStreetMap; Overpass API; Overpass Turbo; GADM; Survey of India.

### 03 Population, Socioeconomic (5)

Census of India; Census Data Portal; WorldPop; NOAA VIIRS Nighttime Lights; VIIRS GEE.

### 04 Land Records (3)

DILRMP; Bhoomi Karnataka; Data.gov.in.

### 05 Modeling Tools (6)

Segmentation Models PyTorch; PyTorch; Scikit-learn; Rasterio; GeoPandas; GEE Python API.

Total catalog entries: **32 rows in the Python source**, with GEE Python API appearing in two categories. The downloaded manifest contains 32 rows.

## 6. Content and Data Requirements

### State record schema

Each state needs: `name`, `capital`, `population` with unit/year/source, `area` with unit/source, `districtCount`, `description`, `landUse` values for agriculture/forest/built-up/water/barren, `landUseYear`, `landUseSource`, stable district IDs, `mapCenter`, `zoom`, and official boundary geometry or URL when integrated.

### Resource record schema

Each resource needs: stable ID, display name, category, topic tags, provider, official URL, local snapshot path, access type, account/API requirements, coverage, format, last checked timestamp, crawl status, failure reason, license, attribution, description, and recommended use.

### Accuracy rules

- Never present illustrative land-use percentages as official without a source and year.
- Always show “last checked” for external URLs.
- Separate official source content from portal-generated summaries.
- Treat blocked pages as unavailable, not successful downloads.
- Preserve attribution near every map layer and external link.

## 7. Python Downloader Requirements

### Purpose

`download_all_32.py` fetches each official resource URL as HTML, stores it under `India_GIS_Resources/<category>/`, writes `DOWNLOAD_MANIFEST.txt`, and creates `India_GIS_Resources.zip`.

### Runtime requirements

- Python 3.10 or newer recommended.
- Virtual environment: `.venv`.
- Dependency: `requests`.
- Network access and valid TLS certificates.
- Write permission in the workspace.

### Usage

```powershell
cd "C:\Users\Lopinti Venketswar\Downloads\land"
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip requests
python .\download_all_32.py
```

### Output contract

- `India_GIS_Resources\\<category>\\<resource>.html`
- `India_GIS_Resources\\DOWNLOAD_MANIFEST.txt`
- `India_GIS_Resources.zip`

### Operational improvements required before production

- Add retries with backoff for 429/5xx responses.
- Add per-request status and timestamps to the manifest.
- Use configurable timeout and optional proxy.
- Keep TLS verification enabled by default.
- Store content type, final URL, checksum, and response code.
- Avoid replacing failed downloads with misleading HTML success pages.
- Add dry-run, incremental caching, and UI-visible retry status.

## 8. Stitch Design Direction

Design a confident research tool, not a generic marketing landing page. Use a warm off-white canvas, deep ink text, orange as the action accent, and restrained greens/blues for geography and data layers. Keep information dense but calm: compact headers, strong section labels, clear provenance, and map-first moments.

### Visual language

- Typography: expressive editorial display face for headings paired with a highly legible sans-serif for data and controls.
- Palette: ink `#182230`, orange `#F26B21`, leaf green `#3D7A58`, map blue `#2C6E9E`, warm canvas `#F5F3EE`, white surfaces, muted borders.
- Geometry: 8 px or less for cards and controls; use larger radius only for the map shell or hero composition.
- Icons: familiar line icons for search, map, layers, external link, copy, download, filter, and info.
- Motion: short page-load reveal, autocomplete transition, map selection transition, and progress-bar fill. Respect reduced motion.
- Accessibility: keyboard navigation, visible focus, color-independent status labels, map alternative summary, semantic headings, and WCAG AA contrast.

### Stitch prompt seed

“Design a desktop and mobile GIS research cockpit called India Land Information Portal. The primary workflow is searching an Indian state and then reviewing population, area, district count, capital, land-use composition, an interactive map, districts, and trusted external GIS resources. Use a warm off-white canvas, ink typography, vivid orange action accents, restrained leaf green and map blue, editorial display headings with a readable sans-serif data UI, compact information-dense layouts, source/year metadata, status badges, strong keyboard-accessible search, and a real map-centered experience. Create screens for Explorer Home, State Overview, Interactive Map, Resource Library, Resource Detail, and About/Methodology. Include loading, empty, no-match, blocked-source, and mobile states. Avoid generic SaaS cards, purple gradients, and marketing-only hero content.”

## 9. Acceptance Checklist

- A user can search a state with keyboard and autocomplete.
- A selected state updates all profile metrics consistently.
- Map, land-use values, district list, and sources identify provenance.
- A user can browse all five resource categories.
- Each resource exposes official URL, local snapshot status, and access requirements.
- Failed downloads are visible and actionable.
- Desktop and mobile layouts keep controls usable without overlap.
- The UI distinguishes prototype/sample data from verified official data.
- The downloader runs from a fresh virtual environment and produces a manifest and ZIP.
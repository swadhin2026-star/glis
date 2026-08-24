"""
GLIS Live Data Service
=======================
Fetches REAL data from external government / open APIs to replace the
hardcoded values in js/stateData.js and js/environmentalEngine.js.

DESIGN PRINCIPLE — "Fetch live, fall back safe":
Every function here tries a live network call first. If the API key is
missing, the network fails, or the response is malformed, it returns
None so the caller (server.py) can fall back to the existing hardcoded
data. This means the portal NEVER breaks even if an external API is
down or a key hasn't been configured yet.

Configure API keys via environment variables (see .env.example):
  DATA_GOV_IN_API_KEY   -> https://api.data.gov.in (population/census datasets)
  BHUVAN_API_KEY        -> https://bhuvan-app1.nrsc.gov.in (LULC layers, needs NRSC registration)
  NASA_FIRMS_MAP_KEY    -> https://firms.modaps.eosdis.nasa.gov/api/  (free, instant signup)

APIs used here that need NO key at all:
  - Overpass API (OpenStreetMap) for district/boundary/road queries
  - Open-Meteo for weather/climate context (bonus, optional)
"""

import os
import json
import time
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CACHE_DIR = BASE_DIR / "data" / "live_cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

CACHE_TTL_SECONDS = 6 * 60 * 60  # 6 hours — external govt data doesn't change hourly

# ------------------------------------------------------------------
# API keys (set these as real environment variables before starting
# server.py, e.g. in PowerShell:  $env:NASA_FIRMS_MAP_KEY="your_key")
# ------------------------------------------------------------------
DATA_GOV_IN_API_KEY = os.environ.get("DATA_GOV_IN_API_KEY", "")
BHUVAN_API_KEY = os.environ.get("BHUVAN_API_KEY", "")
NASA_FIRMS_MAP_KEY = os.environ.get("NASA_FIRMS_MAP_KEY", "")

REQUEST_TIMEOUT = 8  # seconds — fail fast, don't hang the portal


# ==================================================================
# Generic helpers
# ==================================================================

def _cache_path(key):
    safe = "".join(c if c.isalnum() else "_" for c in key)
    return CACHE_DIR / f"{safe}.json"


def _read_cache(key):
    p = _cache_path(key)
    if not p.exists():
        return None
    try:
        payload = json.loads(p.read_text(encoding="utf-8"))
        if time.time() - payload.get("_cached_at", 0) > CACHE_TTL_SECONDS:
            return None
        return payload.get("data")
    except Exception:
        return None


def _write_cache(key, data):
    try:
        p = _cache_path(key)
        p.write_text(json.dumps({"_cached_at": time.time(), "data": data}), encoding="utf-8")
    except Exception:
        pass  # caching is best-effort; never let it break the request


def _http_get_json(url, headers=None):
    """Minimal dependency-free HTTP GET returning parsed JSON, or None on any failure."""
    req = urllib.request.Request(url, headers=headers or {"User-Agent": "GLIS-Portal/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
            if resp.status != 200:
                return None
            return json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError, Exception):
        return None


# ==================================================================
# 1. Population / Census — data.gov.in
# ==================================================================
# data.gov.in publishes many govt datasets as open resources, each with
# its own resource_id. Population-by-state resources change over time;
# the resource_id below is illustrative — swap in the current dataset's
# resource_id from https://data.gov.in once you register for a free key.

DATA_GOV_IN_POPULATION_RESOURCE_ID = os.environ.get(
    "DATA_GOV_IN_POPULATION_RESOURCE_ID", ""
)


def fetch_live_population(state_name):
    """Returns {'population': int, 'source': str, 'year': str} or None."""
    if not DATA_GOV_IN_API_KEY or not DATA_GOV_IN_POPULATION_RESOURCE_ID:
        return None  # not configured -> caller falls back to stateData.js

    cache_key = f"population_{state_name.lower()}"
    cached = _read_cache(cache_key)
    if cached:
        return cached

    url = (
        f"https://api.data.gov.in/resource/{DATA_GOV_IN_POPULATION_RESOURCE_ID}"
        f"?api-key={DATA_GOV_IN_API_KEY}&format=json&limit=1"
        f"&filters[state]={urllib.parse.quote(state_name)}"
    )
    result = _http_get_json(url)
    if not result or not result.get("records"):
        return None

    record = result["records"][0]
    data = {
        "population": record.get("population"),
        "source": "data.gov.in (Ministry of Statistics)",
        "year": record.get("year", "latest"),
    }
    _write_cache(cache_key, data)
    return data


# ==================================================================
# 2. Land Use / Land Cover — Bhuvan (NRSC/ISRO)
# ==================================================================

def fetch_live_lulc(state_name):
    """
    Returns {'agriculture': %, 'forest': %, 'built': %, 'water': %, 'barren': %}
    or None if not configured / unavailable.

    NOTE: Bhuvan's public LULC WMS/WFS endpoints require registration at
    https://bhuvan-app1.nrsc.gov.in and typically return raster tiles or
    shapefiles rather than ready-made percentages — a real integration
    usually means: download the state's LULC raster tile -> compute
    class-pixel percentages server-side with rasterio/numpy. That raster
    processing step is intentionally left as a TODO stub below so you can
    plug in the exact Bhuvan product code you get access to.
    """
    if not BHUVAN_API_KEY:
        return None

    cache_key = f"lulc_{state_name.lower()}"
    cached = _read_cache(cache_key)
    if cached:
        return cached

    # TODO: Replace with real Bhuvan WMS/WFS call + rasterio percentage calc.
    # Left unimplemented deliberately — needs your NRSC-issued product code.
    return None


# ==================================================================
# 3. Forest Fire Hotspots — NASA FIRMS (real-time, free API key)
# ==================================================================

def fetch_live_fire_hotspots(country="IND", days=1):
    """
    Returns a list of live fire hotspot dicts from NASA FIRMS, or None.
    Free key: https://firms.modaps.eosdis.nasa.gov/api/area/
    """
    if not NASA_FIRMS_MAP_KEY:
        return None

    cache_key = f"firms_{country}_{days}"
    cached = _read_cache(cache_key)
    if cached:
        return cached

    # VIIRS 375m near-real-time fire product, country-level CSV endpoint
    url = (
        f"https://firms.modaps.eosdis.nasa.gov/api/country/csv/"
        f"{NASA_FIRMS_MAP_KEY}/VIIRS_SNPP_NRT/{country}/{days}"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "GLIS-Portal/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
            if resp.status != 200:
                return None
            raw_csv = resp.read().decode("utf-8")
    except Exception:
        return None

    lines = raw_csv.strip().split("\n")
    if len(lines) < 2:
        return None

    header = lines[0].split(",")
    hotspots = []
    for line in lines[1:501]:  # cap to 500 rows for payload size
        cols = line.split(",")
        if len(cols) != len(header):
            continue
        row = dict(zip(header, cols))
        try:
            hotspots.append({
                "lat": float(row.get("latitude", 0)),
                "lng": float(row.get("longitude", 0)),
                "brightness": row.get("bright_ti4", "N/A") + " K",
                "confidence": row.get("confidence", "N/A"),
                "detectedTime": row.get("acq_date", "") + " " + row.get("acq_time", ""),
                "severity": "High" if row.get("confidence") in ("h", "high") else "Moderate",
            })
        except (ValueError, TypeError):
            continue

    data = hotspots
    _write_cache(cache_key, data)
    return data


# ==================================================================
# 4. Boundaries / Roads / Districts — OpenStreetMap Overpass (no key needed)
# ==================================================================

OVERPASS_URL = "https://overpass-api.de/api/interpreter"


def fetch_live_district_boundary(district_name, state_name):
    """
    Returns a GeoJSON-like boundary object for a district from OSM, or None.
    No API key required — Overpass is a free public service.
    """
    cache_key = f"osm_boundary_{state_name.lower()}_{district_name.lower()}"
    cached = _read_cache(cache_key)
    if cached:
        return cached

    query = f"""
    [out:json][timeout:{REQUEST_TIMEOUT}];
    relation["boundary"="administrative"]["name"="{district_name}"]["is_in:state"="{state_name}"];
    out geom;
    """
    url = OVERPASS_URL + "?" + urllib.parse.urlencode({"data": query})
    result = _http_get_json(url)
    if not result or not result.get("elements"):
        return None

    _write_cache(cache_key, result)
    return result


# ==================================================================
# 5. Status summary — used by /api/live/status
# ==================================================================

def get_live_sources_status():
    """Reports which live data sources are actually configured & usable."""
    return {
        "population_census": {
            "configured": bool(DATA_GOV_IN_API_KEY and DATA_GOV_IN_POPULATION_RESOURCE_ID),
            "provider": "data.gov.in",
            "requires": "DATA_GOV_IN_API_KEY + DATA_GOV_IN_POPULATION_RESOURCE_ID env vars",
        },
        "land_use_cover": {
            "configured": bool(BHUVAN_API_KEY),
            "provider": "Bhuvan (NRSC/ISRO)",
            "requires": "BHUVAN_API_KEY env var + raster percentage calc (see TODO in fetch_live_lulc)",
        },
        "fire_hotspots": {
            "configured": bool(NASA_FIRMS_MAP_KEY),
            "provider": "NASA FIRMS",
            "requires": "NASA_FIRMS_MAP_KEY env var (free, instant at firms.modaps.eosdis.nasa.gov)",
        },
        "district_boundaries": {
            "configured": True,
            "provider": "OpenStreetMap Overpass API",
            "requires": "None — free public endpoint",
        },
    }

/**
 * India Land Information Portal - Live Data Engine
 * Calls the backend's /api/live/* routes to pull REAL external data.
 * Falls back to the hardcoded stateDatabase / fireHotspots whenever a
 * live source isn't configured or the network call fails — the portal
 * always renders something, it just prefers real data when available.
 */

class LiveDataEngine {
  constructor() {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
    this.apiBase = isLocal ? 'http://127.0.0.1:8000' : window.location.origin;
    this.sourcesStatus = null;
    this._stateCache = {};   // avoid refetching the same state repeatedly
    this._firesCache = null;
  }

  async checkSources() {
    try {
      const res = await fetch(`${this.apiBase}/api/live/status`);
      if (res.ok) {
        this.sourcesStatus = await res.json();
        return this.sourcesStatus;
      }
    } catch (e) {
      console.warn('LiveDataEngine: /api/live/status unreachable', e);
    }
    this.sourcesStatus = { live_data_enabled: false };
    return this.sourcesStatus;
  }

  /**
   * Returns a state object merged from live data + local stateDatabase.
   * Never throws, never returns undefined — always usable by the UI.
   */
  async getStateProfile(stateKey) {
    const localState = stateDatabase[stateKey];
    if (!localState) return null;

    if (this._stateCache[stateKey]) {
      return this._stateCache[stateKey];
    }

    let live = null;
    try {
      const res = await fetch(`${this.apiBase}/api/live/state?name=${encodeURIComponent(localState.name)}`);
      if (res.ok) live = await res.json();
    } catch (e) {
      console.warn(`LiveDataEngine: live fetch failed for ${stateKey}, using local data`, e);
    }

    const merged = { ...localState, _liveMeta: { population: false, lulc: false } };

    if (live && live.population && !live.population_fallback) {
      merged.populationNum = live.population.population;
      merged.population = `${(live.population.population / 10000000).toFixed(2)} Crore`;
      merged._liveMeta.population = true;
      merged.landUseSource = live.population.source || merged.landUseSource;
    }

    if (live && live.lulc && !live.lulc_fallback) {
      merged.land = live.lulc;
      merged._liveMeta.lulc = true;
    }

    this._stateCache[stateKey] = merged;
    return merged;
  }

  /**
   * Returns live NASA FIRMS fire hotspots for India, or null if unavailable
   * (caller should fall back to EnvironmentalEngine's static fireHotspots).
   */
  async getLiveFireHotspots() {
    if (this._firesCache) return this._firesCache;

    try {
      const res = await fetch(`${this.apiBase}/api/live/fires`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.fallback || !data.hotspots || data.hotspots.length === 0) return null;
      this._firesCache = data.hotspots;
      return this._firesCache;
    } catch (e) {
      console.warn('LiveDataEngine: fire hotspot fetch failed', e);
      return null;
    }
  }

  /** Small UI badge helper: shows whether a field is LIVE or CACHED/STATIC. */
  renderSourceBadge(isLive) {
    return isLive
      ? '<span class="live-badge live-badge--on" title="Fetched from live external API">● LIVE</span>'
      : '<span class="live-badge live-badge--off" title="Live source not configured — showing reference data">○ STATIC</span>';
  }
}

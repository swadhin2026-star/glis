/**
 * India Land Information Portal - AI & Machine Learning Engine
 * Connects frontend UI to PyTorch U-Net LULC Segmentation API & GIS Regression MLP
 */

class AIEngine {
  constructor() {
    this.apiBase = window.location.origin;
    this.status = {
      online: false,
      ai_engine: "checking",
      gpu_name: "Detecting...",
      pytorch_version: "—",
      cuda_available: false,
      models: { unet_segmentation_best: false, gis_regression_model: false }
    };
    this.samples = [];
    this.currentResult = null;
  }

  async checkStatus() {
    try {
      const res = await fetch(`${this.apiBase}/api/status`);
      if (res.ok) {
        this.status = await res.json();
        return this.status;
      }
    } catch (e) {
      console.warn("AI Backend /api/status error:", e);
    }
    return this.status;
  }

  async fetchSamples() {
    try {
      const res = await fetch(`${this.apiBase}/api/samples`);
      if (res.ok) {
        const data = await res.json();
        this.samples = data.samples || [];
        return this.samples;
      }
    } catch (e) {
      console.warn("AI Backend /api/samples error:", e);
    }
    return [];
  }

  async runSegmentation(payload) {
    const startTime = performance.now();
    try {
      const res = await fetch(`${this.apiBase}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const elapsed = Math.round(performance.now() - startTime);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      data.latencyMs = elapsed;
      this.currentResult = data;
      return data;
    } catch (e) {
      console.error("AI Segmentation failed:", e);
      throw e;
    }
  }

  async runGISPrediction(payload) {
    try {
      const res = await fetch(`${this.apiBase}/api/gis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `Server responded with ${res.status}`);
      }

      return await res.json();
    } catch (e) {
      console.error("GIS Prediction failed:", e);
      throw e;
    }
  }
}

window.AIEngine = AIEngine;

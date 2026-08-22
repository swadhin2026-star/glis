/**
 * India Land Information Portal - Environmental Monitoring Engine (Screen 7)
 * NDVI Vegetation Index trends, Sentinel-2 NDWI surface water body monitoring,
 * Forest fire hotspot alerts (MODIS/VIIRS thermal anomalies), and soil degradation index.
 */

class EnvironmentalEngine {
  constructor() {
    this.fireHotspots = [
      { id: "FIRE-HOT-01", state: "Madhya Pradesh", district: "Panna", lat: 24.72, lng: 80.19, confidence: "96%", brightness: "342 K", detectedTime: "2 hrs ago", severity: "Moderate" },
      { id: "FIRE-HOT-02", state: "Odisha", district: "Mayurbhanj", lat: 21.93, lng: 86.74, confidence: "98%", brightness: "368 K", detectedTime: "45 mins ago", severity: "Severe" },
      { id: "FIRE-HOT-03", state: "Chhattisgarh", district: "Bastar", lat: 19.07, lng: 81.95, confidence: "91%", brightness: "331 K", detectedTime: "4 hrs ago", severity: "Low" },
      { id: "FIRE-HOT-04", state: "Uttarakhand", district: "Nainital", lat: 29.38, lng: 79.46, confidence: "94%", brightness: "355 K", detectedTime: "1 hr ago", severity: "High" }
    ];
  }

  getNDVITrend(stateKey = "kerala") {
    const state = stateDatabase[stateKey] || stateDatabase["kerala"];
    const forestPct = state.land.forest;

    const baseNDVI = 0.35 + (forestPct / 100) * 0.45;

    return [
      { year: "2020", meanNDVI: (baseNDVI - 0.04).toFixed(2), canopyDensity: "Moderate", health: "Stable" },
      { year: "2021", meanNDVI: (baseNDVI - 0.02).toFixed(2), canopyDensity: "Dense", health: "High" },
      { year: "2022", meanNDVI: (baseNDVI + 0.01).toFixed(2), canopyDensity: "Very Dense", health: "Optimal" },
      { year: "2023", meanNDVI: (baseNDVI - 0.01).toFixed(2), canopyDensity: "Dense", health: "High" },
      { year: "2024", meanNDVI: (baseNDVI + 0.03).toFixed(2), canopyDensity: "Very Dense", health: "Optimal" },
      { year: "2025-26", meanNDVI: baseNDVI.toFixed(2), canopyDensity: "Very Dense", health: "Optimal" }
    ];
  }

  getWaterBodyMetrics(stateKey = "andhra pradesh") {
    const state = stateDatabase[stateKey] || stateDatabase["andhra pradesh"];
    return {
      totalWaterBodiesInventoried: 14200 + state.districts * 450,
      perennialSurfaceAreaHectares: Math.round(state.areaNum * (state.land.water / 100) * 85),
      seasonalWaterChangeRate: "-4.2% (Post-Monsoon vs Summer Recede)",
      wetlandsRamsarCount: state.land.water >= 4 ? "3 Ramsar Sites" : "1 Ramsar Site",
      groundwaterStatus: state.land.agriculture > 60 ? "Over-Exploited / Critical in 28% Taluks" : "Safe / Sustainable Recharge Zone"
    };
  }

  getSoilDegradationRisk(stateKey = "rajasthan") {
    const state = stateDatabase[stateKey] || stateDatabase["rajasthan"];
    let riskLevel = "Low to Moderate";
    let erosionFactor = "12.4 tonnes/ha/yr";

    if (state.land.barren > 25) {
      riskLevel = "High Desertification & Wind Erosion Risk";
      erosionFactor = "28.6 tonnes/ha/yr";
    } else if (state.zone === "North East" || state.zone === "Himalayan") {
      riskLevel = "High Water Runoff & Topsoil Sheet Erosion";
      erosionFactor = "22.1 tonnes/ha/yr";
    }

    return {
      riskLevel,
      erosionFactor,
      salinityIndex: state.land.barren > 20 ? "Elevated Soil Alkalinity" : "Normal Agricultural Salinity",
      organicCarbonStatus: state.land.forest > 40 ? "Rich (> 0.75%)" : "Medium-Low (0.35% - 0.50%)"
    };
  }
}

window.EnvironmentalEngine = EnvironmentalEngine;

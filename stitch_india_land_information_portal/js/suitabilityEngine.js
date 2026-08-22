/**
 * India Land Information Portal - Infrastructure Site Suitability Engine (Screen 4)
 * Multi-Criteria Evaluation (MCE) analytical model for renewable energy,
 * industrial parks, logistics hubs, and highway corridor siting.
 */

class SuitabilityEngine {
  constructor() {
    this.criteriaWeights = {
      slope: 20,       // Max acceptable slope (< 5% is ideal)
      roadProximity: 25, // Proximity to National/State Highways (< 5km)
      waterBuffer: 15,   // Distance from protected water bodies (> 500m)
      gridAccess: 20,    // Proximity to high-voltage power substations (< 10km)
      settlement: 10,    // Buffer distance from dense urban settlements (> 2km)
      ecoBuffer: 10      // Environmental / Forest buffer restrictions
    };

    this.selectedProject = "Solar Mega-Park (500MW+)";
    this.selectedState = "gujarat";
  }

  calculateSuitability(weights = this.criteriaWeights, stateKey = this.selectedState) {
    const state = stateDatabase[stateKey] || stateDatabase["gujarat"];

    // Base score calculation influenced by land composition
    const barrenBonus = (state.land.barren / 100) * 35;
    const agriPenalty = (state.land.agriculture / 100) * 15;
    const forestPenalty = (state.land.forest / 100) * 25;

    // Weight factors (normalized to 100)
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 100;
    const normWeights = {
      slope: (weights.slope / totalWeight) * 100,
      road: (weights.roadProximity / totalWeight) * 100,
      water: (weights.waterBuffer / totalWeight) * 100,
      grid: (weights.gridAccess / totalWeight) * 100,
      settlement: (weights.settlement / totalWeight) * 100,
      eco: (weights.ecoBuffer / totalWeight) * 100
    };

    // Calculate composite index (0 - 100)
    let score = Math.round(
      50 + barrenBonus - agriPenalty - forestPenalty +
      (normWeights.grid * 0.25) +
      (normWeights.road * 0.2) +
      (normWeights.slope * 0.15)
    );

    score = Math.max(15, Math.min(98, score));

    // Suitability Category
    let category = "Moderately Suitable";
    let badgeClass = "badge-blue";
    if (score >= 80) {
      category = "Highly Suitable (Prime Location)";
      badgeClass = "badge-green";
    } else if (score >= 65) {
      category = "Suitable with Minor Infrastructure Upgrades";
      badgeClass = "badge-blue";
    } else if (score >= 45) {
      category = "Conditional (High Forest / Topo Constraints)";
      badgeClass = "badge-amber";
    } else {
      category = "Unsuitable (Eco-Sensitive / Water Basin)";
      badgeClass = "badge-orange";
    }

    return {
      score,
      category,
      badgeClass,
      state: state.name,
      recommendation: this.getRecommendation(score, state),
      candidateSites: this.getCandidateSites(stateKey, score)
    };
  }

  getRecommendation(score, state) {
    if (score >= 80) {
      return `Target terrain in ${state.name} provides optimal wasteland parcels (>1,500 hectares), low topological variance, and proximity to the state grid transmission corridor. Minimal environmental clearances required.`;
    } else if (score >= 60) {
      return `Target parcels in ${state.name} are viable, but require 132kV transmission spur line extension and secondary road widening to accommodate heavy equipment logistics.`;
    } else {
      return `Significant constraints detected due to high forest cover (${state.land.forest}%) or prime irrigated agricultural land (${state.land.agriculture}%). Siting within 10km of eco-sensitive zones is restricted.`;
    }
  }

  getCandidateSites(stateKey, baseScore) {
    const state = stateDatabase[stateKey] || stateDatabase["gujarat"];
    const districts = state.districtList.slice(0, 4);

    return districts.map((dist, idx) => {
      const siteScore = Math.max(20, Math.min(99, baseScore + (idx % 2 === 0 ? 5 : -4) - idx * 2));
      return {
        district: dist,
        parcelSize: (1200 - idx * 180) + " Ha",
        terrainSlope: (1.2 + idx * 0.8).toFixed(1) + "°",
        gridDistance: (4.5 + idx * 2.1).toFixed(1) + " km",
        waterDistance: (1.8 + idx * 0.9).toFixed(1) + " km",
        score: siteScore,
        status: siteScore >= 75 ? "Approved" : (siteScore >= 55 ? "Under Review" : "Deferred")
      };
    });
  }
}

window.SuitabilityEngine = SuitabilityEngine;

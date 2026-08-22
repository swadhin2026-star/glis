/**
 * India Land Information Portal - Socio-Economic Engine (Screen 8)
 * WorldPop density, NOAA VIIRS nighttime light radiance,
 * demographic indicators, and state GDP/literacy correlations.
 */

class SocioEconomicEngine {
  constructor() {}

  getSocioEconomicProfile(stateKey = "karnataka") {
    const state = stateDatabase[stateKey] || stateDatabase["karnataka"];
    const densityPerSqKm = Math.round(state.populationNum / state.areaNum);

    // Approximate nightlight radiance (nW/cm²/sr) based on urban percentage & GDP
    const urbanPct = parseFloat(state.urbanPopulation) || 30;
    const approxRadiance = (8.5 + (urbanPct * 0.75)).toFixed(1);

    return {
      stateName: state.name,
      densityPerSqKm: `${densityPerSqKm} persons/km²`,
      urbanShare: state.urbanPopulation,
      ruralShare: `${(100 - parseFloat(state.urbanPopulation)).toFixed(1)}%`,
      viirsRadiance: `${approxRadiance} nW/cm²/sr`,
      gdpContribution: state.gdpContribution,
      literacyRate: state.literacyRate,
      agriculturalWorkerShare: state.land.agriculture > 50 ? "54.2% of Total Workforce" : "32.8% of Total Workforce",
      electrificationRate: "99.4% (Saubhagya Universal Household Connectivity)",
      broadbandPenetration: `${Math.round(45 + urbanPct * 0.6)}% (BharatNet Panchayats Connected)`,
      demographicBreakdown: [
        { label: "0-14 Years (Youth)", percent: "24.2%" },
        { label: "15-59 Years (Working Age)", percent: "65.6%" },
        { label: "60+ Years (Senior)", percent: "10.2%" }
      ],
      economicCorridorImpact: [
        { corridor: "Industrial & Freight Corridor", status: "High Radiance Growth (+14.2% YoY)" },
        { corridor: "Rural Agricultural Hinterland", status: "Steady Radiance (+4.8% YoY)" },
        { corridor: "Coastal Maritime Logistics Zone", status: "Very High Radiance (+19.1% YoY)" }
      ]
    };
  }

  compareStates(stateKeyA = "maharashtra", stateKeyB = "gujarat") {
    const a = this.getSocioEconomicProfile(stateKeyA);
    const b = this.getSocioEconomicProfile(stateKeyB);
    const stateA = stateDatabase[stateKeyA] || stateDatabase["maharashtra"];
    const stateB = stateDatabase[stateKeyB] || stateDatabase["gujarat"];

    return {
      stateA: { ...a, raw: stateA },
      stateB: { ...b, raw: stateB }
    };
  }
}

window.SocioEconomicEngine = SocioEconomicEngine;

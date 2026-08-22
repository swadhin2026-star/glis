/**
 * India Land Information Portal - Urban Planning & Zoning Engine (Screen 5)
 * FAR/FSI calculator, master plan zoning regulation simulator,
 * municipal boundary expansion timeline, and satellite encroachment alerts.
 */

class UrbanPlanningEngine {
  constructor() {
    this.zoningNorms = {
      residential_low: { name: "Residential (R-1 Low Density)", baseFAR: 1.5, maxCoverage: 45, maxFloors: 3, parkingRatio: "1 ECS per 100 sqm" },
      residential_high: { name: "Residential (R-2 High Density / Group Housing)", baseFAR: 2.75, maxCoverage: 35, maxFloors: 14, parkingRatio: "1.5 ECS per 100 sqm" },
      commercial_cbd: { name: "Commercial Central Business District (C-1)", baseFAR: 3.5, maxCoverage: 50, maxFloors: 25, parkingRatio: "2.0 ECS per 100 sqm" },
      industrial_light: { name: "Industrial & Logistics Park (I-1)", baseFAR: 1.25, maxCoverage: 60, maxFloors: 2, parkingRatio: "1.0 ECS per 150 sqm" },
      mixed_use: { name: "Mixed-Use Transit-Oriented Development (TOD)", baseFAR: 4.0, maxCoverage: 40, maxFloors: 30, parkingRatio: "1.2 ECS per 100 sqm" },
      green_belt: { name: "Eco-Sensitive Green Buffer Zone (GB)", baseFAR: 0.1, maxCoverage: 10, maxFloors: 1, parkingRatio: "N/A (Strict Protection)" }
    };
  }

  calculateFAR(plotAreaSqm, roadWidthMeters, zoneKey = "residential_high", premiumFARPurchased = 0) {
    const zone = this.zoningNorms[zoneKey] || this.zoningNorms.residential_high;
    const plotArea = parseFloat(plotAreaSqm) || 1000;
    const roadWidth = parseFloat(roadWidthMeters) || 18;
    const premium = parseFloat(premiumFARPurchased) || 0;

    // Road width modifier
    let roadModifier = 1.0;
    if (roadWidth >= 30) roadModifier = 1.35;
    else if (roadWidth >= 24) roadModifier = 1.2;
    else if (roadWidth >= 18) roadModifier = 1.0;
    else if (roadWidth >= 12) roadModifier = 0.85;
    else roadModifier = 0.65;

    const effectiveFAR = (zone.baseFAR * roadModifier) + premium;
    const permissibleBuiltUpArea = Math.round(plotArea * effectiveFAR);
    const groundCoverageSqm = Math.round(plotArea * (zone.maxCoverage / 100));
    const estimatedHeightMeters = Math.min(zone.maxFloors * 3.3, roadWidth * 1.5);

    return {
      plotArea,
      zoneName: zone.name,
      baseFAR: zone.baseFAR,
      effectiveFAR: effectiveFAR.toFixed(2),
      permissibleBuiltUpArea,
      groundCoverageSqm,
      maxCoveragePercent: zone.maxCoverage + "%",
      maxFloors: zone.maxFloors,
      estimatedHeightMeters: estimatedHeightMeters.toFixed(1) + " m",
      parkingRequirement: zone.parkingRatio
    };
  }

  getEncroachmentAlerts(stateKey = "maharashtra") {
    const state = stateDatabase[stateKey] || stateDatabase["maharashtra"];
    return [
      {
        id: "ENC-2026-081",
        location: `${state.capital} Metropolitan Ring Road - Km 14.2`,
        severity: "Critical",
        category: "Right-of-Way (RoW) Encroachment",
        detectedDate: "2026-08-18",
        satelliteSource: "Sentinel-2 Multi-spectral Change Detection",
        areaAffected: "3,420 sqm",
        actionStatus: "Show-Cause Notice Issued to Revenue Circle Officer",
        confidence: "94.8%"
      },
      {
        id: "ENC-2026-074",
        location: `${state.districtList[0] || 'District'} Wetland Catchment Sector 9`,
        severity: "High",
        category: "Water Body / Lake Bed Filling",
        detectedDate: "2026-08-12",
        satelliteSource: "CartoDEM + NDWI Water Index Drop",
        areaAffected: "8,900 sqm",
        actionStatus: "Tehsildar Ground Verification Ordered",
        confidence: "91.2%"
      },
      {
        id: "ENC-2026-062",
        location: `${state.districtList[1] || 'District'} Reserve Forest Border (Survey #412)`,
        severity: "Medium",
        category: "Forest Buffer Boundary Encroachment",
        detectedDate: "2026-07-29",
        satelliteSource: "PlanetScope 3m Surface Reflectance",
        areaAffected: "1,850 sqm",
        actionStatus: "Forest Department Demarcation in Progress",
        confidence: "88.4%"
      }
    ];
  }
}

window.UrbanPlanningEngine = UrbanPlanningEngine;

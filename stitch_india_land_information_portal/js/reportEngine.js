/**
 * India Land Information Portal - Report Builder Engine (Screen 9)
 * Generates custom geospatial dossiers, downloadable GeoJSON features,
 * state CSV datasets, and print-ready executive summaries.
 */

class ReportEngine {
  constructor() {}

  generateDossier(stateKey = "gujarat", includedModules = {}) {
    const state = stateDatabase[stateKey] || stateDatabase["gujarat"];
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    return {
      title: `State Geospatial & Land Information Dossier: ${state.name}`,
      dossierId: `GLIS-DOSSIER-${state.code}-${new Date().getFullYear()}`,
      generatedDate: timestamp,
      state,
      modules: {
        summary: includedModules.summary !== false,
        landUse: includedModules.landUse !== false,
        governance: includedModules.governance !== false,
        environmental: includedModules.environmental !== false,
        socioEconomic: includedModules.socioEconomic !== false,
        infrastructure: includedModules.infrastructure !== false
      }
    };
  }

  downloadStateGeoJSON(stateKey = "gujarat") {
    const state = stateDatabase[stateKey] || stateDatabase["gujarat"];
    const [lat, lng] = state.mapCenter;

    const geojsonData = {
      type: "FeatureCollection",
      metadata: {
        portal: "India Land Information Portal (GLIS)",
        license: "Open Access Data / Survey of India datum",
        generatedAt: new Date().toISOString()
      },
      features: [
        {
          type: "Feature",
          properties: {
            stateName: state.name,
            stateCode: state.code,
            capital: state.capital,
            population: state.population,
            area: state.area,
            districts: state.districts,
            agriculturePercent: state.land.agriculture,
            forestPercent: state.land.forest,
            builtPercent: state.land.built,
            waterPercent: state.land.water,
            barrenPercent: state.land.barren,
            landUseSource: state.landUseSource
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [lng - 1.2, lat - 1.0],
                [lng + 1.3, lat - 0.8],
                [lng + 1.4, lat + 1.1],
                [lng - 0.9, lat + 1.2],
                [lng - 1.2, lat - 1.0]
              ]
            ]
          }
        }
      ]
    };

    const blob = new Blob([JSON.stringify(geojsonData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.id}_land_gis_boundary.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.app) {
      window.app.showToast(`Exported ${state.name} GeoJSON boundary vector file.`);
    }
  }

  downloadStateCSV() {
    const headers = ["State Name", "Code", "Zone", "Capital", "Population", "Area", "Districts", "Agri %", "Forest %", "Built %", "Water %", "Barren %", "Source"];
    const rows = Object.values(stateDatabase).map(s => [
      `"${s.name}"`,
      `"${s.code}"`,
      `"${s.zone}"`,
      `"${s.capital}"`,
      `"${s.population}"`,
      `"${s.area}"`,
      s.districts,
      s.land.agriculture,
      s.land.forest,
      s.land.built,
      s.land.water,
      s.land.barren,
      `"${s.landUseSource}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "india_land_portal_state_master_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.app) {
      window.app.showToast("Exported National State Master CSV dataset.");
    }
  }

  printDossier() {
    window.print();
  }
}

window.ReportEngine = ReportEngine;

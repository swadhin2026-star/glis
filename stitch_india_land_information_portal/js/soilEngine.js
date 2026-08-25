/**
 * India Land Information Portal - Soil Quality & Crop Intelligence Engine
 * Provides analytical queries, state soil health evaluation, and reverse crop-district harvesting discovery.
 */

class SoilQualityEngine {
  constructor() {
    this.soilTypes = window.indianSoilTypesMaster || {};
    this.stateSoils = window.stateSoilDatabase || {};
    this.cropDatabase = window.cropHarvestDatabase || {};
    this.currentSelectedState = "gujarat";
    this.currentSelectedCrop = "cotton";
    this.currentCategoryFilter = "ALL";
  }

  getStateSoilProfile(stateKey) {
    const key = (stateKey || "gujarat").toLowerCase().trim();
    return this.stateSoils[key] || this.stateSoils["gujarat"];
  }

  getCropProfile(cropKey) {
    const key = (cropKey || "cotton").toLowerCase().trim();
    if (this.cropDatabase[key]) return this.cropDatabase[key];

    // Search by partial name match
    const foundKey = Object.keys(this.cropDatabase).find(k => {
      const c = this.cropDatabase[k];
      return c.name.toLowerCase().includes(key) ||
             (c.hindiName && c.hindiName.includes(key)) ||
             k.includes(key);
    });

    return foundKey ? this.cropDatabase[foundKey] : this.cropDatabase["cotton"];
  }

  getSoilType(soilId) {
    const id = (soilId || "alluvial").toLowerCase().trim();
    return this.soilTypes[id] || this.soilTypes["alluvial"];
  }

  getAllSoilTypes() {
    return Object.values(this.soilTypes);
  }

  getAllCrops() {
    return Object.values(this.cropDatabase);
  }

  filterCropsByCategory(category = "ALL") {
    const all = Object.values(this.cropDatabase);
    if (!category || category === "ALL") return all;
    return all.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
  }

  searchCrops(query) {
    if (!query || query.trim() === "") return this.getAllCrops();
    const q = query.toLowerCase().trim();
    return Object.values(this.cropDatabase).filter(c => {
      const matchName = c.name.toLowerCase().includes(q);
      const matchHindi = c.hindiName ? c.hindiName.toLowerCase().includes(q) : false;
      const matchCat = c.category.toLowerCase().includes(q);
      const matchSoil = c.idealSoil.toLowerCase().includes(q);
      const matchDistrict = c.producingStates.some(st => 
        st.state.toLowerCase().includes(q) || 
        st.majorDistricts.some(d => d.toLowerCase().includes(q))
      );
      return matchName || matchHindi || matchCat || matchSoil || matchDistrict;
    });
  }

  searchSoilByState(stateQuery) {
    if (!stateQuery || stateQuery.trim() === "") return null;
    const q = stateQuery.toLowerCase().trim();
    const stateKey = Object.keys(this.stateSoils).find(k => 
      k.includes(q) || (this.stateSoils[k].stateName && this.stateSoils[k].stateName.toLowerCase().includes(q))
    );
    return stateKey ? this.stateSoils[stateKey] : null;
  }

  getCropsForSoilType(soilId) {
    const soil = this.getSoilType(soilId);
    return soil ? soil.suitableCrops : [];
  }

  getCropHarvestLocations(cropKey) {
    const crop = this.getCropProfile(cropKey);
    return crop ? crop.producingStates : [];
  }

  calculateStateSoilKPIs(stateKey) {
    const profile = this.getStateSoilProfile(stateKey);
    const healthIndex = profile.soilHealthIndex || 78;

    let dominantType = profile.soilDistribution[0] ? profile.soilDistribution[0].name : "Alluvial Soil";
    let dominantPercent = profile.soilDistribution[0] ? profile.soilDistribution[0].percent : 50;

    let rating = "Good - Highly Arable";
    let badgeClass = "badge-black";
    if (healthIndex >= 85) {
      rating = "Exceptional - Rich Humus / Silt";
      badgeClass = "badge-black";
    } else if (healthIndex >= 75) {
      rating = "Very Good - Optimal NPK Response";
      badgeClass = "badge-white";
    } else {
      rating = "Moderate - Requires Micronutrient Remediation";
      badgeClass = "badge-white";
    }

    return {
      healthIndex,
      rating,
      badgeClass,
      dominantType,
      dominantPercent,
      advisory: profile.soilAdvisories || "Maintain balanced NPK and organic green manuring."
    };
  }
}

window.SoilQualityEngine = SoilQualityEngine;

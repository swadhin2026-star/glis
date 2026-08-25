/**
 * India Land Information Portal - Soil Classification, State Soil Profiles & Crop Harvest Database
 * Source data compiled from ICAR (Indian Council of Agricultural Research), NBSS&LUP, 
 * Ministry of Agriculture & Farmers Welfare, DAC&FW, and State Agriculture Departments.
 */

const indianSoilTypesMaster = {
  alluvial: {
    id: "alluvial",
    name: "Alluvial Soil (Khadar & Bhangar)",
    hindiName: "जलोढ़ मिट्टी",
    order: "Inceptisols & Entisols",
    coveragePercent: 43.4,
    coverageAreaKm2: 1500000,
    phRange: "6.5 – 8.2",
    phMedian: 7.3,
    texture: "Sandy Loam to Silty Clay Loam",
    color: "Light Grey to Ash Grey / Yellowish Brown",
    drainage: "Moderate to Well Drained",
    moistureRetention: "High (65 - 75%)",
    organicCarbon: "0.40% – 0.85% (Medium)",
    npkProfile: {
      nitrogen: "Low to Medium (Deficient in N)",
      phosphorus: "Medium (Available P: 15-25 kg/ha)",
      potassium: "High to Very High (K2O > 280 kg/ha)",
      lime: "Adequate to Rich (CaCO3 present)"
    },
    micronutrients: {
      zinc: "Mildly Deficient",
      iron: "Sufficient",
      manganese: "Sufficient",
      boron: "Moderate"
    },
    geologicalOrigin: "Fluvial deposition by the Indus, Ganga, Brahmaputra and coastal river systems over thousands of years.",
    suitableCrops: [
      { name: "Rice (Paddy)", season: "Kharif", suitability: "Optimal", yieldPotential: "4.5 - 6.5 t/ha" },
      { name: "Wheat", season: "Rabi", suitability: "Optimal", yieldPotential: "4.0 - 5.8 t/ha" },
      { name: "Sugarcane", season: "Annual", suitability: "Optimal", yieldPotential: "75 - 110 t/ha" },
      { name: "Jute", season: "Kharif", suitability: "Optimal", yieldPotential: "2.8 - 3.5 t/ha" },
      { name: "Maize", season: "Kharif / Rabi", suitability: "Very High", yieldPotential: "3.5 - 5.2 t/ha" },
      { name: "Mustard & Rapeseed", season: "Rabi", suitability: "Very High", yieldPotential: "1.8 - 2.6 t/ha" },
      { name: "Gram (Chickpea)", season: "Rabi", suitability: "High", yieldPotential: "1.5 - 2.2 t/ha" },
      { name: "Potato", season: "Rabi", suitability: "Optimal", yieldPotential: "22 - 35 t/ha" },
      { name: "Tobacco", season: "Rabi", suitability: "High", yieldPotential: "2.0 - 3.0 t/ha" }
    ],
    managementAdvisory: "Apply Split-dose Nitrogen with Neem-coated Urea. Supplement with Zinc Sulphate (25 kg/ha) every 2 years. Maintain organic matter through green manuring (Dhaincha/Sunhemp).",
    majorBelts: "Indo-Gangetic Plain (Punjab, Haryana, UP, Bihar, West Bengal), Brahmaputra Valley (Assam), and Mahanadi, Godavari, Krishna, Cauvery deltas."
  },
  black: {
    id: "black",
    name: "Black Cotton Soil (Regur / Vertisols)",
    hindiName: "काली / रेगुर मिट्टी",
    order: "Vertisols",
    coveragePercent: 15.2,
    coverageAreaKm2: 546000,
    phRange: "7.2 – 8.8",
    phMedian: 7.9,
    texture: "Heavy Clay (Montmorillonite clay mineral)",
    color: "Deep Black to Chestnut Brown",
    drainage: "Slow to Imperfect (High swelling & shrinkage)",
    moistureRetention: "Very High (75 - 85%, deep self-ploughing cracks)",
    organicCarbon: "0.30% – 0.65% (Low to Medium)",
    npkProfile: {
      nitrogen: "Very Low (Deficient)",
      phosphorus: "Low to Medium",
      potassium: "High to Very High",
      lime: "High (Rich in Calcium Carbonate, Magnesium, Alumina)"
    },
    micronutrients: {
      zinc: "Deficient",
      iron: "Moderate",
      manganese: "High",
      boron: "Sufficient"
    },
    geologicalOrigin: "Formed in situ by the weathering of Deccan Traps basaltic lava rocks under semi-arid climate.",
    suitableCrops: [
      { name: "Cotton", season: "Kharif", suitability: "Optimal (King of Cotton Soils)", yieldPotential: "2.0 - 3.2 t/ha" },
      { name: "Soybean", season: "Kharif", suitability: "Optimal", yieldPotential: "2.2 - 3.0 t/ha" },
      { name: "Jowar (Sorghum)", season: "Kharif / Rabi", suitability: "Optimal", yieldPotential: "2.5 - 3.8 t/ha" },
      { name: "Wheat (Durum / Sharbati)", season: "Rabi", suitability: "Very High", yieldPotential: "3.2 - 4.8 t/ha" },
      { name: "Sugarcane", season: "Annual", suitability: "High (under drip)", yieldPotential: "85 - 120 t/ha" },
      { name: "Sunflower", season: "Rabi / Zaid", suitability: "Very High", yieldPotential: "1.6 - 2.4 t/ha" },
      { name: "Groundnut", season: "Kharif", suitability: "High", yieldPotential: "2.0 - 3.0 t/ha" },
      { name: "Tur / Arhar (Pigeon Pea)", season: "Kharif", suitability: "Optimal", yieldPotential: "1.8 - 2.5 t/ha" },
      { name: "Citrus Fruits (Oranges/Mosambi)", season: "Perennial", suitability: "Optimal", yieldPotential: "15 - 25 t/ha" }
    ],
    managementAdvisory: "Ensure surface drainage to avoid waterlogging during heavy monsoons. Adopt broad-bed furrow (BBF) planting. Apply phosphatic fertilizers (SSP/DAP) and Zinc Sulphate.",
    majorBelts: "Deccan Lava Plateau covering Maharashtra, Gujarat, Madhya Pradesh (Malwa), Northern Karnataka, Western Andhra Pradesh & Telangana."
  },
  red_yellow: {
    id: "red_yellow",
    name: "Red & Yellow Soil (Alfisols & Ultisols)",
    hindiName: "लाल एवं पीली मिट्टी",
    order: "Alfisols & Inceptisols",
    coveragePercent: 18.6,
    coverageAreaKm2: 610000,
    phRange: "5.5 – 7.2",
    phMedian: 6.4,
    texture: "Sandy Loam to Clayey Loam (Porous, friable)",
    color: "Red (Ferric oxides) / Yellow (Hydrated oxides)",
    drainage: "Rapid to Well Drained",
    moistureRetention: "Low to Moderate (40 - 55%)",
    organicCarbon: "0.20% – 0.50% (Low)",
    npkProfile: {
      nitrogen: "Low (Deficient)",
      phosphorus: "Low (Fixation problem)",
      potassium: "Medium to Adequate",
      lime: "Deficient (Leached)"
    },
    micronutrients: {
      zinc: "Deficient",
      iron: "Very High",
      manganese: "High",
      boron: "Deficient"
    },
    geologicalOrigin: "Weathering of ancient crystalline igneous and metamorphic rocks (granites, gneisses, schists) in warm temperate to tropical regions.",
    suitableCrops: [
      { name: "Groundnut", season: "Kharif", suitability: "Optimal", yieldPotential: "2.2 - 3.4 t/ha" },
      { name: "Ragi (Finger Millet)", season: "Kharif", suitability: "Optimal", yieldPotential: "2.0 - 3.2 t/ha" },
      { name: "Bajra (Pearl Millet)", season: "Kharif", suitability: "Very High", yieldPotential: "1.8 - 2.8 t/ha" },
      { name: "Pulses (Moong, Urad, Cowpea)", season: "Kharif / Rabi", suitability: "Optimal", yieldPotential: "1.2 - 1.8 t/ha" },
      { name: "Tobacco", season: "Rabi", suitability: "Very High", yieldPotential: "1.8 - 2.6 t/ha" },
      { name: "Castor", season: "Kharif", suitability: "Optimal", yieldPotential: "1.5 - 2.4 t/ha" },
      { name: "Mango & Guava", season: "Perennial", suitability: "Very High", yieldPotential: "12 - 20 t/ha" },
      { name: "Potato & Vegetables", season: "Rabi", suitability: "High (with irrigation)", yieldPotential: "18 - 26 t/ha" }
    ],
    managementAdvisory: "Apply farmyard manure (FYM) or vermicompost (5-10 t/ha) to enhance water holding capacity. Apply Single Super Phosphate (SSP) with mycorrhiza to counter phosphate fixation.",
    majorBelts: "Tamil Nadu, Karnataka, Southern Andhra Pradesh, Telangana, Odisha, Chhota Nagpur Plateau (Jharkhand), Chhattisgarh, Southern MP."
  },
  laterite: {
    id: "laterite",
    name: "Laterite & Lateritic Soil (Oxisols)",
    hindiName: "लेटराइट मिट्टी",
    order: "Oxisols & Ultisols",
    coveragePercent: 4.3,
    coverageAreaKm2: 140000,
    phRange: "4.2 – 5.8",
    phMedian: 4.9,
    texture: "Coarse Loam to Gravelly Clay (Rich in Iron nodules)",
    color: "Reddish Brown to Brick Red",
    drainage: "Excessive (High leaching)",
    moistureRetention: "Low (30 - 45%)",
    organicCarbon: "0.35% – 0.90% (Rapid organic oxidation)",
    npkProfile: {
      nitrogen: "Low to Moderate",
      phosphorus: "Very Low (Strongly fixed by iron/alumina)",
      potassium: "Low (Leached)",
      lime: "Extremely Deficient (Acidic)"
    },
    micronutrients: {
      zinc: "Deficient",
      iron: "Extremely High (Toxicity risk)",
      manganese: "High",
      boron: "Deficient"
    },
    geologicalOrigin: "Intense chemical weathering under tropical conditions of alternating wet and dry seasons with high rainfall (>2000 mm).",
    suitableCrops: [
      { name: "Tea", season: "Perennial", suitability: "Optimal", yieldPotential: "2.0 - 3.5 t/ha made tea" },
      { name: "Coffee (Arabica & Robusta)", season: "Perennial", suitability: "Optimal", yieldPotential: "1.2 - 2.2 t/ha" },
      { name: "Rubber", season: "Perennial", suitability: "Optimal", yieldPotential: "1.8 - 2.5 t/ha dry rubber" },
      { name: "Cashew Nut", season: "Perennial", suitability: "Optimal", yieldPotential: "1.5 - 2.8 t/ha" },
      { name: "Coconut & Arecanut", season: "Perennial", suitability: "Very High", yieldPotential: "80 - 120 nuts/palm" },
      { name: "Cardamom & Black Pepper", season: "Perennial", suitability: "Optimal", yieldPotential: "0.4 - 0.9 t/ha" },
      { name: "Tapioca (Cassava)", season: "Annual", suitability: "Very High", yieldPotential: "25 - 40 t/ha" }
    ],
    managementAdvisory: "Apply Agricultural Lime / Dolomite (1-2 t/ha every 3 years) to neutralize acidity. Use Rock Phosphate or Di-Ammonium Phosphate. Apply mulching for moisture preservation.",
    majorBelts: "Western Ghats summit ridge (Kerala, Karnataka, Goa, Maharashtra), Eastern Ghats of Odisha, Nilgiri Hills, Assam & Meghalaya plateau."
  },
  arid_desert: {
    id: "arid_desert",
    name: "Arid & Desert Soil (Aridisols)",
    hindiName: "मरुस्थलीय / शुष्क मिट्टी",
    order: "Aridisols",
    coveragePercent: 4.2,
    coverageAreaKm2: 138000,
    phRange: "7.8 – 9.2",
    phMedian: 8.4,
    texture: "Coarse Sand to Sandy Loam",
    color: "Light Brown to Yellowish Sand",
    drainage: "Excessive (Extremely porous)",
    moistureRetention: "Very Low (15 - 30%)",
    organicCarbon: "0.08% – 0.25% (Extremely Low)",
    npkProfile: {
      nitrogen: "Critically Low",
      phosphorus: "Moderate to High",
      potassium: "High (Soluble salts present)",
      lime: "High (Calcareous subsoil hardpan / Kankar layer)"
    },
    micronutrients: {
      zinc: "Deficient",
      iron: "Low to Moderate",
      manganese: "Moderate",
      boron: "High (Salinity hazard)"
    },
    geologicalOrigin: "Mechanical disintegration of rocks under hyper-arid conditions with wind deposition in the Great Indian Thar Desert.",
    suitableCrops: [
      { name: "Bajra (Pearl Millet)", season: "Kharif", suitability: "Optimal (Drought Hardy)", yieldPotential: "1.5 - 2.5 t/ha" },
      { name: "Guar (Cluster Bean)", season: "Kharif", suitability: "Optimal", yieldPotential: "0.8 - 1.5 t/ha" },
      { name: "Moth Bean", season: "Kharif", suitability: "Optimal", yieldPotential: "0.6 - 1.1 t/ha" },
      { name: "Mustard", season: "Rabi", suitability: "Very High (under drip)", yieldPotential: "1.8 - 2.4 t/ha" },
      { name: "Barley", season: "Rabi", suitability: "Very High", yieldPotential: "2.8 - 4.2 t/ha" },
      { name: "Cumin (Jeera) & Coriander", season: "Rabi", suitability: "Optimal", yieldPotential: "0.6 - 1.0 t/ha" },
      { name: "Isabgol (Psyllium)", season: "Rabi", suitability: "Optimal", yieldPotential: "0.8 - 1.4 t/ha" },
      { name: "Date Palm & Pomegranate", season: "Perennial", suitability: "Optimal (Drip irrigated)", yieldPotential: "10 - 18 t/ha" }
    ],
    managementAdvisory: "Implement Drip Irrigation and Sand-dune stabilization. Apply Bio-fertilizers (Azotobacter, Rhizobium) and regular green manuring to build soil organic matter. Break Kankar hardpan.",
    majorBelts: "Western Rajasthan (Jaisalmer, Bikaner, Barmer, Jodhpur), Rann of Kutch & Banaskantha (Gujarat), Southern Punjab and Haryana border."
  },
  mountain_forest: {
    id: "mountain_forest",
    name: "Mountain & Forest Soil (Mollisols / Inceptisols)",
    hindiName: "पर्वतीय एवं वन मिट्टी",
    order: "Inceptisols & Mollisols",
    coveragePercent: 8.7,
    coverageAreaKm2: 285000,
    phRange: "5.0 – 6.6",
    phMedian: 5.8,
    texture: "Loamy to Silty Loam with organic peat",
    color: "Dark Brown to Jet Black (Humus rich)",
    drainage: "Good to Rapid on hill slopes",
    moistureRetention: "High in surface layer (60 - 75%)",
    organicCarbon: "1.20% – 3.50% (Very High)",
    npkProfile: {
      nitrogen: "High (Rich in organic nitrogen)",
      phosphorus: "Low to Medium",
      potassium: "Medium to High",
      lime: "Deficient (Leached by mountain rains)"
    },
    micronutrients: {
      zinc: "Moderate",
      iron: "High",
      manganese: "High",
      boron: "Low"
    },
    geologicalOrigin: "Developed under sub-alpine to temperate forest canopy with deposition of organic litter in Himalayan and sub-Himalayan valleys.",
    suitableCrops: [
      { name: "Apple", season: "Perennial", suitability: "Optimal (Temperate King)", yieldPotential: "10 - 20 t/ha" },
      { name: "Walnut & Almond", season: "Perennial", suitability: "Optimal", yieldPotential: "2.5 - 4.5 t/ha" },
      { name: "Saffron", season: "Kharif / Autumn", suitability: "Optimal (Karewa soils)", yieldPotential: "2.5 - 4.5 kg/ha" },
      { name: "Tea (Darjeeling / Kangra)", season: "Perennial", suitability: "Optimal", yieldPotential: "1.5 - 2.5 t/ha" },
      { name: "Maize & Barley", season: "Kharif / Rabi", suitability: "Very High", yieldPotential: "2.8 - 4.2 t/ha" },
      { name: "Potato & Exotic Vegetables", season: "Summer / Autumn", suitability: "Optimal", yieldPotential: "20 - 32 t/ha" },
      { name: "Large Cardamom & Ginger", season: "Perennial", suitability: "Optimal", yieldPotential: "0.5 - 1.2 t/ha" }
    ],
    managementAdvisory: "Terrace cultivation and contour bunding are mandatory to prevent severe topsoil erosion. Apply rock phosphate and compost; avoid chemical nitrogen overload.",
    majorBelts: "Jammu & Kashmir, Ladakh, Himachal Pradesh, Uttarakhand, Sikkim, Arunachal Pradesh, Darjeeling hills (WB)."
  },
  saline_alkaline: {
    id: "saline_alkaline",
    name: "Saline & Alkaline Soil (Usar / Reh / Kallar)",
    hindiName: "लवणीय एवं क्षारीय मिट्टी",
    order: "Aridisols & Inceptisols",
    coveragePercent: 2.1,
    coverageAreaKm2: 68000,
    phRange: "8.5 – 10.2",
    phMedian: 9.1,
    texture: "Sandy Clay to Heavy Silt with salt encrustation",
    color: "Greyish White (White salt efflorescence)",
    drainage: "Extremely Poor (Impervious sodium layer)",
    moistureRetention: "Low effective moisture due to osmotic tension",
    organicCarbon: "0.10% – 0.30% (Very Low)",
    npkProfile: {
      nitrogen: "Critically Low",
      phosphorus: "Low to Moderate",
      potassium: "High (Excess soluble salts)",
      lime: "High (Calcareous sodium encrustation)"
    },
    micronutrients: {
      zinc: "Severely Deficient",
      iron: "Deficient due to high pH",
      manganese: "Low",
      boron: "Toxic levels in some saline zones"
    },
    geologicalOrigin: "Accumulation of sodium, calcium and magnesium salts due to capillary action, faulty canal irrigation or sea water ingress in coastal tracts.",
    suitableCrops: [
      { name: "Salt-Tolerant Rice (CSR varieties / Pokkali)", season: "Kharif", suitability: "High (Reclaimed)", yieldPotential: "3.2 - 4.5 t/ha" },
      { name: "Barley", season: "Rabi", suitability: "Very High", yieldPotential: "2.4 - 3.6 t/ha" },
      { name: "Sugar Beet", season: "Rabi", suitability: "High", yieldPotential: "35 - 55 t/ha" },
      { name: "Ber (Indian Jujube) & Aonla", season: "Perennial", suitability: "Optimal", yieldPotential: "8 - 15 t/ha" },
      { name: "Guava", season: "Perennial", suitability: "High", yieldPotential: "12 - 18 t/ha" },
      { name: "Dhaincha (Sesbania green manure)", season: "Summer / Pre-Kharif", suitability: "Optimal (Soil Restorer)", yieldPotential: "15 - 25 t/ha biomass" },
      { name: "Karnal Grass / Rhodes Grass", season: "Perennial", suitability: "Optimal", yieldPotential: "30 - 50 t/ha forage" }
    ],
    managementAdvisory: "Apply Gypsum (CaSO4.2H2O @ 5-10 t/ha) followed by intensive ponding and leaching to flush out sodium. Grow Dhaincha for green manuring.",
    majorBelts: "Rann of Kutch & coastal Saurashtra (Gujarat), canal-irrigated arid tracts of UP (Aligarh, Mainpuri, Etawah), Punjab, Haryana, and Sundarbans."
  },
  peaty_marshy: {
    id: "peaty_marshy",
    name: "Peaty & Marshy Soil (Kari / Histosols)",
    hindiName: "दलदली एवं जैविक मिट्टी",
    order: "Histosols",
    coveragePercent: 2.5,
    coverageAreaKm2: 82000,
    phRange: "3.5 – 5.5",
    phMedian: 4.4,
    texture: "Heavy Clayey with spongy organic mass",
    color: "Deep Black / Dark Blue",
    drainage: "Very Poor (Permanently waterlogged)",
    moistureRetention: "Very High (Water saturated)",
    organicCarbon: "10.0% – 40.0% (Exceptionally Rich in Humus)",
    npkProfile: {
      nitrogen: "Rich (Organic)",
      phosphorus: "Low (Deficient)",
      potassium: "Low to Moderate",
      lime: "Deficient"
    },
    micronutrients: {
      zinc: "Deficient",
      iron: "High (Ferrous iron toxicity)",
      manganese: "Low",
      boron: "Low"
    },
    geologicalOrigin: "Accumulation of huge amounts of organic matter and dead vegetation in poorly drained coastal lagoons, deltaic swamps, and humid depressions.",
    suitableCrops: [
      { name: "Deepwater Rice / Wetland Paddy", season: "Kharif / Mundakan", suitability: "Optimal", yieldPotential: "3.0 - 4.5 t/ha" },
      { name: "Jute", season: "Kharif", suitability: "Very High", yieldPotential: "2.5 - 3.2 t/ha" },
      { name: "Colocasia & Yam (Tubers)", season: "Kharif", suitability: "Very High", yieldPotential: "15 - 25 t/ha" },
      { name: "Aquatic Crops (Makhana / Fox Nut)", season: "Annual", suitability: "Optimal", yieldPotential: "2.0 - 3.2 t/ha" },
      { name: "Water Chestnut (Singhara)", season: "Autumn", suitability: "Optimal", yieldPotential: "8 - 14 t/ha" }
    ],
    managementAdvisory: "Construct raised beds and deep drainage canals. Apply lime (1.5 t/ha) and Phosphatic fertilizer (Rock phosphate/DAP) to buffer high acidity.",
    majorBelts: "Kuttanad Kari lands (Alappuzha & Kottayam in Kerala), Sundarbans mangrove swamp (West Bengal), Mahanadi delta (Odisha), North Bihar wetlands."
  }
};

/**
 * State Soil Breakdown Database (All 36 States & UTs)
 */
const stateSoilDatabase = {
  "andhra pradesh": {
    stateName: "Andhra Pradesh",
    soilHealthIndex: 78,
    predominantSoil: "Red & Yellow Soil",
    soilDistribution: [
      { type: "red_yellow", name: "Red & Yellow Soils", percent: 62, areaKm2: 101000 },
      { type: "black", name: "Black Cotton Soil", percent: 25, areaKm2: 40700 },
      { type: "alluvial", name: "Coastal Alluvial & Deltaic", percent: 9, areaKm2: 14700 },
      { type: "laterite", name: "Laterite Soils", percent: 4, areaKm2: 6500 }
    ],
    districtClusters: {
      "Black Cotton Belt": ["Guntur", "Kurnool", "Nandyal", "Palnadu", "Prakasam"],
      "Coastal Alluvial Delta": ["Krishna", "East Godavari", "West Godavari", "Dr. B.R. Ambedkar Konaseema", "Kakinada", "Eluru", "Bapatla"],
      "Red Sandy / Loamy Belt": ["Ananthapuramu", "Sri Sathya Sai", "Chittoor", "Tirupati", "Annamayya", "YSR Kadapa", "Srikakulam", "Vizianagaram", "SPSR Nellore"],
      "Laterite High Tracts": ["Alluri Sitharama Raju", "Parvathipuram Manyam", "Visakhapatnam", "Anakapalli"]
    },
    soilAdvisories: "Rayalaseema red soils need gypsum and organic mulching for moisture conservation; Krishna-Godavari alluvium requires balanced NPK with Zinc Sulphate."
  },
  "arunachal pradesh": {
    stateName: "Arunachal Pradesh",
    soilHealthIndex: 84,
    predominantSoil: "Mountain & Forest Soil",
    soilDistribution: [
      { type: "mountain_forest", name: "Mountain & Forest Soils", percent: 78, areaKm2: 65300 },
      { type: "red_yellow", name: "Red Loamy Soils", percent: 14, areaKm2: 11700 },
      { type: "alluvial", name: "Riverine Valley Alluvium", percent: 8, areaKm2: 6700 }
    ],
    districtClusters: {
      "Sub-Alpine Forest Soils": ["Tawang", "West Kameng", "Upper Subansiri", "Shi Yomi", "Siang", "Upper Siang", "Dibang Valley", "Anjaw"],
      "Valley Alluvial Basins": ["Papum Pare", "East Siang", "Lower Subansiri", "Namsai", "Lohit", "Changlang"]
    },
    soilAdvisories: "High organic humus present; practice terrace farming and avoid slash-and-burn (Jhum) on steep slopes to arrest topsoil leaching."
  },
  "assam": {
    stateName: "Assam",
    soilHealthIndex: 80,
    predominantSoil: "Alluvial Soil (Brahmaputra Valley)",
    soilDistribution: [
      { type: "alluvial", name: "Brahmaputra & Barak Alluvium", percent: 56, areaKm2: 43900 },
      { type: "red_yellow", name: "Red Loamy Hill Soils", percent: 26, areaKm2: 20400 },
      { type: "laterite", name: "Laterite Soils (Tea Belts)", percent: 18, areaKm2: 14100 }
    ],
    districtClusters: {
      "Brahmaputra Alluvial Basin": ["Kamrup", "Nagaon", "Sonitpur", "Darrang", "Barpeta", "Dhubri", "Golaghat", "Jorhat", "Lakhimpur", "Dhemaji"],
      "Laterite / Tea Hill Tracts": ["Dibrugarh", "Tinsukia", "Sivasagar", "Charaideo", "Cachar", "Karbi Anglong", "Dima Hasao"]
    },
    soilAdvisories: "Tea garden laterite soils require dolomite application (pH 4.8 - 5.5 is ideal for tea); riverine paddy soils benefit from silt deposition after floods."
  },
  "bihar": {
    stateName: "Bihar",
    soilHealthIndex: 82,
    predominantSoil: "Alluvial Soil (Gangetic Silt)",
    soilDistribution: [
      { type: "alluvial", name: "Gangetic Plain Alluvium (Khadar/Bhangar)", percent: 88, areaKm2: 82800 },
      { type: "peaty_marshy", name: "Terai & Marshy Wetland Soil", percent: 7, areaKm2: 6600 },
      { type: "red_yellow", name: "Southern Plateau Edge Red Soil", percent: 5, areaKm2: 4700 }
    ],
    districtClusters: {
      "North Bihar Khadar (New Alluvium)": ["Muzaffarpur", "Darbhanga", "Madhubani", "Samastipur", "Vaishali", "Saran", "Siwan", "Gopalganj", "Sitamarhi", "Purnia", "Katihar", "Kishanganj"],
      "South Bihar Bhangar (Old Alluvium)": ["Patna", "Gaya", "Nalanda", "Bhojpur", "Buxar", "Rohtas", "Kaimur", "Aurangabad", "Jehanabad", "Bhagalpur", "Munger"],
      "Terai Marshy Belt (Makhana / Jute)": ["Darbhanga", "Madhubani", "Saharsa", "Supaul", "Madhepura", "Araria", "Kishanganj"]
    },
    soilAdvisories: "Highly fertile deep alluvium; apply zinc sulphate for rice-wheat cropping system. Wetland tracts in North Bihar are ideal for Makhana."
  },
  "chhattisgarh": {
    stateName: "Chhattisgarh",
    soilHealthIndex: 75,
    predominantSoil: "Red & Yellow Soil (Matasi / Dorsa)",
    soilDistribution: [
      { type: "red_yellow", name: "Red & Yellow Soils (Matasi/Dorsa)", percent: 65, areaKm2: 87800 },
      { type: "laterite", name: "Laterite Soils (Bhata)", percent: 18, areaKm2: 24300 },
      { type: "black", name: "Black Soils (Kanhar)", percent: 17, areaKm2: 23000 }
    ],
    districtClusters: {
      "Kanhar Black Soil Basin": ["Raipur", "Durg", "Bemetara", "Rajnandgaon", "Bilaspur", "Janjgir-Champa"],
      "Matasi / Dorsa Red Plains": ["Balod", "Baloda Bazar", "Dhamtari", "Mahasamund", "Korba", "Raigarh", "Mungeli"],
      "Bastar Plateau & Laterite Hills": ["Bastar", "Dantewada", "Kanker", "Kondagaon", "Sukma", "Bijapur", "Narayanpur", "Surguja", "Jashpur"]
    },
    soilAdvisories: "Known as the 'Rice Bowl of Central India'; Matasi soils require organic compost and SSP to improve water retention and phosphorus availability."
  },
  "goa": {
    stateName: "Goa",
    soilHealthIndex: 77,
    predominantSoil: "Laterite Soil",
    soilDistribution: [
      { type: "laterite", name: "Laterite & High Gravelly Soils", percent: 76, areaKm2: 2810 },
      { type: "alluvial", name: "Coastal Sandy & Estuarine Silt", percent: 24, areaKm2: 890 }
    ],
    districtClusters: {
      "Laterite Horticultural Plateau": ["North Goa (Bicholim, Sattari, Ponda)", "South Goa (Sanguem, Quepem, Dharbandora)"],
      "Coastal Khazan Estuarine Silt": ["Tiswadi", "Bardez", "Salcete", "Mormugao", "Canacona"]
    },
    soilAdvisories: "Laterite soils are excellent for cashew, coconut, mango and spices; apply agricultural lime to reduce soil acidity."
  },
  "gujarat": {
    stateName: "Gujarat",
    soilHealthIndex: 79,
    predominantSoil: "Black Cotton Soil & Coastal Alluvium",
    soilDistribution: [
      { type: "black", name: "Medium to Deep Black Cotton Soil", percent: 42, areaKm2: 82300 },
      { type: "alluvial", name: "Goradu Alluvial / Sandy Loam", percent: 28, areaKm2: 54900 },
      { type: "arid_desert", name: "Desert & Sandy Soils", percent: 18, areaKm2: 35300 },
      { type: "saline_alkaline", name: "Coastal Saline & Rann Clay", percent: 12, areaKm2: 23500 }
    ],
    districtClusters: {
      "Deep Black Cotton & Soybean": ["Surat", "Bharuch", "Narmada", "Navsari", "Tapi", "Vadodara", "Rajkot", "Surendranagar", "Bhavnagar", "Amreli", "Junagadh"],
      "Goradu Alluvial / Dairy Belt": ["Ahmedabad", "Kheda", "Anand", "Gandhinagar", "Mehsana", "Patan", "Sabarkantha", "Aravalli"],
      "Arid & Saline Rann Zone": ["Kutch", "Banaskantha", "Patan", "Morbi", "Devbhumi Dwarka", "Porbandar", "Jamnagar"]
    },
    soilAdvisories: "South Gujarat black soils are prime for Cotton, Sugarcane and Banana; North Gujarat sandy-loam under drip irrigation leads in Groundnut, Castor, Cumin and Mustard."
  },
  "haryana": {
    stateName: "Haryana",
    soilHealthIndex: 81,
    predominantSoil: "Alluvial Soil",
    soilDistribution: [
      { type: "alluvial", name: "Indo-Gangetic Alluvial Plains", percent: 74, areaKm2: 32700 },
      { type: "arid_desert", name: "Light Sandy / Desert Soils", percent: 16, areaKm2: 7100 },
      { type: "saline_alkaline", name: "Saline & Alkaline Pockets", percent: 10, areaKm2: 4400 }
    ],
    districtClusters: {
      "Intensive Alluvial Grain Belt": ["Karnal", "Kurukshetra", "Ambala", "Yamunanagar", "Kaithal", "Panipat", "Sonipat", "Rohtak", "Jhajjar"],
      "South-Western Sandy Tracts": ["Sirsa", "Fatehabad", "Hisar", "Bhiwani", "Charkhi Dadri", "Mahendragarh", "Rewari"]
    },
    soilAdvisories: "Highly productive wheat-paddy and mustard belt; encourage crop rotation with pulses/sesbania to prevent organic carbon depletion and groundwater stress."
  },
  "himachal pradesh": {
    stateName: "Himachal Pradesh",
    soilHealthIndex: 85,
    predominantSoil: "Mountain & Forest Soil",
    soilDistribution: [
      { type: "mountain_forest", name: "Himalayan Forest & Brown Hill Soils", percent: 75, areaKm2: 41800 },
      { type: "alluvial", name: "Sub-Montane Alluvial Valleys", percent: 15, areaKm2: 8350 },
      { type: "arid_desert", name: "High Altitude Cold Desert Soil", percent: 10, areaKm2: 5570 }
    ],
    districtClusters: {
      "Temperate Apple & Fruit Belt": ["Shimla", "Kullu", "Mandi", "Kinnaur", "Chamba", "Sirmaur"],
      "Valley Alluvial Agriculture": ["Kangra", "Una", "Hamirpur", "Bilaspur", "Solan"],
      "Cold Desert Alpine Soil": ["Lahaul and Spiti", "Kinnaur (Upper)"]
    },
    soilAdvisories: "Hillsides have high humus; maintain orchard mulch, check soil pH (6.0 - 6.8 for apples), and prevent monsoon run-off."
  },
  "jharkhand": {
    stateName: "Jharkhand",
    soilHealthIndex: 72,
    predominantSoil: "Red & Yellow Soil",
    soilDistribution: [
      { type: "red_yellow", name: "Red Sandy & Loamy Soils", percent: 72, areaKm2: 57400 },
      { type: "laterite", name: "Laterite Soils (Pat region)", percent: 18, areaKm2: 14300 },
      { type: "black", name: "Black Soils (Rajmahal Trap)", percent: 10, areaKm2: 8000 }
    ],
    districtClusters: {
      "Chhota Nagpur Red Plateau": ["Ranchi", "Hazaribagh", "Ramgarh", "Bokaro", "Dhanbad", "Giridih", "Deoghar", "Dumka", "East Singhbhum", "West Singhbhum"],
      "Lateritic High Pat Lands": ["Latehar", "Gumla", "Lohardaga", "Palamu"],
      "Rajmahal Black Soil Trap": ["Sahebganj", "Pakur", "Godda"]
    },
    soilAdvisories: "Acidic red soils with low water retention; apply rock phosphate and lime, and promote rainwater harvesting ponds (Dobhas)."
  },
  "karnataka": {
    stateName: "Karnataka",
    soilHealthIndex: 79,
    predominantSoil: "Red Loamy & Deep Black Cotton Soil",
    soilDistribution: [
      { type: "red_yellow", name: "Red Loamy & Sandy Soils", percent: 48, areaKm2: 92000 },
      { type: "black", name: "Deep Black Cotton Soils (Deccan)", percent: 34, areaKm2: 65200 },
      { type: "laterite", name: "Laterite & Coastal Alluvium", percent: 18, areaKm2: 34600 }
    ],
    districtClusters: {
      "Northern Black Cotton Belt": ["Belagavi", "Vijayapura", "Bagalkote", "Dharwad", "Gadag", "Kalaburagi", "Raichur", "Ballari", "Koppal", "Bidar", "Yadgir"],
      "Southern Red Soil Ragi/Maize Belt": ["Bengaluru Urban", "Bengaluru Rural", "Tumakuru", "Kolar", "Chikkaballapura", "Mandya", "Mysuru", "Hassan", "Ramanagara", "Chamarajanagar", "Chitradurga", "Davanagere"],
      "Western Ghats Laterite Plantation": ["Chikkamagaluru", "Kodagu", "Shivamogga", "Uttara Kannada", "Udupi", "Dakshina Kannada"]
    },
    soilAdvisories: "Northern black tract is premier for Cotton, Jowar, Sunflower, Sugarcane and Tur; Malnad laterite plateau leads the nation in Coffee, Arecanut, Black Pepper and Rubber."
  },
  "kerala": {
    stateName: "Kerala",
    soilHealthIndex: 82,
    predominantSoil: "Laterite & Coastal Alluvium",
    soilDistribution: [
      { type: "laterite", name: "Laterite Soil (Midland / Foothills)", percent: 65, areaKm2: 25200 },
      { type: "mountain_forest", name: "Highland Forest & Peat Soils", percent: 20, areaKm2: 7770 },
      { type: "alluvial", name: "Coastal Alluvium & Beach Sand", percent: 10, areaKm2: 3890 },
      { type: "peaty_marshy", name: "Kari / Peaty Soils (Kuttanad)", percent: 5, areaKm2: 1940 }
    ],
    districtClusters: {
      "Midland Laterite Plantation Zone": ["Kottayam", "Ernakulam", "Thrissur", "Malappuram", "Kozhikode", "Kannur", "Kasaragod", "Kollam", "Pathanamthitta"],
      "Highland Spices & Tea Belt": ["Idukki", "Wayanad", "Palakkad (Attappadi)"],
      "Kuttanad Kari Wetland (Below Sea-Level)": ["Alappuzha", "Kottayam"]
    },
    soilAdvisories: "Strongly acidic soils (pH 4.5 - 5.5); mandatory application of dolomite/lime for vegetable and paddy farming. Ideal terroir for Rubber, Cardamom, Black Pepper and Tea."
  },
  "madhya pradesh": {
    stateName: "Madhya Pradesh",
    soilHealthIndex: 81,
    predominantSoil: "Black Soil & Alluvial Plains",
    soilDistribution: [
      { type: "black", name: "Medium & Deep Black Soils (Malwa/Narmada)", percent: 47, areaKm2: 144800 },
      { type: "red_yellow", name: "Red & Yellow Soils (Bundelkhand/Baghelkhand)", percent: 36, areaKm2: 110900 },
      { type: "alluvial", name: "Chambal Valley Alluvium", percent: 17, areaKm2: 52300 }
    ],
    districtClusters: {
      "Malwa Plateau Black Soil (Soybean/Wheat)": ["Indore", "Ujjain", "Dewas", "Dhar", "Ratlam", "Mandsaur", "Neemuch", "Shajapur", "Sehore", "Bhopal", "Harda", "Hoshangabad (Narmadapuram)"],
      "Chambal Alluvial Mustard Basin": ["Morena", "Bhind", "Sheopur", "Gwalior", "Guna", "Shivpuri"],
      "Bundelkhand & Baghelkhand Red Belt": ["Sagar", "Damoh", "Tikamgarh", "Chhatarpur", "Panna", "Satna", "Rewa", "Sidhi", "Singrauli", "Shahdol", "Jabalpur", "Katni", "Mandla", "Dindori", "Balaghat", "Seoni", "Chhindwara"]
    },
    soilAdvisories: "India's 'Soybean State' and premier pulse hub; deep black soils produce world-famous Sharbati wheat. Adopt broad-bed furrows in rainy season."
  },
  "maharashtra": {
    stateName: "Maharashtra",
    soilHealthIndex: 80,
    predominantSoil: "Black Cotton Soil (Regur / Vertisols)",
    soilDistribution: [
      { type: "black", name: "Deep & Medium Black Soil (Deccan Traps)", percent: 78, areaKm2: 240000 },
      { type: "laterite", name: "Laterite Soils (Konkan & Western Ghats)", percent: 14, areaKm2: 43000 },
      { type: "red_yellow", name: "Red Loamy Soils (Vidarbha East)", percent: 8, areaKm2: 24700 }
    ],
    districtClusters: {
      "Vidarbha & Marathwada Cotton/Soybean": ["Yavatmal", "Amravati", "Akola", "Buldhana", "Washim", "Wardha", "Nagpur", "Nanded", "Latur", "Parbhani", "Hingoli", "Jalna", "Chhatrapati Sambhajinagar", "Beed", "Dharashiv"],
      "Western Maharashtra Sugarcane/Grape/Onion": ["Pune", "Nashik", "Ahmednagar", "Solapur", "Satara", "Sangli", "Kolhapur", "Jalgaon", "Dhule"],
      "Konkan Coastal Laterite (Alphonso Mango/Cashew)": ["Ratnagiri", "Sindhudurg", "Raigad", "Thane", "Palghar"]
    },
    soilAdvisories: "Exceptional clay soils rich in Potash and Lime; prime producer of Cotton, Sugarcane, Soybean, Onions, Pomegranates, and Alphonso Mangoes. Requires efficient drainage during heavy rains."
  },
  "manipur": {
    stateName: "Manipur",
    soilHealthIndex: 78,
    predominantSoil: "Red Loamy & Mountain Soil",
    soilDistribution: [
      { type: "red_yellow", name: "Red Ferruginous Soils", percent: 60, areaKm2: 13400 },
      { type: "alluvial", name: "Imphal Valley Alluvium", percent: 25, areaKm2: 5580 },
      { type: "peaty_marshy", name: "Peaty Swamp Soils (Loktak Lake)", percent: 15, areaKm2: 3350 }
    ],
    districtClusters: {
      "Imphal Valley Alluvial Belt": ["Imphal East", "Imphal West", "Thoubal", "Kakching", "Bishnupur"],
      "Hill Forest & Red Loam": ["Churachandpur", "Ukhrul", "Senapati", "Tamenglong", "Chandel", "Kangpokpi", "Noney", "Pherzawl", "Kamjong", "Tengnoupal"]
    },
    soilAdvisories: "Valley alluvium is ideal for aromatic Chak-Hao (Black Rice); hill tracts benefit from organic ginger and turmeric cultivation."
  },
  "meghalaya": {
    stateName: "Meghalaya",
    soilHealthIndex: 82,
    predominantSoil: "Laterite & Red Loamy Soil",
    soilDistribution: [
      { type: "laterite", name: "Laterite & Acidic High Soils", percent: 55, areaKm2: 12300 },
      { type: "red_yellow", name: "Red Loamy Forest Soils", percent: 35, areaKm2: 7850 },
      { type: "alluvial", name: "Valley Strip Alluvium", percent: 10, areaKm2: 2240 }
    ],
    districtClusters: {
      "High Rainfall Plateau Laterite": ["East Khasi Hills", "West Khasi Hills", "South West Khasi Hills", "Eastern West Khasi Hills", "Ri-Bhoi"],
      "Garo Hills Spices & Plantation": ["East Garo Hills", "West Garo Hills", "South Garo Hills", "North Garo Hills", "South West Garo Hills"],
      "Jaintia Hills Lakadong Turmeric": ["East Jaintia Hills", "West Jaintia Hills"]
    },
    soilAdvisories: "World-renowned for Lakadong Turmeric (high curcumin >7%); acidic soil benefits from organic manures and bio-fertilizers."
  },
  "mizoram": {
    stateName: "Mizoram",
    soilHealthIndex: 79,
    predominantSoil: "Red Loamy & Mountain Soil",
    soilDistribution: [
      { type: "red_yellow", name: "Red & Yellow Loamy Soils", percent: 68, areaKm2: 14300 },
      { type: "mountain_forest", name: "Steep Mountain Forest Soils", percent: 24, areaKm2: 5060 },
      { type: "alluvial", name: "Narrow Valley Alluvium", percent: 8, areaKm2: 1690 }
    ],
    districtClusters: {
      "Central Highland Horticulture": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Mamit", "Lawngtlai", "Siaha", "Saitual", "Khawzawl", "Hnahthial"]
    },
    soilAdvisories: "Ideal for Anthurium flowers, ginger, passion fruit and bird's eye chili; maintain terrace bunding against slope wash."
  },
  "nagaland": {
    stateName: "Nagaland",
    soilHealthIndex: 81,
    predominantSoil: "Red Loamy & Mountain Forest Soil",
    soilDistribution: [
      { type: "red_yellow", name: "Red & Brown Forest Soils", percent: 70, areaKm2: 11600 },
      { type: "mountain_forest", name: "High Mountain Soils", percent: 22, areaKm2: 3650 },
      { type: "alluvial", name: "Foothill Alluvium (Dimapur)", percent: 8, areaKm2: 1330 }
    ],
    districtClusters: {
      "Dimapur Foothill Alluvial Plain": ["Dimapur", "Chümoukedima", "Niuland"],
      "Highland Terraced Belt": ["Kohima", "Mokokchung", "Wokha", "Zunheboto", "Phek", "Tuensang", "Mon", "Longleng", "Kiphire", "Peren", "Noklak", "Shamator", "Tseminyu"]
    },
    soilAdvisories: "Rich in organic carbon; home to Naga King Chili (Bhut Jolokia) and organic cardamom. Practice contour terrace farming."
  },
  "odisha": {
    stateName: "Odisha",
    soilHealthIndex: 77,
    predominantSoil: "Red Soil & Coastal Alluvium",
    soilDistribution: [
      { type: "red_yellow", name: "Red & Yellow Sandy Loams", percent: 54, areaKm2: 84100 },
      { type: "alluvial", name: "Coastal Deltaic Alluvium (Mahanadi)", percent: 22, areaKm2: 34200 },
      { type: "laterite", name: "Laterite Soils (Eastern Ghats)", percent: 16, areaKm2: 24900 },
      { type: "black", name: "Black Soils (Tel & Ib River basins)", percent: 8, areaKm2: 12500 }
    ],
    districtClusters: {
      "Mahanadi Delta Alluvial Rice Belt": ["Cuttack", "Puri", "Jagatsinghpur", "Kendrapara", "Balasore", "Bhadrak", "Jajpur", "Ganjam"],
      "Western Plateau Black / Red Belt": ["Bargarh", "Sambalpur", "Bolangir", "Subarnapur", "Kalahandi", "Nuapada", "Jharsuguda", "Sundargarh"],
      "Eastern Ghats Laterite & Red Hill": ["Koraput", "Rayagada", "Nabarangpur", "Malkangiri", "Kandhamal", "Gajapati", "Mayurbhanj", "Kendujhar"]
    },
    soilAdvisories: "Coastal alluvium produces bumper paddy yields; Kandhamal turmeric and Koraput coffee thrive in Eastern Ghats laterite."
  },
  "punjab": {
    stateName: "Punjab",
    soilHealthIndex: 82,
    predominantSoil: "Alluvial Soil (Indo-Gangetic Silt Loam)",
    soilDistribution: [
      { type: "alluvial", name: "Fertile Floodplain Alluvium", percent: 82, areaKm2: 41300 },
      { type: "arid_desert", name: "South-Western Desert Sand / Light Loam", percent: 13, areaKm2: 6550 },
      { type: "mountain_forest", name: "Sub-Himalayan Kandi Soil", percent: 5, areaKm2: 2510 }
    ],
    districtClusters: {
      "Central Majha & Doaba Alluvial Grain Bowl": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Sangrur", "Gurdaspur", "Kapurthala", "Hoshiarpur", "Fatehgarh Sahib", "Tarn Taran", "SBS Nagar", "Rupnagar", "SAS Nagar", "Malerkotla"],
      "South-Western Malwa Cotton & Kinnow Belt": ["Bathinda", "Mansa", "Fazilka", "Sri Muktsar Sahib", "Faridkot", "Firozpur", "Moga", "Barnala"]
    },
    soilAdvisories: "India's 'Granary'; intensively cultivated wheat-paddy cycle requires balanced micronutrient replenishment (Zinc, Manganese) and direct-seeded rice (DSR) to conserve groundwater."
  },
  "rajasthan": {
    stateName: "Rajasthan",
    soilHealthIndex: 74,
    predominantSoil: "Arid & Desert Soil / Sandy Loam",
    soilDistribution: [
      { type: "arid_desert", name: "Thar Desert & Sandy Soils", percent: 58, areaKm2: 198500 },
      { type: "alluvial", name: "Eastern Alluvial Plains (Chambal/Banas)", percent: 20, areaKm2: 68400 },
      { type: "red_yellow", name: "Red & Yellow Hill Soils (Aravalli)", percent: 14, areaKm2: 47900 },
      { type: "black", name: "Black Cotton Soil (Hadoti Region)", percent: 8, areaKm2: 27400 }
    ],
    districtClusters: {
      "Thar Desert Bajra/Guar/Cumin": ["Jaisalmer", "Bikaner", "Barmer", "Jodhpur", "Nagaur", "Churu", "Sriganganagar", "Hanumangarh", "Jalore", "Pali"],
      "Hadoti Black Soil Soybean/Coriander": ["Kota", "Baran", "Bundi", "Jhalawar"],
      "Eastern Alluvial Mustard/Wheat": ["Jaipur", "Alwar", "Bharatpur", "Dausa", "Dholpur", "Karauli", "Sawai Madhopur", "Tonk", "Sikar", "Jhunjhunu"],
      "Mewar & Aravalli Red Soil Zone": ["Udaipur", "Chittorgarh", "Bhilwara", "Rajsamand", "Banswara", "Dungarpur", "Pratapgarh", "Sirohi"]
    },
    soilAdvisories: "Leading state in Mustard, Bajra, Guar, Cumin, Coriander and Isabgol. Indira Gandhi Canal transforms desert soil; adopt solar-powered drip irrigation."
  },
  "sikkim": {
    stateName: "Sikkim",
    soilHealthIndex: 90,
    predominantSoil: "Mountain & Forest Soil",
    soilDistribution: [
      { type: "mountain_forest", name: "High Himalayan Humus Rich Soil", percent: 85, areaKm2: 6030 },
      { type: "red_yellow", name: "Valley Red Loamy Soils", percent: 15, areaKm2: 1060 }
    ],
    districtClusters: {
      "Organic Large Cardamom & Ginger Belt": ["East Sikkim (Gangtok, Pakyong)", "West Sikkim (Gyalshing, Soreng)", "South Sikkim (Namchi)", "North Sikkim (Mangan)"]
    },
    soilAdvisories: "100% Certified Organic State; rich natural compost and humus. Prime terroir for Large Cardamom, Ginger, Buckwheat and Kiwi."
  },
  "tamil nadu": {
    stateName: "Tamil Nadu",
    soilHealthIndex: 78,
    predominantSoil: "Red Loamy & Black Cotton Soil",
    soilDistribution: [
      { type: "red_yellow", name: "Red Loamy & Sandy Soils", percent: 62, areaKm2: 80600 },
      { type: "black", name: "Black Cotton Soils (Regur)", percent: 18, areaKm2: 23400 },
      { type: "alluvial", name: "Cauvery Deltaic Alluvium", percent: 12, areaKm2: 15600 },
      { type: "laterite", name: "Laterite & Coastal Soils", percent: 8, areaKm2: 10400 }
    ],
    districtClusters: {
      "Cauvery Delta Paddy Rice Bowl": ["Thanjavur", "Tiruvarur", "Nagapattinam", "Mayiladuthurai", "Tiruchirappalli", "Cuddalore"],
      "Black Soil Cotton / Oilseed Tract": ["Coimbatore", "Tiruppur", "Erode", "Madurai", "Virudhunagar", "Thoothukudi", "Tirunelveli", "Tenkasi", "Dindigul"],
      "Red Soil Groundnut / Horticulture": ["Salem", "Namakkal", "Dharmapuri", "Krishnagiri", "Vellore", "Tirupattur", "Ranipet", "Tiruvannamalai", "Villupuram", "Kallakurichi", "Pudukkottai", "Sivaganga", "Ramanathapuram"],
      "Plantation Laterite & Hills": ["The Nilgiris", "Kanyakumari", "Dindigul (Kodaikanal)", "Salem (Yercaud)"]
    },
    soilAdvisories: "Cauvery delta delivers multiple paddy harvests (Kuruvai / Thaladi / Samba); western black tract is Tamil Nadu's textile cotton and turmeric heartland."
  },
  "telangana": {
    stateName: "Telangana",
    soilHealthIndex: 79,
    predominantSoil: "Red Sandy (Chalka) & Black Cotton Soil",
    soilDistribution: [
      { type: "red_yellow", name: "Red Sandy Loams (Chalka/Dubba)", percent: 55, areaKm2: 61700 },
      { type: "black", name: "Deep & Medium Black Soils", percent: 35, areaKm2: 39200 },
      { type: "alluvial", name: "Godavari & Krishna Riverine Silt", percent: 10, areaKm2: 11200 }
    ],
    districtClusters: {
      "Black Cotton & Soybean Belt": ["Adilabad", "Komaram Bheem Asifabad", "Mancherial", "Nirmal", "Nizamabad", "Kamareddy", "Khammam", "Bhadradri Kothagudem"],
      "Chalka Red Soil Rice / Cotton / Maize": ["Warangal", "Hanamkonda", "Karimnagar", "Peddapalli", "Jagtial", "Rajanna Sircilla", "Siddipet", "Medak", "Sangareddy", "Nalgonda", "Suryapet", "Yadadri Bhuvanagiri", "Mahabubnagar", "Nagarkurnool", "Wanaparthy", "Jogulamba Gadwal", "Narayanpet", "Vikarabad", "Rangareddy", "Medchal-Malkajgiri"]
    },
    soilAdvisories: "Kaleshwaram Lift Irrigation has enriched water availability across red Chalka soils, boosting Cotton, Paddy, Maize, Red Gram and Chilli."
  },
  "tripura": {
    stateName: "Tripura",
    soilHealthIndex: 80,
    predominantSoil: "Red Loamy & Valley Alluvium",
    soilDistribution: [
      { type: "red_yellow", name: "Red Sandy Loams (Tilla lands)", percent: 65, areaKm2: 6820 },
      { type: "alluvial", name: "Valley Alluvium (Lunga lands)", percent: 35, areaKm2: 3670 }
    ],
    districtClusters: {
      "Tilla / Lunga Agro-Ecosystem": ["West Tripura", "Sepahijala", "Khowai", "Gomati", "South Tripura", "North Tripura", "Unakoti", "Dhalai"]
    },
    soilAdvisories: "Tilla (upland) soils excel in Natural Rubber, Tea and Queen Pineapple; Lunga (lowland) alluvium is dedicated to wetland paddy."
  },
  "uttar pradesh": {
    stateName: "Uttar Pradesh",
    soilHealthIndex: 83,
    predominantSoil: "Alluvial Soil (Indo-Gangetic Plain)",
    soilDistribution: [
      { type: "alluvial", name: "Deep Ganga-Yamuna Alluvium (Bhangar/Khadar)", percent: 84, areaKm2: 202400 },
      { type: "red_yellow", name: "Bundelkhand Red / Mixed Soils", percent: 10, areaKm2: 24100 },
      { type: "saline_alkaline", name: "Saline & Alkaline (Usar) Pockets", percent: 6, areaKm2: 14500 }
    ],
    districtClusters: {
      "Western Sugarcane & Wheat Belt": ["Meerut", "Muzaffarnagar", "Shamli", "Saharanpur", "Baghpat", "Bulandshahr", "Ghaziabad", "Hapur", "Gautam Buddha Nagar", "Aligarh", "Mathura", "Agra", "Bareilly", "Moradabad", "Bijnor", "Rampur", "Pilibhit", "Shahjahanpur"],
      "Central & Eastern Paddy/Potato/Pulses": ["Lucknow", "Kanpur Nagar", "Kanpur Dehat", "Ayodhya", "Prayagraj", "Varanasi", "Gorakhpur", "Azamgarh", "Jaunpur", "Ghazipur", "Deoria", "Kushinagar", "Maharajganj", "Basti", "Siddharthnagar", "Barabanki", "Sitapur", "Hardoi", "Lakhimpur Kheri", "Unnao", "Rae Bareli", "Sultanpur", "Amethi"],
      "Bundelkhand Pulse & Oilseed Zone": ["Jhansi", "Lalitpur", "Jalaun", "Hamirpur", "Mahoba", "Banda", "Chitrakoot", "Mirzapur", "Sonbhadra"]
    },
    soilAdvisories: "India's highest producer of Sugarcane, Wheat, and Potato. Reclaim alkaline Usar soils with gypsum; apply balanced zinc-urea for bumper foodgrain harvests."
  },
  "uttarakhand": {
    stateName: "Uttarakhand",
    soilHealthIndex: 84,
    predominantSoil: "Mountain & Forest Soil",
    soilDistribution: [
      { type: "mountain_forest", name: "Brown Forest & Mountain Soils", percent: 70, areaKm2: 37400 },
      { type: "alluvial", name: "Terai-Bhabar Alluvial Plain", percent: 22, areaKm2: 11800 },
      { type: "arid_desert", name: "Sub-Alpine Cold Desert Soil", percent: 8, areaKm2: 4280 }
    ],
    districtClusters: {
      "Terai-Bhabar Intensive Grain & Cane Bowl": ["Udham Singh Nagar", "Haridwar", "Dehradun (Plains)", "Nainital (Haldwani)"],
      "Garhwal & Kumaon Mountain Horticulture": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Uttarkashi"]
    },
    soilAdvisories: "Terai belt (US Nagar) is a high-yielding seed hub for Basmati Rice and Sugarcane; hills produce organic millets (Mandua/Jhangora), kidney beans (Rajma) and apples."
  },
  "west bengal": {
    stateName: "West Bengal",
    soilHealthIndex: 82,
    predominantSoil: "Alluvial Soil & Deltaic Clay",
    soilDistribution: [
      { type: "alluvial", name: "Gangetic & Deltaic Alluvium", percent: 68, areaKm2: 60300 },
      { type: "red_yellow", name: "Rarh Red & Laterite Soils", percent: 18, areaKm2: 16000 },
      { type: "peaty_marshy", name: "Coastal Saline & Mangrove Swamp (Sundarbans)", percent: 8, areaKm2: 7100 },
      { type: "mountain_forest", name: "Darjeeling Himalayan Brown Forest Soil", percent: 6, areaKm2: 5320 }
    ],
    districtClusters: {
      "Gangetic Alluvial Rice & Jute Bowl": ["Burdwan (Purba Bardhaman)", "Hooghly", "Nadia", "Murshidabad", "North 24 Parganas", "South 24 Parganas", "Howrah", "Malda", "Uttar Dinajpur", "Dakshin Dinajpur", "Birbhum"],
      "Darjeeling & Dooars Tea Belt": ["Darjeeling", "Kalimpong", "Jalpaiguri", "Alipurduar", "Cooch Behar"],
      "Rarh Red Plateau Edge": ["Bankura", "Purulia", "Paschim Bardhaman", "Jhargram", "Paschim Medinipur", "Purba Medinipur"]
    },
    soilAdvisories: "India's #1 Rice and Jute producing state; Purba Bardhaman is known as the 'Rice Bowl of Bengal'. Darjeeling soils produce world-famous GI-tagged orthodox tea."
  },
  "delhi": {
    stateName: "Delhi (NCT)",
    soilHealthIndex: 76,
    predominantSoil: "Alluvial Soil (Yamuna Floodplain)",
    soilDistribution: [
      { type: "alluvial", name: "Yamuna Alluvial Loam", percent: 75, areaKm2: 1110 },
      { type: "red_yellow", name: "Aravalli Ridge Rocky Loam", percent: 25, areaKm2: 373 }
    ],
    districtClusters: {
      "Yamuna Khadar Peri-Urban Agriculture": ["North Delhi", "North West Delhi", "South West Delhi (Najafgarh)", "East Delhi", "Shahdara"]
    },
    soilAdvisories: "Peri-urban vegetable and floriculture belt; monitor soil for industrial heavy metals in floodplain tracts."
  },
  "jammu & kashmir": {
    stateName: "Jammu and Kashmir",
    soilHealthIndex: 86,
    predominantSoil: "Mountain Soil & Karewa Lacustrine Silt",
    soilDistribution: [
      { type: "mountain_forest", name: "Mountain Forest & Karewa Silt (Wudur)", percent: 68, areaKm2: 28700 },
      { type: "alluvial", name: "Jammu Plains Alluvium", percent: 32, areaKm2: 13500 }
    ],
    districtClusters: {
      "Kashmir Valley Karewa Saffron & Apple Belt": ["Pulwama (Pampore)", "Srinagar", "Budgam", "Baramulla", "Anantnag", "Kulgam", "Shopian", "Bandipora", "Ganderbal", "Kupwara"],
      "Jammu Sub-Tropical Grain Bowl": ["Jammu", "Samba", "Kathua", "Udhampur", "Reasi", "Rajouri", "Poonch", "Ramban", "Doda", "Kishtwar"]
    },
    soilAdvisories: "Karewa soils (ancient lake bed silt) of Pampore are the exclusive natural habitat for GI-tagged Kashmiri Saffron; sub-alpine slopes produce world-class apples and walnuts."
  },
  "ladakh": {
    stateName: "Ladakh",
    soilHealthIndex: 78,
    predominantSoil: "Cold Arid Desert Mountain Soil",
    soilDistribution: [
      { type: "arid_desert", name: "High Altitude Cold Desert Sandy Gravel", percent: 85, areaKm2: 50200 },
      { type: "alluvial", name: "Indus & Nubra River Valley Silt", percent: 15, areaKm2: 8900 }
    ],
    districtClusters: {
      "Indus & Nubra River Oasis Belt": ["Leh", "Kargil"]
    },
    soilAdvisories: "Glacial meltwater irrigation supports Seabuckthorn, Apricots (Raktsey Karpo), barley and high-altitude alfalfa."
  },
  "puducherry": {
    stateName: "Puducherry",
    soilHealthIndex: 79,
    predominantSoil: "Coastal Alluvial & Red Sandy Soil",
    soilDistribution: [
      { type: "alluvial", name: "Coastal Alluvial Silt", percent: 65, areaKm2: 318 },
      { type: "red_yellow", name: "Red Sandy Loam", percent: 35, areaKm2: 172 }
    ],
    districtClusters: {
      "Coastal Agriculture Enclaves": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
    },
    soilAdvisories: "Karaikal delta is prime for paddy and pulses; Puducherry and Yanam support sugarcane, coconut and floriculture."
  },
  "chandigarh": {
    stateName: "Chandigarh",
    soilHealthIndex: 82,
    predominantSoil: "Alluvial Soil (Siwalik Piedmont)",
    soilDistribution: [
      { type: "alluvial", name: "Siwalik Alluvial Sandy Loam", percent: 100, areaKm2: 114 }
    ],
    districtClusters: {
      "Urban & Peri-Urban Zone": ["Chandigarh"]
    },
    soilAdvisories: "High fertility; maintained under institutional green belts, nurseries and urban agro-gardens."
  },
  "andaman & nicobar islands": {
    stateName: "Andaman & Nicobar Islands",
    soilHealthIndex: 83,
    predominantSoil: "Tropical Forest & Coastal Sandy Soil",
    soilDistribution: [
      { type: "mountain_forest", name: "Tropical Humus Forest Soils", percent: 72, areaKm2: 5940 },
      { type: "alluvial", name: "Coastal Sandy & Mangrove Silt", percent: 28, areaKm2: 2310 }
    ],
    districtClusters: {
      "Island Plantation & Spices": ["South Andaman", "North and Middle Andaman", "Nicobar"]
    },
    soilAdvisories: "Heavy tropical rainfall; excellent for Coconut, Arecanut, Black Pepper, Cinnamon, Clove and Rubber."
  },
  "dadra and nagar haveli and daman and diu": {
    stateName: "Dadra & Nagar Haveli and Daman & Diu",
    soilHealthIndex: 79,
    predominantSoil: "Black Cotton & Coastal Alluvial Soil",
    soilDistribution: [
      { type: "black", name: "Medium Black Soils", percent: 55, areaKm2: 331 },
      { type: "alluvial", name: "Coastal Sandy Alluvium", percent: 45, areaKm2: 271 }
    ],
    districtClusters: {
      "Western Coastal Agro-Pockets": ["Dadra and Nagar Haveli", "Daman", "Diu"]
    },
    soilAdvisories: "Supports paddy, ragi, pulses, sapota (chiku) and coastal coconut plantations."
  },
  "lakshadweep": {
    stateName: "Lakshadweep",
    soilHealthIndex: 74,
    predominantSoil: "Coral Sandy & Calcareous Soil",
    soilDistribution: [
      { type: "arid_desert", name: "Coral Sand & Highly Calcareous Marine Soil", percent: 100, areaKm2: 32 }
    ],
    districtClusters: {
      "Coral Atolls": ["Lakshadweep"]
    },
    soilAdvisories: "Highly alkaline coral sand enriched with organic coconut peat; 100% organic coconut cultivation."
  }
};

/**
 * Reverse Crop Search & District Harvest Database (30+ Major Indian Crops)
 * Detailed state-wise producing districts, harvest calendar, soil requirements, and yield.
 */
const cropHarvestDatabase = {
  rice: {
    id: "rice",
    name: "Rice (Paddy)",
    hindiName: "धान / चावल",
    category: "Cereals & Foodgrains",
    icon: "🌾",
    idealSoil: "Alluvial Soil (Silty Clay Loam), Heavy Clayey Black Soil, Wetland Kari Peat",
    soilPh: "5.5 – 7.5",
    temperature: "22°C – 37°C",
    rainfall: "1200 – 2500 mm (Requires standing water / assured irrigation)",
    season: "Kharif (Aman), Summer (Boro), Autumn (Aus)",
    harvestMonths: "October – December (Kharif) | April – May (Boro)",
    nationalShare: "India is #1 Global Exporter & #2 Producer (135+ Million Metric Tonnes)",
    producingStates: [
      {
        state: "West Bengal",
        sharePercent: 13.8,
        harvestSeason: "Oct - Jan (Aman) & Apr - May (Boro)",
        majorDistricts: ["Purba Bardhaman", "Hooghly", "Nadia", "Murshidabad", "North 24 Parganas", "South 24 Parganas", "Birbhum", "Midnapore", "Malda"]
      },
      {
        state: "Uttar Pradesh",
        sharePercent: 12.5,
        harvestSeason: "October - November",
        majorDistricts: ["Shahjahanpur", "Pilibhit", "Lakhimpur Kheri", "Gorakhpur", "Maharajganj", "Barabanki", "Bijnor", "Saharanpur", "Prayagraj", "Varanasi"]
      },
      {
        state: "Punjab",
        sharePercent: 11.2,
        harvestSeason: "October - November",
        majorDistricts: ["Ludhiana", "Patiala", "Sangrur", "Amritsar", "Jalandhar", "Firozpur", "Tarn Taran", "Gurdaspur", "Kapurthala", "Bathinda"]
      },
      {
        state: "Andhra Pradesh",
        sharePercent: 7.9,
        harvestSeason: "November - January & Apr - May",
        majorDistricts: ["West Godavari", "East Godavari", "Krishna", "Guntur", "Dr. B.R. Ambedkar Konaseema", "Kakinada", "Eluru", "Bapatla", "SPSR Nellore"]
      },
      {
        state: "Telangana",
        sharePercent: 7.6,
        harvestSeason: "Nov - Dec (Vanakaalam) & Apr - May (Yasangi)",
        majorDistricts: ["Nalgonda", "Suryapet", "Nizamabad", "Karimnagar", "Peddapalli", "Khammam", "Warangal", "Jagtial", "Bhadradri Kothagudem"]
      },
      {
        state: "Odisha",
        sharePercent: 7.1,
        harvestSeason: "November - January",
        majorDistricts: ["Bargarh", "Sambalpur", "Balasore", "Ganjam", "Kalahandi", "Cuttack", "Puri", "Bhadrak", "Jajpur", "Subarnapur"]
      },
      {
        state: "Bihar",
        sharePercent: 6.2,
        harvestSeason: "November - December",
        majorDistricts: ["Rohtas", "Kaimur", "Buxar", "Bhojpur", "Patna", "West Champaran", "Katihar", "Purnia", "Darbhanga"]
      },
      {
        state: "Tamil Nadu",
        sharePercent: 5.8,
        harvestSeason: "Jan - Feb (Samba) & Sep - Oct (Kuruvai)",
        majorDistricts: ["Thanjavur", "Tiruvarur", "Nagapattinam", "Mayiladuthurai", "Cuddalore", "Tiruchirappalli", "Villupuram", "Tirunelveli"]
      }
    ]
  },
  wheat: {
    id: "wheat",
    name: "Wheat",
    hindiName: "गेहूं",
    category: "Cereals & Foodgrains",
    icon: "🌾",
    idealSoil: "Well-drained Alluvial Loam, Deep Black Clayey Loam (Regur / Malwa Vertisols)",
    soilPh: "6.0 – 7.8",
    temperature: "10°C – 15°C (Sowing) | 21°C – 26°C (Ripening)",
    rainfall: "750 – 1000 mm (Cool winter with bright sunshine)",
    season: "Rabi",
    harvestMonths: "March – May",
    nationalShare: "India is #2 Global Producer (112+ Million Metric Tonnes)",
    producingStates: [
      {
        state: "Uttar Pradesh",
        sharePercent: 32.4,
        harvestSeason: "March - April",
        majorDistricts: ["Aligarh", "Mathura", "Bulandshahr", "Meerut", "Agra", "Bareilly", "Shahjahanpur", "Hardoi", "Lakhimpur Kheri", "Moradabad", "Budaun", "Muzaffarnagar"]
      },
      {
        state: "Madhya Pradesh",
        sharePercent: 19.8,
        harvestSeason: "March - April (Famous for Sharbati & Durum Wheat)",
        majorDistricts: ["Hoshangabad (Narmadapuram)", "Sehore", "Harda", "Ujjain", "Dewas", "Dhar", "Indore", "Raisen", "Vidisha", "Sagar"]
      },
      {
        state: "Punjab",
        sharePercent: 16.5,
        harvestSeason: "April - May (Highest Productivity ~5.2 t/ha)",
        majorDistricts: ["Ludhiana", "Patiala", "Sangrur", "Amritsar", "Jalandhar", "Bathinda", "Firozpur", "Gurdaspur", "Moga", "Fazilka"]
      },
      {
        state: "Haryana",
        sharePercent: 11.8,
        harvestSeason: "April - May",
        majorDistricts: ["Karnal", "Kurukshetra", "Sirsa", "Hisar", "Kaithal", "Jind", "Fatehabad", "Ambala", "Panipat", "Sonipat"]
      },
      {
        state: "Rajasthan",
        sharePercent: 9.4,
        harvestSeason: "March - April",
        majorDistricts: ["Sriganganagar", "Hanumangarh", "Alwar", "Bharatpur", "Jaipur", "Kota", "Baran", "Tonk", "Bhilwara"]
      },
      {
        state: "Bihar",
        sharePercent: 5.6,
        harvestSeason: "March - April",
        majorDistricts: ["Rohtas", "Kaimur", "Bhojpur", "Buxar", "Patna", "Siwan", "Gopalganj", "West Champaran"]
      }
    ]
  },
  cotton: {
    id: "cotton",
    name: "Cotton (White Gold)",
    hindiName: "कपास / रुई",
    category: "Cash & Fiber Crops",
    icon: "🌱",
    idealSoil: "Deep Black Cotton Soil (Regur / Vertisols), Well-drained Alluvial Sandy Loam",
    soilPh: "7.0 – 8.5",
    temperature: "21°C – 32°C (Minimum 180-200 frost-free days)",
    rainfall: "500 – 1000 mm (Moisture retentive soil crucial)",
    season: "Kharif",
    harvestMonths: "October – February",
    nationalShare: "India is #1 Global Producer & Largest Acreage (~13 Million Hectares)",
    producingStates: [
      {
        state: "Gujarat",
        sharePercent: 28.5,
        harvestSeason: "October - January (Shankar-6 & Bt Cotton hub)",
        majorDistricts: ["Surendranagar", "Rajkot", "Amreli", "Bhavnagar", "Surat", "Bharuch", "Vadodara", "Junagadh", "Jamnagar", "Morbi", "Botad"]
      },
      {
        state: "Maharashtra",
        sharePercent: 25.2,
        harvestSeason: "October - February (Vidarbha & Khandesh)",
        majorDistricts: ["Yavatmal", "Jalgaon", "Akola", "Amravati", "Wardha", "Nagpur", "Nanded", "Chhatrapati Sambhajinagar", "Jalna", "Dhule", "Buldhana"]
      },
      {
        state: "Telangana",
        sharePercent: 16.8,
        harvestSeason: "October - January",
        majorDistricts: ["Adilabad", "Warangal", "Nalgonda", "Khammam", "Karimnagar", "Mahabubnagar", "Siddipet", "Jagtial", "Mancherial", "Komaram Bheem"]
      },
      {
        state: "Rajasthan",
        sharePercent: 8.2,
        harvestSeason: "October - December",
        majorDistricts: ["Sriganganagar", "Hanumangarh", "Bikaner", "Jodhpur", "Nagaur", "Bhilwara"]
      },
      {
        state: "Karnataka",
        sharePercent: 6.8,
        harvestSeason: "November - February",
        majorDistricts: ["Dharwad", "Belagavi", "Vijayapura", "Haveri", "Ballari", "Kalaburagi", "Raichur", "Gadag"]
      },
      {
        state: "Andhra Pradesh",
        sharePercent: 5.5,
        harvestSeason: "November - January",
        majorDistricts: ["Guntur", "Kurnool", "Prakasam", "Palnadu", "Nandyal", "Ananthapuramu"]
      },
      {
        state: "Punjab & Haryana",
        sharePercent: 5.2,
        harvestSeason: "September - November",
        majorDistricts: ["Bathinda", "Mansa", "Fazilka", "Sirsa", "Hisar", "Fatehabad", "Bhiwani"]
      }
    ]
  },
  sugarcane: {
    id: "sugarcane",
    name: "Sugarcane",
    hindiName: "गन्ना",
    category: "Cash & Fiber Crops",
    icon: "🎋",
    idealSoil: "Deep Alluvial Loam, Rich Clayey Black Soil with High Potash & Calcium",
    soilPh: "6.5 – 8.0",
    temperature: "20°C – 35°C (Long warm sunshine period)",
    rainfall: "1000 – 1500 mm (Copious irrigation during vegetative phase)",
    season: "Annual (10 to 14 Months crop cycle)",
    harvestMonths: "October – April",
    nationalShare: "India is #1 Global Producer & Exporter of Sugar (~500 Million Tonnes Cane)",
    producingStates: [
      {
        state: "Uttar Pradesh",
        sharePercent: 44.5,
        harvestSeason: "October - April (West UP Sugar Belt)",
        majorDistricts: ["Muzaffarnagar", "Meerut", "Shamli", "Bijnor", "Saharanpur", "Baghpat", "Bulandshahr", "Lakhimpur Kheri", "Sitapur", "Hardoi", "Pilibhit", "Bareilly", "Kushinagar", "Deoria", "Gorakhpur"]
      },
      {
        state: "Maharashtra",
        sharePercent: 28.2,
        harvestSeason: "November - April (High Sugar Recovery ~11.5%)",
        majorDistricts: ["Kolhapur", "Pune", "Sangli", "Solapur", "Satara", "Ahmednagar", "Nashik", "Chhatrapati Sambhajinagar", "Nanded", "Latur"]
      },
      {
        state: "Karnataka",
        sharePercent: 11.2,
        harvestSeason: "November - March",
        majorDistricts: ["Belagavi", "Bagalkote", "Mandya", "Vijayapura", "Kalaburagi", "Mysuru", "Davanagere", "Bidar"]
      },
      {
        state: "Tamil Nadu",
        sharePercent: 4.8,
        harvestSeason: "December - April",
        majorDistricts: ["Villupuram", "Cuddalore", "Erode", "Tiruvannamalai", "Salem", "Thanjavur", "Kallakurichi"]
      },
      {
        state: "Gujarat",
        sharePercent: 3.6,
        harvestSeason: "December - March",
        majorDistricts: ["Surat", "Navsari", "Bharuch", "Narmada", "Tapi", "Valsad"]
      },
      {
        state: "Bihar & Punjab",
        sharePercent: 4.5,
        harvestSeason: "November - March",
        majorDistricts: ["West Champaran", "Gopalganj", "Muzaffarpur", "Gurdaspur", "Hoshiarpur", "Jalandhar"]
      }
    ]
  },
  tea: {
    id: "tea",
    name: "Tea (Camellia sinensis)",
    hindiName: "चाय",
    category: "Plantation & Spices",
    icon: "🍵",
    idealSoil: "Acidic Laterite & Forest Loam (Rich in Humus & Iron, Free of Lime)",
    soilPh: "4.5 – 5.5 (Acidic)",
    temperature: "18°C – 30°C (Humid tropical/sub-tropical climate)",
    rainfall: "1500 – 3000 mm (Well-distributed on well-drained slopes)",
    season: "Perennial (Multiple flushes: Spring, Summer, Autumn)",
    harvestMonths: "March – November (First Flush in Mar-Apr, Second Flush in May-Jun)",
    nationalShare: "India is #2 Global Producer & World's Largest Black Tea Consumer (1350+ M.kg)",
    producingStates: [
      {
        state: "Assam",
        sharePercent: 52.5,
        harvestSeason: "March - November (Brahmaputra & Barak Valley CTC)",
        majorDistricts: ["Dibrugarh", "Tinsukia", "Sivasagar", "Jorhat", "Golaghat", "Sonitpur", "Nagaon", "Cachar", "Karbi Anglong", "Charaideo"]
      },
      {
        state: "West Bengal",
        sharePercent: 28.2,
        harvestSeason: "March - November (World-Famous Darjeeling Orthodox & Dooars)",
        majorDistricts: ["Darjeeling", "Kalimpong", "Jalpaiguri", "Alipurduar", "Cooch Behar"]
      },
      {
        state: "Tamil Nadu",
        sharePercent: 11.5,
        harvestSeason: "Year-Round (Nilgiri Fragrant Orthodox Tea)",
        majorDistricts: ["The Nilgiris (Coonoor, Ooty)", "Coimbatore (Valparai)", "Dindigul", "Tirunelveli"]
      },
      {
        state: "Kerala",
        sharePercent: 5.6,
        harvestSeason: "Year-Round (Highland High-Grown Tea)",
        majorDistricts: ["Idukki (Munnar, Peermade)", "Wayanad", "Palakkad", "Kollam"]
      },
      {
        state: "Himachal Pradesh & Tripura",
        sharePercent: 1.5,
        harvestSeason: "April - October (Kangra Valley Green & Orthodox)",
        majorDistricts: ["Kangra (Palampur, Dharamshala)", "Mandi", "West Tripura", "Sepahijala"]
      }
    ]
  },
  coffee: {
    id: "coffee",
    name: "Coffee (Arabica & Robusta)",
    hindiName: "कॉफ़ी",
    category: "Plantation & Spices",
    icon: "☕",
    idealSoil: "Deep Well-drained Laterite & Red Forest Loam (Rich in Humus, Iron & Potash)",
    soilPh: "5.5 – 6.5",
    temperature: "15°C – 28°C (Grown under shade tree canopy)",
    rainfall: "1500 – 2500 mm (Requires Blossom Showers in Mar-Apr)",
    season: "Perennial",
    harvestMonths: "November – February (Arabica) | January – March (Robusta)",
    nationalShare: "India exports over 70% of production (~350,000 Tonnes, Shade-Grown Specialty)",
    producingStates: [
      {
        state: "Karnataka",
        sharePercent: 71.2,
        harvestSeason: "November - March (Cradle of Indian Coffee)",
        majorDistricts: ["Kodagu (Coorg)", "Chikkamagaluru (Baba Budangiri)", "Hassan (Sakleshpur)"]
      },
      {
        state: "Kerala",
        sharePercent: 21.0,
        harvestSeason: "December - March (Famous for Wayanad Robusta)",
        majorDistricts: ["Wayanad", "Idukki", "Palakkad", "Kottayam"]
      },
      {
        state: "Tamil Nadu",
        sharePercent: 5.8,
        harvestSeason: "November - February",
        majorDistricts: ["Dindigul (Kodaikanal)", "The Nilgiris", "Salem (Yercaud)", "Coimbatore (Valparai)", "Theni"]
      },
      {
        state: "Andhra Pradesh & Odisha",
        sharePercent: 1.8,
        harvestSeason: "December - February (Organic Tribal Araku Valley Coffee)",
        majorDistricts: ["Alluri Sitharama Raju (Araku Valley)", "Koraput", "Rayagada"]
      }
    ]
  },
  groundnut: {
    id: "groundnut",
    name: "Groundnut (Peanut)",
    hindiName: "मूंगफली",
    category: "Oilseeds",
    icon: "🥜",
    idealSoil: "Well-drained Sandy Loam, Red Loam, Light Black Soil (Loose friable soil for peg entry)",
    soilPh: "6.0 – 7.5",
    temperature: "22°C – 30°C",
    rainfall: "500 – 750 mm (Critical moisture during flowering & pegging)",
    season: "Kharif (85%) & Rabi / Summer (15%)",
    harvestMonths: "October – November (Kharif) | March – April (Rabi)",
    nationalShare: "India is #2 Global Producer (10+ Million Tonnes)",
    producingStates: [
      {
        state: "Gujarat",
        sharePercent: 42.5,
        harvestSeason: "October - November (Saurashtra Peanut Belt)",
        majorDistricts: ["Rajkot", "Junagadh", "Amreli", "Jamnagar", "Gir Somnath", "Bhavnagar", "Morbi", "Devbhumi Dwarka", "Surendranagar", "Sabarkantha"]
      },
      {
        state: "Rajasthan",
        sharePercent: 21.0,
        harvestSeason: "October - November (Bikaner Peanut Mandi)",
        majorDistricts: ["Bikaner", "Jodhpur", "Nagaur", "Jaipur", "Churu", "Hanumangarh", "Sikar"]
      },
      {
        state: "Tamil Nadu",
        sharePercent: 10.5,
        harvestSeason: "Oct - Nov & Mar - Apr",
        majorDistricts: ["Tiruvannamalai", "Villupuram", "Namakkal", "Vellore", "Salem", "Erode", "Dindigul", "Pudukkottai"]
      },
      {
        state: "Andhra Pradesh",
        sharePercent: 8.8,
        harvestSeason: "October - December",
        majorDistricts: ["Ananthapuramu (Largest acreage)", "Sri Sathya Sai", "Chittoor", "Kurnool", "YSR Kadapa"]
      },
      {
        state: "Karnataka",
        sharePercent: 6.5,
        harvestSeason: "October - November",
        majorDistricts: ["Tumakuru", "Chitradurga", "Ballari", "Belagavi", "Kolar", "Vijayapura"]
      },
      {
        state: "Madhya Pradesh & Maharashtra",
        sharePercent: 7.2,
        harvestSeason: "October - November",
        majorDistricts: ["Khargone", "Barwani", "Dhar", "Dhule", "Nashik", "Kolhapur"]
      }
    ]
  },
  mustard: {
    id: "mustard",
    name: "Mustard & Rapeseed",
    hindiName: "सरसों / राई",
    category: "Oilseeds",
    icon: "🌼",
    idealSoil: "Alluvial Loam, Sandy Loam, Light Clayey Loam (Tolerant to mild salinity)",
    soilPh: "6.5 – 8.2",
    temperature: "15°C – 25°C (Cool winter season)",
    rainfall: "350 – 550 mm",
    season: "Rabi",
    harvestMonths: "February – April",
    nationalShare: "India is #3 Global Producer (12+ Million Tonnes)",
    producingStates: [
      {
        state: "Rajasthan",
        sharePercent: 46.2,
        harvestSeason: "February - March (Bharatpur Mustard Hub)",
        majorDistricts: ["Alwar", "Bharatpur", "Sriganganagar", "Hanumangarh", "Jaipur", "Dausa", "Sawai Madhopur", "Tonk", "Jhunjhunu", "Sikar", "Nagaur", "Kota"]
      },
      {
        state: "Madhya Pradesh",
        sharePercent: 14.8,
        harvestSeason: "February - March (Chambal Valley)",
        majorDistricts: ["Morena", "Bhind", "Sheopur", "Gwalior", "Guna", "Shivpuri", "Mandsaur", "Neemuch"]
      },
      {
        state: "Haryana",
        sharePercent: 12.5,
        harvestSeason: "February - March",
        majorDistricts: ["Bhiwani", "Mahendragarh", "Rewari", "Hisar", "Sirsa", "Jhajjar", "Charkhi Dadri"]
      },
      {
        state: "Uttar Pradesh",
        sharePercent: 11.2,
        harvestSeason: "February - March",
        majorDistricts: ["Agra", "Mathura", "Aligarh", "Firozabad", "Hathras", "Budaun", "Bareilly", "Kanpur Nagar", "Etawah"]
      },
      {
        state: "West Bengal & Gujarat",
        sharePercent: 9.5,
        harvestSeason: "January - March",
        majorDistricts: ["Nadia", "Murshidabad", "Banaskantha", "Patan", "Mehsana"]
      }
    ]
  },
  soybean: {
    id: "soybean",
    name: "Soybean (Yellow Jewel)",
    hindiName: "सोयाबीन",
    category: "Oilseeds",
    icon: "🫘",
    idealSoil: "Deep & Medium Black Soil (Vertisols), Well-drained Clayey Loam",
    soilPh: "6.5 – 7.5",
    temperature: "20°C – 32°C",
    rainfall: "650 – 1000 mm",
    season: "Kharif",
    harvestMonths: "September – November",
    nationalShare: "India is #5 Global Producer (12+ Million Tonnes)",
    producingStates: [
      {
        state: "Maharashtra",
        sharePercent: 44.2,
        harvestSeason: "September - November",
        majorDistricts: ["Latur", "Nanded", "Washim", "Yavatmal", "Amravati", "Akola", "Buldhana", "Wardha", "Hingoli", "Parbhani", "Jalna", "Kolhapur", "Sangli"]
      },
      {
        state: "Madhya Pradesh",
        sharePercent: 41.5,
        harvestSeason: "September - October (Soya State of India)",
        majorDistricts: ["Ujjain", "Dewas", "Dhar", "Indore", "Sehore", "Shajapur", "Ratlam", "Mandsaur", "Neemuch", "Hoshangabad", "Harda", "Betul", "Sagar"]
      },
      {
        state: "Rajasthan",
        sharePercent: 7.8,
        harvestSeason: "September - October",
        majorDistricts: ["Kota", "Baran", "Jhalawar", "Bundi", "Chittorgarh", "Pratapgarh"]
      },
      {
        state: "Karnataka & Telangana",
        sharePercent: 4.5,
        harvestSeason: "October - November",
        majorDistricts: ["Belagavi", "Bidar", "Kalaburagi", "Adilabad", "Nizamabad", "Kamareddy"]
      }
    ]
  },
  gram_chickpea: {
    id: "gram_chickpea",
    name: "Gram (Chickpea / Chana)",
    hindiName: "चना / छोला",
    category: "Pulses",
    icon: "🥣",
    idealSoil: "Well-drained Black Cotton Soil, Light Alluvial Loam, Red Loam",
    soilPh: "6.0 – 8.0",
    temperature: "15°C – 25°C",
    rainfall: "400 – 600 mm",
    season: "Rabi",
    harvestMonths: "February – April",
    nationalShare: "India is World's #1 Producer (~70% of global output, 12+ Million Tonnes)",
    producingStates: [
      {
        state: "Madhya Pradesh",
        sharePercent: 26.5,
        harvestSeason: "February - March",
        majorDistricts: ["Vidisha", "Raisen", "Ujjain", "Dhar", "Dewas", "Sehore", "Sagar", "Damoh", "Narsinghpur", "Jabalpur", "Chhindwara"]
      },
      {
        state: "Maharashtra",
        sharePercent: 24.2,
        harvestSeason: "February - March",
        majorDistricts: ["Ahmednagar", "Solapur", "Pune", "Latur", "Osmanabad", "Beed", "Nanded", "Jalna", "Chhatrapati Sambhajinagar", "Akola", "Amravati"]
      },
      {
        state: "Rajasthan",
        sharePercent: 20.8,
        harvestSeason: "March - April",
        majorDistricts: ["Bikaner", "Jaipur", "Jhunjhunu", "Sikar", "Churu", "Hanumangarh", "Nagaur", "Ajmer", "Tonk"]
      },
      {
        state: "Gujarat & Karnataka",
        sharePercent: 14.5,
        harvestSeason: "February - March",
        majorDistricts: ["Rajkot", "Junagadh", "Amreli", "Vijayapura", "Kalaburagi", "Dharwad", "Bidar"]
      },
      {
        state: "Uttar Pradesh",
        sharePercent: 8.5,
        harvestSeason: "March - April (Bundelkhand Chana Hub)",
        majorDistricts: ["Jhansi", "Lalitpur", "Hamirpur", "Banda", "Jalaun", "Mahoba", "Chitrakoot"]
      }
    ]
  },
  tur_pigeonpea: {
    id: "tur_pigeonpea",
    name: "Arhar / Tur (Pigeon Pea)",
    hindiName: "अरहर / तुअर दाल",
    category: "Pulses",
    icon: "🍲",
    idealSoil: "Deep Black Cotton Soil, Well-drained Red Sandy Loam (Deep taproot system)",
    soilPh: "6.5 – 7.8",
    temperature: "20°C – 35°C",
    rainfall: "600 – 900 mm",
    season: "Kharif (Long duration 160-200 days)",
    harvestMonths: "December – February",
    nationalShare: "India is World's #1 Producer & Consumer of Toor Dal (4+ Million Tonnes)",
    producingStates: [
      {
        state: "Maharashtra",
        sharePercent: 32.5,
        harvestSeason: "December - February",
        majorDistricts: ["Latur", "Nanded", "Yavatmal", "Amravati", "Akola", "Washim", "Wardha", "Jalna", "Parbhani", "Beed", "Buldhana"]
      },
      {
        state: "Karnataka",
        sharePercent: 28.0,
        harvestSeason: "December - January (Kalaburagi 'Tur Bowl of Karnataka' - GI Tag)",
        majorDistricts: ["Kalaburagi", "Yadgir", "Bidar", "Vijayapura", "Raichur"]
      },
      {
        state: "Madhya Pradesh",
        sharePercent: 15.5,
        harvestSeason: "December - February",
        majorDistricts: ["Narsinghpur", "Chhindwara", "Jabalpur", "Seoni", "Hoshangabad", "Betul", "Raisen"]
      },
      {
        state: "Gujarat",
        sharePercent: 9.8,
        harvestSeason: "December - January",
        majorDistricts: ["Vadodara", "Bharuch", "Narmada", "Surat", "Panchmahal", "Dahod"]
      },
      {
        state: "Uttar Pradesh & Telangana",
        sharePercent: 9.5,
        harvestSeason: "December - February",
        majorDistricts: ["Banda", "Chitrakoot", "Fatehpur", "Prayagraj", "Adilabad", "Mahabubnagar"]
      }
    ]
  },
  jute: {
    id: "jute",
    name: "Jute (Golden Fiber)",
    hindiName: "जूट / पटसन",
    category: "Cash & Fiber Crops",
    icon: "🧵",
    idealSoil: "New Alluvial Floodplain Silt (Khadar), Deltaic Peaty Clay Loam",
    soilPh: "6.0 – 7.5",
    temperature: "25°C – 38°C (High humidity 70-90%)",
    rainfall: "1500 – 2200 mm (Requires clean soft water for retting)",
    season: "Kharif",
    harvestMonths: "July – September",
    nationalShare: "India is #1 Global Producer of Raw Jute (~1.8 Million Tonnes)",
    producingStates: [
      {
        state: "West Bengal",
        sharePercent: 79.5,
        harvestSeason: "July - September (Gangetic Delta Core)",
        majorDistricts: ["Murshidabad", "Nadia", "North 24 Parganas", "Hooghly", "Purba Bardhaman", "Malda", "Uttar Dinajpur", "Dakshin Dinajpur", "Cooch Behar", "Jalpaiguri"]
      },
      {
        state: "Bihar",
        sharePercent: 10.2,
        harvestSeason: "July - August (Seemanchal Belt)",
        majorDistricts: ["Purnia", "Katihar", "Kishanganj", "Araria", "Saharsa", "Supaul", "Madhepura"]
      },
      {
        state: "Assam",
        sharePercent: 7.8,
        harvestSeason: "July - September (Brahmaputra Valley)",
        majorDistricts: ["Nagaon", "Darrang", "Barpeta", "Dhubri", "Goalpara", "Morigaon", "Sonitpur"]
      },
      {
        state: "Odisha & Andhra Pradesh",
        sharePercent: 2.5,
        harvestSeason: "July - August",
        majorDistricts: ["Cuttack", "Balasore", "Kendrapara", "Srikakulam", "Vizianagaram"]
      }
    ]
  },
  tobacco: {
    id: "tobacco",
    name: "Tobacco (FCV & Bidi)",
    hindiName: "तम्बाकू",
    category: "Cash & Fiber Crops",
    icon: "🍂",
    idealSoil: "Light Sandy Alluvial Loam, Black Vertisols, Red Loamy Soils",
    soilPh: "5.5 – 7.5",
    temperature: "20°C – 32°C",
    rainfall: "500 – 800 mm",
    season: "Rabi",
    harvestMonths: "January – April",
    nationalShare: "India is #2 Global Exporter & Producer (~800,000 Tonnes)",
    producingStates: [
      {
        state: "Gujarat",
        sharePercent: 45.0,
        harvestSeason: "January - March (Anand Bidi Tobacco Hub)",
        majorDistricts: ["Anand", "Kheda", "Vadodara", "Panchmahal", "Ahmedabad", "Mehsana"]
      },
      {
        state: "Andhra Pradesh",
        sharePercent: 38.5,
        harvestSeason: "January - April (Guntur Virginia FCV Hub)",
        majorDistricts: ["Guntur", "Prakasam", "West Godavari", "East Godavari", "Kurnool", "Nellore", "Bapatla", "Palnadu"]
      },
      {
        state: "Karnataka",
        sharePercent: 12.0,
        harvestSeason: "December - March (Light Soil FCV)",
        majorDistricts: ["Mysuru", "Hassan", "Mandya", "Shivamogga"]
      },
      {
        state: "West Bengal & Bihar",
        sharePercent: 4.5,
        harvestSeason: "February - April",
        majorDistricts: ["Cooch Behar", "Jalpaiguri", "Vaishali", "Samastipur"]
      }
    ]
  },
  rubber: {
    id: "rubber",
    name: "Natural Rubber (Hevea brasiliensis)",
    hindiName: "प्राकृतिक रबर",
    category: "Plantation & Spices",
    icon: "🛞",
    idealSoil: "Deep Laterite & Lateritic Loam (Rich in Iron/Alumina, Free of Calcium)",
    soilPh: "4.5 – 6.0 (Strongly Acidic)",
    temperature: "20°C – 34°C (High humidity)",
    rainfall: "2000 – 3500 mm (Equally distributed with no prolonged dry spell)",
    season: "Perennial (Tapped for 25-30 years)",
    harvestMonths: "September – January (Peak Latex flow, tapped year-round)",
    nationalShare: "India is #4 Global Producer (~850,000 Tonnes)",
    producingStates: [
      {
        state: "Kerala",
        sharePercent: 76.5,
        harvestSeason: "Year-Round (Kottayam Rubber Capital)",
        majorDistricts: ["Kottayam", "Ernakulam", "Pathanamthitta", "Kollam", "Thrissur", "Kozhikode", "Kannur", "Malappuram", "Kasaragod", "Idukki", "Palakkad"]
      },
      {
        state: "Tripura",
        sharePercent: 12.5,
        harvestSeason: "Year-Round (Second Largest Rubber Producer)",
        majorDistricts: ["West Tripura", "Sepahijala", "South Tripura", "Gomati", "Khowai", "North Tripura"]
      },
      {
        state: "Tamil Nadu & Karnataka",
        sharePercent: 7.8,
        harvestSeason: "Year-Round",
        majorDistricts: ["Kanyakumari", "Dakshina Kannada", "Udupi", "Kodagu", "Shivamogga"]
      },
      {
        state: "Assam & Meghalaya",
        sharePercent: 3.2,
        harvestSeason: "April - November",
        majorDistricts: ["Karbi Anglong", "Goalpara", "Ri-Bhoi", "East Garo Hills"]
      }
    ]
  },
  apple: {
    id: "apple",
    name: "Apple (Malus domestica)",
    hindiName: "सेब",
    category: "Commercial Fruits & Horticulture",
    icon: "🍎",
    idealSoil: "Well-drained Mountain Forest Loam, Rich in Organic Humus & Peat",
    soilPh: "5.8 – 6.8",
    temperature: "7°C – 24°C (Requires 1000-1500 chilling hours below 7°C)",
    rainfall: "1000 – 1250 mm (Uniform moisture without waterlogging)",
    season: "Perennial",
    harvestMonths: "July – October",
    nationalShare: "India produces over 2.5 Million Tonnes of premium temperate apples",
    producingStates: [
      {
        state: "Jammu & Kashmir",
        sharePercent: 74.0,
        harvestSeason: "August - October (Kashmir Royal Delicious & Ambri)",
        majorDistricts: ["Shopian (Apple Bowl)", "Baramulla", "Anantnag", "Pulwama", "Kulgam", "Srinagar", "Budgam", "Kupwara", "Ganderbal", "Bandipora"]
      },
      {
        state: "Himachal Pradesh",
        sharePercent: 22.5,
        harvestSeason: "July - September (Shimla Red Delicious & Golden)",
        majorDistricts: ["Shimla (Kotgarh/Rohru)", "Kullu", "Kinnaur", "Mandi", "Chamba", "Sirmaur"]
      },
      {
        state: "Uttarakhand",
        sharePercent: 3.0,
        harvestSeason: "July - September",
        majorDistricts: ["Uttarkashi (Harsil Apples)", "Nainital", "Almora", "Chamoli", "Pithoragarh", "Dehradun (Chakrata)"]
      },
      {
        state: "Arunachal Pradesh",
        sharePercent: 0.5,
        harvestSeason: "August - September",
        majorDistricts: ["West Kameng (Dirang)", "Tawang"]
      }
    ]
  },
  spices_cardamom_pepper: {
    id: "spices_cardamom_pepper",
    name: "Cardamom & Black Pepper (King & Queen of Spices)",
    hindiName: "इलायची एवं काली मिर्च",
    category: "Plantation & Spices",
    icon: "🫚",
    idealSoil: "Rich Forest Loam with Deep Humus, Well-drained Laterite Soils on Slopes",
    soilPh: "5.0 – 6.2",
    temperature: "15°C – 32°C",
    rainfall: "1500 – 3500 mm",
    season: "Perennial",
    harvestMonths: "August – February (Cardamom) | December – March (Pepper)",
    nationalShare: "India's Malabar coast & Western Ghats are historically legendary for spices",
    producingStates: [
      {
        state: "Kerala",
        sharePercent: 68.5,
        harvestSeason: "August - February (Idukki Cardamom Hills & Wayanad Pepper)",
        majorDistricts: ["Idukki (Kumily, Vandanmedu)", "Wayanad", "Palakkad", "Kottayam", "Pathanamthitta", "Kozhikode"]
      },
      {
        state: "Karnataka",
        sharePercent: 22.0,
        harvestSeason: "October - February",
        majorDistricts: ["Kodagu", "Chikkamagaluru", "Hassan", "Uttara Kannada", "Dakshina Kannada", "Shivamogga"]
      },
      {
        state: "Tamil Nadu",
        sharePercent: 5.5,
        harvestSeason: "September - January",
        majorDistricts: ["Dindigul", "Theni", "Tirunelveli", "The Nilgiris", "Kanyakumari"]
      },
      {
        state: "Sikkim & West Bengal",
        sharePercent: 4.0,
        harvestSeason: "September - December (Large Cardamom / Badi Elaichi)",
        majorDistricts: ["East Sikkim", "West Sikkim", "North Sikkim", "South Sikkim", "Darjeeling", "Kalimpong"]
      }
    ]
  },
  onion: {
    id: "onion",
    name: "Onion",
    hindiName: "प्याज़",
    category: "Commercial Fruits & Horticulture",
    icon: "🧅",
    idealSoil: "Well-drained Sandy Loam, Clayey Silt Loam, Medium Black Soil",
    soilPh: "6.0 – 7.5",
    temperature: "13°C – 28°C",
    rainfall: "650 – 750 mm",
    season: "Kharif, Late Kharif & Rabi (Rabi provides 65% of storage onions)",
    harvestMonths: "November – December (Kharif) | March – May (Rabi)",
    nationalShare: "India is #1 Global Producer & Exporter (~30 Million Tonnes)",
    producingStates: [
      {
        state: "Maharashtra",
        sharePercent: 41.5,
        harvestSeason: "Nov - Dec & Mar - May (Lasalgaon Nashik Asia's Largest Mandi)",
        majorDistricts: ["Nashik", "Ahmednagar", "Pune", "Solapur", "Jalgaon", "Chhatrapati Sambhajinagar", "Dhule", "Satara", "Beed"]
      },
      {
        state: "Madhya Pradesh",
        sharePercent: 16.8,
        harvestSeason: "March - May",
        majorDistricts: ["Indore", "Ujjain", "Khandwa", "Shajapur", "Dewas", "Dhar", "Mandsaur", "Neemuch", "Ratlam", "Sehore"]
      },
      {
        state: "Karnataka",
        sharePercent: 12.2,
        harvestSeason: "October - December",
        majorDistricts: ["Chitradurga", "Gadag", "Dharwad", "Bagalkote", "Vijayapura", "Ballari", "Belagavi", "Davanagere"]
      },
      {
        state: "Gujarat",
        sharePercent: 9.5,
        harvestSeason: "January - April (Mahuva Dehydrated Onion Hub)",
        majorDistricts: ["Bhavnagar (Mahuva)", "Junagadh", "Rajkot", "Amreli", "Surendranagar"]
      },
      {
        state: "Rajasthan & Bihar",
        sharePercent: 8.5,
        harvestSeason: "March - May",
        majorDistricts: ["Alwar", "Jaipur", "Sikar", "Jodhpur", "Patna", "Nalanda"]
      }
    ]
  },
  potato: {
    id: "potato",
    name: "Potato",
    hindiName: "आलू",
    category: "Commercial Fruits & Horticulture",
    icon: "🥔",
    idealSoil: "Well-aerated Sandy Loam & Silt Loam (Loose, rich in organic matter)",
    soilPh: "5.2 – 6.8",
    temperature: "15°C – 20°C (Tuberization requires cool nights < 20°C)",
    rainfall: "500 – 700 mm",
    season: "Rabi (Plains) & Summer (Hills)",
    harvestMonths: "January – March (Plains) | August – October (Hills)",
    nationalShare: "India is #2 Global Producer (55+ Million Tonnes)",
    producingStates: [
      {
        state: "Uttar Pradesh",
        sharePercent: 35.0,
        harvestSeason: "January - March (Agra-Farrukhabad Potato Capital)",
        majorDistricts: ["Agra", "Farrukhabad", "Firozabad", "Kannauj", "Mainpuri", "Aligarh", "Hathras", "Mathura", "Budaun", "Barabanki", "Prayagraj"]
      },
      {
        state: "West Bengal",
        sharePercent: 24.5,
        harvestSeason: "January - March (Hooghly & Burdwan Jyoti Hub)",
        majorDistricts: ["Hooghly", "Purba Bardhaman", "Paschim Medinipur", "Bankura", "Birbhum", "Jalpaiguri", "Cooch Behar"]
      },
      {
        state: "Bihar",
        sharePercent: 15.2,
        harvestSeason: "January - March",
        majorDistricts: ["Patna", "Nalanda", "Vaishali", "Samastipur", "Gaya", "Muzaffarpur", "Saran"]
      },
      {
        state: "Gujarat",
        sharePercent: 9.8,
        harvestSeason: "January - March (Deesa French Fry & Chip Processing Hub)",
        majorDistricts: ["Banaskantha (Deesa)", "Sabarkantha", "Aravalli", "Gandhinagar", "Kheda"]
      },
      {
        state: "Madhya Pradesh & Punjab",
        sharePercent: 11.5,
        harvestSeason: "December - February (Jalandhar Seed Potato Hub)",
        majorDistricts: ["Indore", "Ujjain", "Chhindwara", "Shajapur", "Jalandhar", "Hoshiarpur", "Kapurthala"]
      }
    ]
  },
  maize: {
    id: "maize",
    name: "Maize (Corn)",
    hindiName: "मक्का",
    category: "Cereals & Foodgrains",
    icon: "🌽",
    idealSoil: "Deep Alluvial Loam, Red Loam, Well-drained Black Soil",
    soilPh: "6.0 – 7.5",
    temperature: "21°C – 30°C",
    rainfall: "500 – 900 mm",
    season: "Kharif & Rabi (Rabi Bihar maize produces highest yields ~7 t/ha)",
    harvestMonths: "September – October (Kharif) | March – May (Rabi)",
    nationalShare: "India is #5 Global Producer (35+ Million Tonnes for starch & poultry feed)",
    producingStates: [
      {
        state: "Karnataka",
        sharePercent: 15.8,
        harvestSeason: "September - November",
        majorDistricts: ["Davanagere", "Belagavi", "Haveri", "Ballari", "Shivamogga", "Chitradurga", "Chikkamagaluru", "Bagalkote"]
      },
      {
        state: "Madhya Pradesh",
        sharePercent: 14.5,
        harvestSeason: "September - October (Chhindwara Corn City)",
        majorDistricts: ["Chhindwara", "Dhar", "Jhabua", "Barwani", "Ratlam", "Khargone", "Betul", "Seoni", "Guna"]
      },
      {
        state: "Maharashtra",
        sharePercent: 11.2,
        harvestSeason: "September - November",
        majorDistricts: ["Nashik", "Ahmednagar", "Dhule", "Jalgaon", "Chhatrapati Sambhajinagar", "Jalna", "Solapur", "Sangli"]
      },
      {
        state: "Bihar",
        sharePercent: 10.8,
        harvestSeason: "April - May (World-Class Rabi Maize)",
        majorDistricts: ["Khagaria", "Samastipur", "Begusarai", "Bhagalpur", "Purnia", "Katihar", "Saharsa", "Madhepura"]
      },
      {
        state: "Telangana & Andhra Pradesh",
        sharePercent: 11.0,
        harvestSeason: "October - November & March - April",
        majorDistricts: ["Warangal", "Nizamabad", "Karimnagar", "Khammam", "Guntur", "Kurnool", "West Godavari"]
      },
      {
        state: "Rajasthan & Uttar Pradesh",
        sharePercent: 12.5,
        harvestSeason: "September - October",
        majorDistricts: ["Bhilwara", "Udaipur", "Chittorgarh", "Banswara", "Bahraich", "Gonda", "Bulandshahr", "Aligarh", "Farrukhabad"]
      }
    ]
  },
  bajra_pearlmillet: {
    id: "bajra_pearlmillet",
    name: "Bajra (Pearl Millet)",
    hindiName: "बाजरा",
    category: "Cereals & Foodgrains",
    icon: "🌾",
    idealSoil: "Sandy Loam, Arid Desert Soil, Shallow Red Soil (Extremely drought-hardy)",
    soilPh: "6.5 – 8.5",
    temperature: "25°C – 35°C",
    rainfall: "350 – 500 mm",
    season: "Kharif & Summer",
    harvestMonths: "September – November",
    nationalShare: "India is #1 Global Producer (10+ Million Tonnes - Nutri-Cereal)",
    producingStates: [
      {
        state: "Rajasthan",
        sharePercent: 44.5,
        harvestSeason: "September - November (Thar Desert Bajra King)",
        majorDistricts: ["Alwar", "Jaipur", "Nagaur", "Jodhpur", "Barmer", "Sikar", "Jhunjhunu", "Dausa", "Bharatpur", "Bikaner", "Karauli", "Churu"]
      },
      {
        state: "Uttar Pradesh",
        sharePercent: 19.5,
        harvestSeason: "September - October",
        majorDistricts: ["Agra", "Aligarh", "Mathura", "Firozabad", "Budaun", "Hathras", "Etah", "Mainpuri", "Sambhal", "Bulandshahr"]
      },
      {
        state: "Haryana",
        sharePercent: 11.2,
        harvestSeason: "September - October",
        majorDistricts: ["Bhiwani", "Mahendragarh", "Rewari", "Hisar", "Jhajjar", "Gurugram", "Charkhi Dadri"]
      },
      {
        state: "Gujarat",
        sharePercent: 10.5,
        harvestSeason: "September - October & May - June",
        majorDistricts: ["Banaskantha", "Patan", "Sabarkantha", "Mehsana", "Kutch", "Bhavnagar", "Surendranagar", "Kheda"]
      },
      {
        state: "Maharashtra",
        sharePercent: 7.8,
        harvestSeason: "September - November",
        majorDistricts: ["Ahmednagar", "Nashik", "Pune", "Dhule", "Chhatrapati Sambhajinagar", "Jalgaon", "Solapur", "Beed"]
      }
    ]
  }
};

window.indianSoilTypesMaster = indianSoilTypesMaster;
window.stateSoilDatabase = stateSoilDatabase;
window.cropHarvestDatabase = cropHarvestDatabase;

/**
 * India Land Information Portal (GLIS)
 * State-Wise Satellite Imagery Catalog & Multi-Layer GIS Raster Database
 * Provides multi-zone satellite tiles for all Indian States with automated AI processing pipeline.
 */

const stateSatelliteDatabase = {
  gujarat: {
    stateName: "Gujarat",
    capital: "Gandhinagar",
    coordinates: [22.2587, 71.1924],
    zoom: 7,
    tiles: [
      {
        id: "guj_tile_1",
        title: "Ahmedabad Urban & Sabarmati River Zone",
        zoneType: "Urban & Riverine",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_2.jpg",
        description: "Dense built-up residential & commercial core, industrial corridors, and river water body.",
        dominantClasses: ["Urban", "Water", "Barren"],
        captureDate: "14-Feb-2026",
        cloudCover: "0.2%"
      },
      {
        id: "guj_tile_2",
        title: "Saurashtra Black Soil Cotton Farmland",
        zoneType: "Intensive Agriculture",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-32-51.jpg",
        description: "High-density agricultural sown tracts, check-dam irrigation networks, and crop canopy.",
        dominantClasses: ["Agriculture", "Barren"],
        captureDate: "02-Jan-2026",
        cloudCover: "0.0%"
      },
      {
        id: "guj_tile_3",
        title: "Gulf of Khambhat Coastal Mangrove Delta",
        zoneType: "Wetland & Coastal",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_1.jpg",
        description: "Estuarine mudflats, mangrove reserves, tidal inlets, and marine wetland ecologies.",
        dominantClasses: ["Wetland", "Water", "Barren"],
        captureDate: "18-Jan-2026",
        cloudCover: "0.5%"
      },
      {
        id: "guj_tile_4",
        title: "Gir Forest National Park Canopy",
        zoneType: "Dense Forest & Hills",
        sensor: "Landsat-9 OLI-2 (15m Pan-sharpened)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-31-19.jpg",
        description: "Deciduous teak forest canopy, wildlife sanctuary buffer, and rugged hill ridges.",
        dominantClasses: ["Forest", "Barren"],
        captureDate: "20-Dec-2025",
        cloudCover: "0.1%"
      }
    ]
  },
  maharashtra: {
    stateName: "Maharashtra",
    capital: "Mumbai",
    coordinates: [19.7515, 75.7139],
    zoom: 7,
    tiles: [
      {
        id: "mah_tile_1",
        title: "Mumbai Metropolitan Coast & Urban Spine",
        zoneType: "Mega-Urban & Estuary",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_2.jpg",
        description: "High-density infrastructure, port facilities, creek wetlands, and commercial skyscrapers.",
        dominantClasses: ["Urban", "Water", "Wetland"],
        captureDate: "08-Feb-2026",
        cloudCover: "0.8%"
      },
      {
        id: "mah_tile_2",
        title: "Western Ghats Rainforest & Catchment Basin",
        zoneType: "Dense Tropical Forest",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-31-19-1.jpg",
        description: "Biodiversity hotspot evergreen canopy, steep escarpments, and hydro-power lake reservoirs.",
        dominantClasses: ["Forest", "Water"],
        captureDate: "25-Jan-2026",
        cloudCover: "0.4%"
      },
      {
        id: "mah_tile_3",
        title: "Vidarbha & Marathwada Black Soil Cotton Belt",
        zoneType: "Deccan Agriculture",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-32-51-2.jpg",
        description: "Regur soil agricultural fields, soybean/cotton farms, and seasonal river drainage.",
        dominantClasses: ["Agriculture", "Barren"],
        captureDate: "12-Jan-2026",
        cloudCover: "0.0%"
      },
      {
        id: "mah_tile_4",
        title: "Pune IT Corridor & Peri-Urban Expansion",
        zoneType: "Peri-Urban & Tech Hub",
        sensor: "Landsat-9 OLI-2 (15m)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-34-43.jpg",
        description: "Rapid suburban transformation, industrial estates, and agricultural conversion.",
        dominantClasses: ["Urban", "Agriculture", "Barren"],
        captureDate: "04-Feb-2026",
        cloudCover: "0.2%"
      }
    ]
  },
  punjab: {
    stateName: "Punjab",
    capital: "Chandigarh",
    coordinates: [31.1471, 75.3412],
    zoom: 8,
    tiles: [
      {
        id: "pun_tile_1",
        title: "Ludhiana Alluvial Wheat & Mustard Belt",
        zoneType: "Intensive Crop Sown",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-34-48.jpg",
        description: "High-yield alluvial plain, canal irrigation grid, and dense Rabi wheat crop vegetative cover.",
        dominantClasses: ["Agriculture", "Water"],
        captureDate: "15-Feb-2026",
        cloudCover: "0.0%"
      },
      {
        id: "pun_tile_2",
        title: "Sutlej River Basin & Wetland Sanctuaries",
        zoneType: "Riverine & Wetland",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_1.jpg",
        description: "Harike wetland confluence, alluvial riverbanks, and marshy reed beds.",
        dominantClasses: ["Water", "Wetland", "Agriculture"],
        captureDate: "28-Jan-2026",
        cloudCover: "0.3%"
      },
      {
        id: "pun_tile_3",
        title: "Amritsar Urban Hub & Agro-Industrial Core",
        zoneType: "Urban & Agro-Processing",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_2.jpg",
        description: "Historic city center, transportation arteries, grain storage depots, and peri-urban farmlands.",
        dominantClasses: ["Urban", "Agriculture"],
        captureDate: "06-Feb-2026",
        cloudCover: "0.1%"
      }
    ]
  },
  "tamil nadu": {
    stateName: "Tamil Nadu",
    capital: "Chennai",
    coordinates: [11.1271, 78.6569],
    zoom: 7,
    tiles: [
      {
        id: "tn_tile_1",
        title: "Cauvery Delta Paddy Fields (Thanjavur)",
        zoneType: "Delta Agriculture",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-34-48-1.jpg",
        description: "Rice bowl of Tamil Nadu with river canal irrigation canals and verdant green rice plots.",
        dominantClasses: ["Agriculture", "Water"],
        captureDate: "10-Feb-2026",
        cloudCover: "0.6%"
      },
      {
        id: "tn_tile_2",
        title: "Chennai Port & Coastal Industrial Belt",
        zoneType: "Coastal Metropolis",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_2.jpg",
        description: "Maritime shipping terminals, automotive manufacturing clusters, and Ennore creek backwaters.",
        dominantClasses: ["Urban", "Water", "Barren"],
        captureDate: "03-Feb-2026",
        cloudCover: "0.7%"
      },
      {
        id: "tn_tile_3",
        title: "Nilgiri Mountain Tea & Shola Forest",
        zoneType: "Montane Forest & Plantation",
        sensor: "Landsat-9 OLI-2 (15m)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-35-50.jpg",
        description: "Terraced highland tea gardens, Shola grasslands, and temperate forest ridges.",
        dominantClasses: ["Forest", "Agriculture"],
        captureDate: "19-Jan-2026",
        cloudCover: "0.9%"
      }
    ]
  },
  karnataka: {
    stateName: "Karnataka",
    capital: "Bengaluru",
    coordinates: [15.3173, 75.7139],
    zoom: 7,
    tiles: [
      {
        id: "kar_tile_1",
        title: "Bengaluru Tech Hub & Urban Lakes",
        zoneType: "High-Tech Urban",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-36-49.jpg",
        description: "Electronic City & Whitefield tech parks, Bellandur lake basin, and suburban ring roads.",
        dominantClasses: ["Urban", "Water", "Barren"],
        captureDate: "11-Feb-2026",
        cloudCover: "0.3%"
      },
      {
        id: "kar_tile_2",
        title: "Coorg & Western Ghats Coffee Plantations",
        zoneType: "Dense Forest & Plantation",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-31-19.jpg",
        description: "Shade-grown Arabica/Robusta coffee estates, cardamom hills, and tropical rainforest canopy.",
        dominantClasses: ["Forest", "Agriculture"],
        captureDate: "27-Jan-2026",
        cloudCover: "0.4%"
      },
      {
        id: "kar_tile_3",
        title: "Deccan Plateau Sunflower & Millet Tracts",
        zoneType: "Semi-Arid Agriculture",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-34-43-3.jpg",
        description: "Red & black sandy loam agricultural plots, dryland farming, and rural settlement nodes.",
        dominantClasses: ["Agriculture", "Barren"],
        captureDate: "05-Jan-2026",
        cloudCover: "0.0%"
      }
    ]
  },
  "uttar pradesh": {
    stateName: "Uttar Pradesh",
    capital: "Lucknow",
    coordinates: [26.8467, 80.9462],
    zoom: 7,
    tiles: [
      {
        id: "up_tile_1",
        title: "Gangetic Plain Sugarcane & Wheat Cropland",
        zoneType: "Alluvial Agriculture",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-32-51.jpg",
        description: "Extremely fertile deep alluvial soil, sugarcane plantations, and tubewell irrigation channels.",
        dominantClasses: ["Agriculture", "Water"],
        captureDate: "09-Feb-2026",
        cloudCover: "0.1%"
      },
      {
        id: "up_tile_2",
        title: "Noida & Greater Noida Industrial Zone",
        zoneType: "Planned Urban & Expressways",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_2.jpg",
        description: "Planned grid urban development, multi-lane expressways, and Yamuna floodplain margins.",
        dominantClasses: ["Urban", "Barren", "Water"],
        captureDate: "14-Feb-2026",
        cloudCover: "0.2%"
      },
      {
        id: "up_tile_3",
        title: "Dudhwa Terai Forest & Marshland Reserve",
        zoneType: "Terai Forest & Wetland",
        sensor: "Landsat-9 OLI-2 (15m)",
        imagePath: "/data/segmentation/test_image/Test_1.jpg",
        description: "Dense Sal forest, seasonal oxbow lakes, tall grassland marshes, and riverine floodplains.",
        dominantClasses: ["Forest", "Wetland", "Water"],
        captureDate: "21-Jan-2026",
        cloudCover: "0.5%"
      }
    ]
  },
  rajasthan: {
    stateName: "Rajasthan",
    capital: "Jaipur",
    coordinates: [27.0238, 74.2179],
    zoom: 7,
    tiles: [
      {
        id: "raj_tile_1",
        title: "Thar Desert Dune & Solar Park Basin",
        zoneType: "Arid Desert & Renewable",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-34-43.jpg",
        description: "Sandy shifting dunes, rocky desert pavement, and large-scale utility solar PV installations.",
        dominantClasses: ["Barren", "Urban"],
        captureDate: "12-Feb-2026",
        cloudCover: "0.0%"
      },
      {
        id: "raj_tile_2",
        title: "Indira Gandhi Canal Mustard & Wheat Belt",
        zoneType: "Canal Irrigated Farmland",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-34-48-1.jpg",
        description: "Green agricultural corridors transformed by canal water amidst surrounding arid plains.",
        dominantClasses: ["Agriculture", "Barren", "Water"],
        captureDate: "01-Feb-2026",
        cloudCover: "0.0%"
      },
      {
        id: "raj_tile_3",
        title: "Jaipur Metropolitan & Aravalli Ridge",
        zoneType: "Urban & Hill Ridges",
        sensor: "Landsat-9 OLI-2 (15m)",
        imagePath: "/data/segmentation/test_image/Test_2.jpg",
        description: "Historic city fabric, modern commercial expansion, and rugged dry deciduous Aravalli hills.",
        dominantClasses: ["Urban", "Barren", "Forest"],
        captureDate: "18-Jan-2026",
        cloudCover: "0.2%"
      }
    ]
  },
  "west bengal": {
    stateName: "West Bengal",
    capital: "Kolkata",
    coordinates: [22.9868, 87.8550],
    zoom: 7,
    tiles: [
      {
        id: "wb_tile_1",
        title: "Sundarbans Mangrove Reserve & Tidal Creeks",
        zoneType: "Mangrove & Estuary",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_1.jpg",
        description: "World heritage tidal mangrove forest delta, brackish water channels, and mud islands.",
        dominantClasses: ["Forest", "Water", "Wetland"],
        captureDate: "20-Jan-2026",
        cloudCover: "0.8%"
      },
      {
        id: "wb_tile_2",
        title: "Burdwan Rice & Jute Alluvial Plains",
        zoneType: "Intensive Paddy & Jute",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-35-50-2.jpg",
        description: "Triple-cropped paddy plots, jute retting ponds, and dense rural village groves.",
        dominantClasses: ["Agriculture", "Water"],
        captureDate: "05-Feb-2026",
        cloudCover: "0.4%"
      },
      {
        id: "wb_tile_3",
        title: "Darjeeling Sub-Himalayan Tea Ridges",
        zoneType: "Montane Tea & Cloud Forest",
        sensor: "Landsat-9 OLI-2 (15m)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-31-19.jpg",
        description: "Steep terraced organic tea estates, pine and oak forests, and Himalayan valley topography.",
        dominantClasses: ["Forest", "Agriculture"],
        captureDate: "11-Jan-2026",
        cloudCover: "1.0%"
      }
    ]
  },
  kerala: {
    stateName: "Kerala",
    capital: "Thiruvananthapuram",
    coordinates: [10.8505, 76.2711],
    zoom: 8,
    tiles: [
      {
        id: "ker_tile_1",
        title: "Vembanad Backwaters & Kuttanad Below-Sea Paddy",
        zoneType: "Backwaters & Wetland",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_1.jpg",
        description: "Interconnected lagoons, coconut fringe canals, and delta wetland paddy cultivation.",
        dominantClasses: ["Water", "Wetland", "Agriculture"],
        captureDate: "24-Jan-2026",
        cloudCover: "0.6%"
      },
      {
        id: "ker_tile_2",
        title: "Wayanad & Idukki Spice Hill Slopes",
        zoneType: "Dense Forest & Spice Agroforestry",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-31-19-1.jpg",
        description: "Cardamom, pepper, and rubber plantations interwoven with moist tropical rainforests.",
        dominantClasses: ["Forest", "Agriculture"],
        captureDate: "16-Jan-2026",
        cloudCover: "0.5%"
      },
      {
        id: "ker_tile_3",
        title: "Kochi Port & Coastal Urban Agglomeration",
        zoneType: "Coastal Port & Urban",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_2.jpg",
        description: "Deepwater container transshipment port, shipyard, urban islands, and coastal highways.",
        dominantClasses: ["Urban", "Water", "Wetland"],
        captureDate: "07-Feb-2026",
        cloudCover: "0.3%"
      }
    ]
  },
  "madhya pradesh": {
    stateName: "Madhya Pradesh",
    capital: "Bhopal",
    coordinates: [22.9734, 78.6569],
    zoom: 7,
    tiles: [
      {
        id: "mp_tile_1",
        title: "Malwa Plateau Soybean & Gram Cropland",
        zoneType: "Plateau Agriculture",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-32-51.jpg",
        description: "Extensive black soil agricultural fields, farm ponds, and seasonal pulse farming.",
        dominantClasses: ["Agriculture", "Barren"],
        captureDate: "03-Feb-2026",
        cloudCover: "0.0%"
      },
      {
        id: "mp_tile_2",
        title: "Kanha-Pench Tiger Reserve Forest Belt",
        zoneType: "Central Deciduous Forest",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-31-19.jpg",
        description: "Vast contiguous Sal and bamboo forests, meadow clearings, and pristine river corridors.",
        dominantClasses: ["Forest", "Water"],
        captureDate: "19-Jan-2026",
        cloudCover: "0.2%"
      },
      {
        id: "mp_tile_3",
        title: "Bhopal Upper Lake & Smart City Core",
        zoneType: "Urban & Freshwater Wetland",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_2.jpg",
        description: "Bada Talaab Ramsar wetland, urban waterfront, green city parks, and residential zones.",
        dominantClasses: ["Urban", "Water", "Forest"],
        captureDate: "13-Feb-2026",
        cloudCover: "0.1%"
      }
    ]
  }
};

/**
 * Fallback generator for other states not explicitly defined above
 */
function getStateSatelliteTiles(stateKey) {
  const normalizedKey = (stateKey || "gujarat").toLowerCase().trim();
  if (stateSatelliteDatabase[normalizedKey]) {
    return stateSatelliteDatabase[normalizedKey];
  }

  // Generic generator for any state
  const capitalized = stateKey.charAt(0).toUpperCase() + stateKey.slice(1);
  return {
    stateName: capitalized,
    capital: "State Capital",
    coordinates: [22.0, 79.0],
    zoom: 7,
    tiles: [
      {
        id: `${normalizedKey}_tile_1`,
        title: `${capitalized} Agricultural Zone & Canal Network`,
        zoneType: "Agricultural Farmland",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-32-51.jpg",
        description: `Primary agricultural zone in ${capitalized} featuring dynamic crop rotations and irrigation.`,
        dominantClasses: ["Agriculture", "Barren"],
        captureDate: "10-Feb-2026",
        cloudCover: "0.1%"
      },
      {
        id: `${normalizedKey}_tile_2`,
        title: `${capitalized} Urban Center & Commercial Corridor`,
        zoneType: "Urban Development",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_2.jpg",
        description: `Central business district and residential expansion within ${capitalized}.`,
        dominantClasses: ["Urban", "Barren"],
        captureDate: "05-Feb-2026",
        cloudCover: "0.3%"
      },
      {
        id: `${normalizedKey}_tile_3`,
        title: `${capitalized} Forest Reserve & Catchment Basin`,
        zoneType: "Dense Forest & Water",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/PHOTO-2023-04-08-11-31-19.jpg",
        description: `Protected nature reserve, canopy cover, and river drainage in ${capitalized}.`,
        dominantClasses: ["Forest", "Water"],
        captureDate: "20-Jan-2026",
        cloudCover: "0.2%"
      },
      {
        id: `${normalizedKey}_tile_4`,
        title: `${capitalized} Wetland & Riverine Inlets`,
        zoneType: "Wetland Ecosystem",
        sensor: "Sentinel-2 MSI (10m Resolution)",
        imagePath: "/data/segmentation/test_image/Test_1.jpg",
        description: `Water bodies, marshes, and riverine ecosystem in ${capitalized}.`,
        dominantClasses: ["Wetland", "Water"],
        captureDate: "18-Jan-2026",
        cloudCover: "0.4%"
      }
    ]
  };
}

if (typeof window !== "undefined") {
  window.stateSatelliteDatabase = stateSatelliteDatabase;
  window.getStateSatelliteTiles = getStateSatelliteTiles;
}

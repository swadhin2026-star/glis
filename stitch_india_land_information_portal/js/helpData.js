/**
 * India Land Information Portal (GLIS)
 * Master Help, FAQ & Troubleshooting Problem Knowledge Base
 */

const helpQuestionsMasterDatabase = [
  {
    id: "soil-state-suitability",
    category: "soil",
    categoryLabel: "Soil & Crops",
    icon: "🌱",
    title: "How do I check which crops are suitable for my state's soils?",
    keywords: "soil state suitability crop farming agriculture pH NPK organic carbon health index texture nutrients",
    summary: "Select any Indian state in the Soil Quality tab to inspect soil order distributions, chemical parameters (pH, NPK, Organic Carbon), and matched recommended crops with seasonal calendars and yield potential.",
    steps: [
      "Navigate to the <strong>Soil Quality</strong> tab in the top navigation bar.",
      "Select your state from the <strong>State Selector</strong> dropdown (e.g. Gujarat, Maharashtra, Punjab, Tamil Nadu).",
      "Review the state's <strong>Soil Health Index (0–100)</strong>, soil distribution percentage breakdown, and chemical parameters (pH, NPK, Organic Carbon).",
      "Scroll to the <strong>Recommended State Crops</strong> section to see yield potentials (t/ha) and sowing/harvesting seasons."
    ],
    actionText: "Open Soil Quality",
    actionScreen: "soil_quality",
    actionSubTab: "state"
  },
  {
    id: "crop-harvest-districts",
    category: "soil",
    categoryLabel: "Soil & Crops",
    icon: "🌾",
    title: "How do I find which states and specific districts harvest a particular crop?",
    keywords: "crop district harvest reverse search cotton rice wheat tea coffee spices soybean mustard groundnut apple maize bajra sugarcane pulses",
    summary: "Use the Crop Reverse Search feature in the Soil Quality module to see national production share and the exact major harvesting districts across all producing states.",
    steps: [
      "Open the <strong>Soil Quality</strong> tab and click <strong>2. Crop Reverse Search & Districts</strong>.",
      "Type any crop name in the search bar (e.g., <em>Rice, Wheat, Cotton, Sugarcane, Tea, Coffee, Apple, Groundnut</em>) or click category filter pills.",
      "Inspect the <strong>Crop Intelligence Banner</strong> for soil preferences, rainfall, and temperature requirements.",
      "View producing states on the right showing national output shares and a badge for every major harvesting district."
    ],
    actionText: "Search Crop Districts",
    actionScreen: "soil_quality",
    actionSubTab: "crop"
  },
  {
    id: "soil-8-order-catalog",
    category: "soil",
    categoryLabel: "Soil & Crops",
    icon: "🧪",
    title: "Where can I view the national catalog of India's 8 ICAR soil types?",
    keywords: "8 soil orders ICAR alluvial black regur red laterite desert peaty saline alkaline matrix catalog pedology",
    summary: "Access the complete pedological matrix for Alluvial, Black/Regur, Red & Yellow, Laterite, Arid, Mountain, Peaty, and Saline soils.",
    steps: [
      "Navigate to <strong>Soil Quality</strong> and click <strong>3. National 8-Order Soil Catalog</strong>.",
      "Explore comprehensive data on pH ranges, organic carbon %, geological origins, suitable crops, and agronomic advisories."
    ],
    actionText: "View Soil Catalog",
    actionScreen: "soil_quality",
    actionSubTab: "matrix"
  },
  {
    id: "land-records-lookup",
    category: "records",
    categoryLabel: "Land Records",
    icon: "📜",
    title: "How do I lookup Cadastral Land Records & 7/12 RoR extracts?",
    keywords: "land records 7/12 ror khasra survey number parcel ownership bhulekh revenue titling encumbrance mutation",
    summary: "Query survey numbers and Khasra IDs to verify ownership, land classification, mutation history, and encumbrances with verified QR validation.",
    steps: [
      "Switch to the <strong>Land Records</strong> tab in the navigation header.",
      "Enter a Survey Number (e.g., <em>142/A, 88/B, 204/C</em>) or select from sample presets.",
      "Inspect the digitized 7/12 Record of Rights (RoR), soil class, crop history, and verified digital QR seal."
    ],
    actionText: "Open Land Records",
    actionScreen: "land_governance"
  },
  {
    id: "ai-spatial-segmentation",
    category: "ai",
    categoryLabel: "AI Spatial ML",
    icon: "🤖",
    title: "How do I run the AI satellite land-cover segmentation model?",
    keywords: "ai deep learning pytorch unet resnet segmentation satellite earth observation barren urban forest water agriculture land cover",
    summary: "Execute real-time semantic segmentation on high-resolution Sentinel-2 satellite tiles with PyTorch U-Net ResNet-34.",
    steps: [
      "Click the <strong>AI Spatial ML</strong> tab in the navigation.",
      "Pick any sample satellite tile (e.g. Ahmedabad, Mumbai, Bengaluru) or upload an RGB image patch.",
      "Click <strong>Run PyTorch U-Net Inference</strong> to generate an instant colored land-cover mask with class confidence breakdowns."
    ],
    actionText: "Run AI Spatial ML",
    actionScreen: "ai_satellite_ml"
  },
  {
    id: "map-gis-layers",
    category: "map",
    categoryLabel: "Map GIS",
    icon: "🗺️",
    title: "How do I toggle map layers, administrative boundaries, and satellite basemaps?",
    keywords: "map gis leaflet layers satellite esri openstreetmap boundaries districts state border geojson",
    summary: "Interact with multi-tile GIS basemaps, administrative boundaries, and agricultural district overlays.",
    steps: [
      "Open the <strong>Map GIS</strong> tab from the navigation header.",
      "Use the layer switcher in the top-right corner to toggle between Esri Satellite Imagery, OpenStreetMap, and Topo basemaps.",
      "Select any state from the dropdown to load official GeoJSON boundaries and district dot distributions."
    ],
    actionText: "Launch Map GIS",
    actionScreen: "map_explorer"
  },
  {
    id: "urban-far-zoning",
    category: "urban",
    categoryLabel: "Urban & FAR",
    icon: "🏢",
    title: "How do I calculate FAR (Floor Area Ratio) and verify urban zoning rules?",
    keywords: "urban planning far floor area ratio zoning setbacks municipal ground coverage building height",
    summary: "Input plot dimensions and road widths to calculate permissible built-up area and regulatory compliance.",
    steps: [
      "Click on <strong>Urban & FAR</strong> in the navigation header.",
      "Enter your plot area (sq. meters) and front road width.",
      "View permissible FAR, maximum ground coverage, mandatory setback margins, and 3D volume envelope."
    ],
    actionText: "Open Urban & FAR",
    actionScreen: "urban_planning"
  },
  {
    id: "export-dossier-csv",
    category: "reports",
    categoryLabel: "Reports & Export",
    icon: "📊",
    title: "How can I export certified land dossiers and master state CSV data?",
    keywords: "export dossier pdf print report csv download data manifest backup state statistics",
    summary: "Generate official PDF dossiers with government watermarks or export complete state geospatial metrics as CSV.",
    steps: [
      "Click <strong>Export Dossier</strong> in the top header or navigate to <strong>Admin</strong>.",
      "Select your state and configure included data sections (Demographics, Land Use, Soil, GIS).",
      "Click <strong>Print / Export PDF Dossier</strong> or <strong>Download Master State CSV</strong>."
    ],
    actionText: "Export Dossier",
    actionScreen: "report_builder"
  },
  {
    id: "backend-offline-fix",
    category: "system",
    categoryLabel: "System & Setup",
    icon: "⚙️",
    title: "What should I do if the AI backend or server displays 'Offline'?",
    keywords: "backend offline server python launch portal bat error connection failed port 8000 torch",
    summary: "Easily launch the local Python server with full PyTorch ML acceleration on port 8000.",
    steps: [
      "Open PowerShell or Command Prompt in the project root folder.",
      "Run <code>.\\launch_portal.bat</code> or <code>py server.py</code>.",
      "Ensure port 8000 is open. The AI status badge in the header will immediately turn green (ACTIVE)."
    ],
    actionText: "Check Dashboard",
    actionScreen: "main_dashboard"
  }
];

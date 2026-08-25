/**
 * India Land Information Portal - Master Application Controller
 * Pure Black & White Monochrome Edition
 */

class IndiaLandApp {
  constructor() {
    this.currentScreen = 'main_dashboard';
    this.currentStateKey = 'gujarat';
    this.currentResourceCategory = 'ALL';

    // Initialize Sub-Engines
    this.mapEngine = new GISMapEngine('leafletMap');
    this.suitabilityEngine = new SuitabilityEngine();
    this.urbanEngine = new UrbanPlanningEngine();
    this.governanceEngine = new LandGovernanceEngine();
    this.soilEngine = new SoilQualityEngine();
    this.environmentalEngine = new EnvironmentalEngine();
    this.aiEngine = new AIEngine();
    this.socioEconomicEngine = new SocioEconomicEngine();
    this.reportEngine = new ReportEngine();
    this.adminEngine = new AdminDataEngine();
    this.liveDataEngine = new LiveDataEngine();
    // Help Center State
    this.currentHelpTopic = 'all';
    this.currentHelpQuery = '';
    this.expandedHelpIds = new Set();
  }

  async init() {
    await this.liveDataEngine.checkSources();
    this.setupNavigation();
    this.setupGlobalSearch();
    this.setupStateSelectors();
    this.setupResourceLibrary();
    this.setupUserAuthHeader();
    this.setupAiEngine();
    this.setupHeroIntro();
    this.setupHelpModal();
    this.renderStateProfile(this.currentStateKey);
    this.renderAllScreens(this.currentStateKey);

    // Keyboard Shortcuts (Ctrl+K or Esc)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearchModal();
      }
      if (e.key === 'Escape') {
        this.closeSearchModal();
        this.closeHelpModal();
        this.closeTeamModal();
      }
    });

    console.log("India Land Information Portal (GLIS) Monochrome Initialized.");
  }

  // ==========================================
  // FULLSCREEN HERO INTRO SCREEN (MAGIC UI STYLE)
  // ==========================================
  setupHeroIntro() {
    if (typeof GalaxyShaderBackground !== 'undefined') {
      this.galaxyShader = new GalaxyShaderBackground('heroGalaxyCanvas');
    }
    if (typeof HeroGlobeVisualizer !== 'undefined') {
      this.heroGlobe = new HeroGlobeVisualizer('heroGlobeCanvas');
    }
  }

  dismissHeroIntro(targetScreen = 'main_dashboard') {
    const overlay = document.getElementById('heroIntroOverlay');
    if (overlay) {
      overlay.classList.add('dismissed');
      setTimeout(() => {
        if (this.heroGlobe) this.heroGlobe.stop();
        if (this.galaxyShader) this.galaxyShader.stop();
      }, 700);
    }
    if (targetScreen && targetScreen !== this.currentScreen) {
      this.switchScreen(targetScreen);
    }
  }

  showHeroIntro() {
    const overlay = document.getElementById('heroIntroOverlay');
    if (overlay) {
      overlay.classList.remove('dismissed');
      if (this.galaxyShader) this.galaxyShader.start();
      if (this.heroGlobe) this.heroGlobe.start();
    }
  }

  showTeamModal() {
    const modal = document.getElementById('teamModalBackdrop');
    if (modal) {
      modal.classList.add('open');
      modal.classList.add('active');
    }
  }

  closeTeamModal() {
    const modal = document.getElementById('teamModalBackdrop');
    if (modal) {
      modal.classList.remove('open');
      modal.classList.remove('active');
    }
  }

  // ==========================================
  // HELP & PROBLEM SEARCH CENTER
  // ==========================================
  setupHelpModal() {
    this.renderHelpList();
  }

  showHelpModal() {
    const modal = document.getElementById('helpModalBackdrop');
    if (modal) {
      modal.classList.add('open');
      modal.classList.add('active');
    }
    const input = document.getElementById('helpProblemSearchInput');
    if (input) {
      setTimeout(() => input.focus(), 150);
    }
  }

  closeHelpModal() {
    const modal = document.getElementById('helpModalBackdrop');
    if (modal) {
      modal.classList.remove('open');
      modal.classList.remove('active');
    }
  }

  selectHelpTopic(topicKey) {
    this.currentHelpTopic = topicKey;
    const chipBtns = document.querySelectorAll('#helpTopicChips .help-topic-btn');
    chipBtns.forEach(btn => {
      if (btn.dataset.topic === topicKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this.renderHelpList();
  }

  filterHelpProblems(query) {
    this.currentHelpQuery = (query || '').trim().toLowerCase();
    const clearBtn = document.getElementById('helpSearchClearBtn');
    if (clearBtn) {
      clearBtn.style.display = this.currentHelpQuery.length > 0 ? 'flex' : 'none';
    }
    this.renderHelpList();
  }

  clearHelpSearch() {
    const input = document.getElementById('helpProblemSearchInput');
    if (input) {
      input.value = '';
      input.focus();
    }
    this.filterHelpProblems('');
  }

  toggleHelpFaq(faqId) {
    if (this.expandedHelpIds.has(faqId)) {
      this.expandedHelpIds.delete(faqId);
    } else {
      this.expandedHelpIds.add(faqId);
    }
    this.renderHelpList();
  }

  handleHelpAction(screenKey, subTab = null) {
    this.closeHelpModal();
    this.dismissHeroIntro();
    this.switchScreen(screenKey);
    if (screenKey === 'soil_quality' && subTab) {
      setTimeout(() => {
        this.switchSoilTab(subTab);
      }, 100);
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

  renderHelpList() {
    const container = document.getElementById('helpModalBody');
    if (!container) return;

    const query = this.currentHelpQuery;
    const topic = this.currentHelpTopic;

    const filtered = helpQuestionsMasterDatabase.filter(item => {
      const matchesTopic = (topic === 'all') || (item.category === topic);
      if (!matchesTopic) return false;

      if (!query) return true;
      const haystack = `${item.title} ${item.keywords} ${item.summary} ${item.categoryLabel}`.toLowerCase();
      return haystack.includes(query);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="help-empty-state">
          <div style="font-size:2.2rem; margin-bottom:0.6rem;">🔍</div>
          <h4 style="margin:0 0 0.4rem; font-size:1.1rem; font-weight:800; color:#000000;">No matching problem guides found</h4>
          <p style="margin:0; font-size:0.85rem; color:var(--ink-500);">
            We couldn't find any questions matching "<strong>${this.escapeHtml(query)}</strong>".
          </p>
          <div style="margin-top:1.25rem;">
            <button class="btn-secondary" style="font-size:0.8rem; padding:0.45rem 1rem;" onclick="window.app.clearHelpSearch()">Clear Search & View All</button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => {
      const isExpanded = this.expandedHelpIds.has(item.id) || (query.length > 0 && filtered.length <= 3);
      const stepsHtml = item.steps.map(step => `<li>${step}</li>`).join('');

      return `
        <div class="help-faq-item ${isExpanded ? 'expanded' : ''}" id="help_faq_${item.id}">
          <div class="help-faq-header" onclick="window.app.toggleHelpFaq('${item.id}')">
            <div class="help-faq-header-left">
              <span class="help-faq-icon">${item.icon}</span>
              <div class="help-faq-title-wrap">
                <span class="help-faq-title">${item.title}</span>
                <span class="help-faq-category-tag">${item.categoryLabel}</span>
              </div>
            </div>
            <svg class="help-faq-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div class="help-faq-body">
            <div class="help-faq-summary">${item.summary}</div>
            <ol class="help-faq-steps">
              ${stepsHtml}
            </ol>
            <div class="help-faq-actions">
              <button class="btn-primary" style="padding:0.4rem 1rem; font-size:0.8rem;"
                onclick="window.app.handleHelpAction('${item.actionScreen}', '${item.actionSubTab || ''}')">
                <span>${item.actionText} →</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================
  // USER AUTHENTICATION & SESSION SYNC
  // ==========================================
  setupUserAuthHeader() {
    const loginBtn = document.getElementById('headerLoginBtn');
    const profileContainer = document.getElementById('headerUserProfile');
    const trigger = document.getElementById('userProfileDropdownTrigger');
    const menu = document.getElementById('userProfileMenu');
    const logoutBtn = document.getElementById('headerLogoutBtn');

    const updateAuthUI = () => {
      const stored = localStorage.getItem('glis_auth_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (loginBtn) loginBtn.style.display = 'none';
          if (profileContainer) profileContainer.style.display = 'block';

          const nameEl = document.getElementById('userDisplayName');
          const roleEl = document.getElementById('userRoleBadge');
          const avatarEl = document.getElementById('userAvatarText');
          const menuNameEl = document.getElementById('menuUserName');
          const menuEmailEl = document.getElementById('menuUserEmail');
          const menuClearanceEl = document.getElementById('menuUserClearance');

          if (nameEl) nameEl.textContent = user.name;
          if (roleEl) roleEl.textContent = user.role;
          if (avatarEl) avatarEl.textContent = user.avatarText || user.name.slice(0, 2).toUpperCase();
          if (menuNameEl) menuNameEl.textContent = user.name;
          if (menuEmailEl) menuEmailEl.textContent = user.email;
          if (menuClearanceEl) menuClearanceEl.textContent = user.clearance || 'Level 3 Clearance';
          return;
        } catch (e) {
          localStorage.removeItem('glis_auth_user');
        }
      }

      // Default: Logged Out State
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      if (profileContainer) profileContainer.style.display = 'none';
    };

    updateAuthUI();

    // Dropdown toggle
    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('open');
      });

      document.addEventListener('click', () => {
        menu.classList.remove('open');
      });
    }

    // Logout handling
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('glis_auth_user');
        if (menu) menu.classList.remove('open');
        updateAuthUI();
      });
    }
  }

  // ==========================================
  // NAVIGATION & ROUTING (10 Screens)
  // ==========================================
  setupNavigation() {
    const navButtons = document.querySelectorAll('[data-screen]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetScreen = btn.dataset.screen;
        if (targetScreen) {
          this.switchScreen(targetScreen);
        }
      });
    });
  }

  switchScreen(screenId) {
    this.currentScreen = screenId;

    // Update screen visibility
    document.querySelectorAll('.screen-view').forEach(screen => {
      screen.classList.toggle('active-screen', screen.id === `screen_${screenId}`);
    });

    // Update nav tab buttons active state
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.screen === screenId);
    });

    // If switching to Map Explorer, trigger Leaflet size refresh & focus state
    if (screenId === 'map_explorer') {
      setTimeout(() => {
        if (!this.mapEngine.map) {
          this.mapEngine.init();
        } else {
          this.mapEngine.map.invalidateSize();
        }
        this.mapEngine.focusState(this.currentStateKey);
      }, 100);

      setTimeout(() => {
        if (this.mapEngine.map) {
          this.mapEngine.map.invalidateSize();
        }
      }, 350);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const screenNames = {
      main_dashboard: "Main Dashboard Overview",
      glis_platform: "GLIS Platform Landing Page",
      map_explorer: "Map Explorer GIS View",
      site_suitability: "Infrastructure Site Suitability",
      urban_planning: "Urban Planning Module",
      land_governance: "Land Governance Records",
      soil_quality: "Soil Quality & Crop Discovery",
      environmental_monitoring: "Environmental Monitoring Module",
      ai_satellite_ml: "AI Satellite ML Lab",
      socio_economic: "Socio-Economic Analysis",
      report_builder: "Report Builder & Insights",
      admin_management: "Admin Data Management"
    };

    if (screenNames[screenId]) {
      this.showToast(`Switched to ${screenNames[screenId]}`);
    }
  }

  // ==========================================
  // STATE MANAGEMENT & PROFILE RENDERING
  // ==========================================
  setupStateSelectors() {
    const selectors = document.querySelectorAll('.state-selector-dropdown');
    selectors.forEach(sel => {
      sel.innerHTML = '';
      Object.keys(stateDatabase).sort().forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = stateDatabase[key].name;
        if (key === this.currentStateKey) opt.selected = true;
        sel.appendChild(opt);
      });

      sel.addEventListener('change', (e) => {
        this.selectState(e.target.value);
      });
    });
  }

  selectState(stateKey) {
    if (!stateDatabase[stateKey]) return;
    this.currentStateKey = stateKey;

    // Sync all dropdowns
    document.querySelectorAll('.state-selector-dropdown').forEach(sel => {
      sel.value = stateKey;
    });

    // Re-render state profiles across all screens
    this.renderStateProfile(stateKey);
    this.renderAllScreens(stateKey);

    // If map is initialized, focus accurately
    if (this.mapEngine.map) {
      this.mapEngine.focusState(stateKey);
    }

    this.showToast(`Selected: ${stateDatabase[stateKey].name}`);
  }

  async renderStateProfile(stateKey) {
    const state = await this.liveDataEngine.getStateProfile(stateKey);
    if (!state) return;

    const stateNameEl = document.getElementById('profileStateName');
    const stateDescEl = document.getElementById('profileStateDesc');
    const popEl = document.getElementById('statPopulation');
    const areaEl = document.getElementById('statArea');
    const distEl = document.getElementById('statDistricts');
    const capEl = document.getElementById('statCapital');

    if (stateNameEl) stateNameEl.textContent = state.name;
    if (stateDescEl) stateDescEl.textContent = state.description;
    if (popEl) {
      popEl.innerHTML = `${state.population} ${this.liveDataEngine.renderSourceBadge(state._liveMeta?.population)}`;
    }
    if (areaEl) areaEl.textContent = state.area;
    if (distEl) distEl.textContent = state.districts;
    if (capEl) capEl.textContent = state.capital;

    // Update Land Use Labels
    const sourceLabel = document.getElementById('landUseSourceLabel');
    const yearLabel = document.getElementById('landUseYearLabel');
    if (sourceLabel) sourceLabel.textContent = state.landUseSource || 'ISRO Bhuvan / State DES';
    if (yearLabel) yearLabel.textContent = state.landUseYear || '2024-25';

    // Update Land Use Chart
    const ctx = document.getElementById('landUseChart');
    if (ctx) {
      if (window.landUseChartInstance) {
        window.landUseChartInstance.destroy();
      }
      window.landUseChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Agriculture', 'Forest', 'Built-up', 'Water Bodies', 'Barren / Wasteland'],
          datasets: [{
            data: [
              state.land.agriculture,
              state.land.forest,
              state.land.built,
              state.land.water,
              state.land.barren
            ],
            backgroundColor: [
              '#F26B21', // Orange/Yellowish
              '#3D7A58', // Leaf Green
              '#7C8B99', // Concrete Gray
              '#2C6E9E', // Map Blue
              '#E8DAC3'  // Sand/Barren
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 12,
                font: { family: 'Inter, sans-serif' }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return ' ' + context.label + ': ' + context.parsed + '%';
                }
              }
            }
          }
        }
      });
    }
    // District Chips
    const districtContainer = document.getElementById('districtChipsContainer');
    const districtCountEl = document.getElementById('districtCountBadge');
    if (districtCountEl) districtCountEl.textContent = `${state.districts} Districts`;

    const detailPanel = document.getElementById('districtDetailPanel');
    if (detailPanel) detailPanel.style.display = 'none';

    if (districtContainer) {
      districtContainer.innerHTML = '';
      state.districtList.forEach((dist, idx) => {
        const chip = document.createElement('div');
        chip.className = 'district-chip';
        chip.textContent = dist;
        chip.dataset.district = dist;
        chip.addEventListener('click', () => {
          this.selectDistrict(dist, state);
        });
        districtContainer.appendChild(chip);
      });
    }
  }

  selectDistrict(distName, stateObj) {
    const state = stateObj || stateDatabase[this.currentStateKey || 'gujarat'];
    this.currentSelectedDistrict = distName;

    // Highlight active chip
    document.querySelectorAll('.district-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.district === distName);
    });

    const panel = document.getElementById('districtDetailPanel');
    const nameEl = document.getElementById('dtDetailName');
    const badgeEl = document.getElementById('dtDetailStateBadge');
    const divEl = document.getElementById('dtDetailDivision');
    const popEl = document.getElementById('dtStatPopulation');
    const areaEl = document.getElementById('dtStatArea');
    const agriEl = document.getElementById('dtStatAgri');
    const forestEl = document.getElementById('dtStatForest');

    // Deterministic estimation based on state totals
    const numDists = state.districtList.length || 1;
    const avgPop = (state.populationNum || 10000000) / numDists;
    const avgArea = (state.areaNum || 50000) / numDists;

    // Slight deterministic variance per district name
    let hash = 0;
    for (let i = 0; i < distName.length; i++) hash = (hash * 31 + distName.charCodeAt(i)) & 0xffffffff;
    const variance = (Math.abs(hash % 40) - 20) / 100; // -20% to +20%

    const distPop = Math.round(avgPop * (1 + variance));
    const distArea = Math.round(avgArea * (1 + variance * 0.8));
    const distAgri = Math.min(85, Math.max(25, Math.round(state.land.agriculture * (1 + variance * 0.3))));
    const distForest = Math.min(65, Math.max(5, Math.round(state.land.forest * (1 - variance * 0.4))));
    const tehsils = Math.max(4, Math.min(18, Math.round(8 + (hash % 7))));

    const popFormatted = distPop >= 10000000 
      ? `${(distPop / 10000000).toFixed(2)} Cr` 
      : `${(distPop / 100000).toFixed(1)} Lakh`;

    if (badgeEl) badgeEl.textContent = state.name.toUpperCase();
    if (nameEl) nameEl.textContent = `${distName} District`;
    if (divEl) divEl.textContent = `${distName} Revenue Division • Tehsils/Talukas: ${tehsils} • HQ: ${distName}`;
    if (popEl) popEl.textContent = popFormatted;
    if (areaEl) areaEl.textContent = `${distArea.toLocaleString()} km²`;
    if (agriEl) agriEl.textContent = `${distAgri}%`;
    if (forestEl) forestEl.textContent = `${distForest}%`;

    if (panel) {
      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Sync with cadastral record
    const districtInput = document.getElementById('inputCadastralDistrict');
    if (districtInput) districtInput.value = distName;

    this.showToast(`Inspecting ${distName} District, ${state.name}`);
  }

  closeDistrictDetail() {
    const panel = document.getElementById('districtDetailPanel');
    if (panel) panel.style.display = 'none';
    document.querySelectorAll('.district-chip').forEach(c => c.classList.remove('active'));
    this.currentSelectedDistrict = null;
  }

  exploreDistrictOnMap() {
    const state = stateDatabase[this.currentStateKey || 'gujarat'];
    const dist = this.currentSelectedDistrict || state.districtList[0];
    this.switchScreen('map_explorer');

    setTimeout(() => {
      if (this.mapEngine && this.mapEngine.map) {
        let hash = 0;
        for (let i = 0; i < dist.length; i++) hash = (hash * 31 + dist.charCodeAt(i)) & 0xffffffff;
        const latOffset = ((hash % 100) - 50) / 180;
        const lngOffset = (((hash >> 4) % 100) - 50) / 180;

        const targetLat = state.mapCenter[0] + latOffset;
        const targetLng = state.mapCenter[1] + lngOffset;

        this.mapEngine.map.flyTo([targetLat, targetLng], Math.min(10, state.zoom + 2), { duration: 1.2 });
        L.popup()
          .setLatLng([targetLat, targetLng])
          .setContent(`
            <div style="font-family:var(--font-body); padding:4px;">
              <span class="badge-black" style="font-size:0.68rem; margin-bottom:4px; display:inline-block;">${state.name.toUpperCase()}</span>
              <h4 style="margin:0; font-size:0.95rem; font-weight:800;">${dist} District HQ</h4>
              <p style="font-size:0.75rem; color:#52525b; margin:4px 0 0;">Administrative Center & Revenue Division</p>
            </div>
          `)
          .openOn(this.mapEngine.map);
      }
    }, 200);

    this.showToast(`Centered Map on ${dist} District`);
  }

  openDistrictRoR() {
    const dist = this.currentSelectedDistrict;
    this.switchScreen('land_governance');
    const districtInput = document.getElementById('inputCadastralDistrict');
    if (districtInput && dist) {
      districtInput.value = dist;
      this.queryCadastralParcel();
    }
    this.showToast(`Loaded RoR Extract for ${dist}`);
  }

  openDistrictAi() {
    this.switchScreen('ai_satellite_ml');
    this.runAiSegmentation();
    this.showToast(`AI Spatial Studio loaded for ${this.currentSelectedDistrict || 'District'}`);
  }

  renderAllScreens(stateKey) {
    this.renderSuitabilityScreen(stateKey);
    this.renderUrbanPlanningScreen(stateKey);
    this.renderGovernanceScreen(stateKey);
    this.renderSoilQualityScreen(stateKey);
    this.renderAiSatelliteScreen(stateKey);
    this.renderSocioEconomicScreen(stateKey);
    this.renderReportBuilderScreen(stateKey);
    this.renderAdminScreen();
  }

  // ==========================================
  // SCREEN 4: SUITABILITY
  // ==========================================
  renderSuitabilityScreen(stateKey) {
    const res = this.suitabilityEngine.calculateSuitability(undefined, stateKey);
    const scoreEl = document.getElementById('suitabilityScore');
    const catEl = document.getElementById('suitabilityCategory');
    const recEl = document.getElementById('suitabilityRecommendation');
    const tableBody = document.getElementById('suitabilityTableBody');

    if (scoreEl) scoreEl.textContent = res.score;
    if (catEl) {
      catEl.textContent = res.category;
      catEl.className = `gauge-score-label badge-black`;
    }
    if (recEl) recEl.textContent = res.recommendation;

    if (tableBody) {
      tableBody.innerHTML = '';
      res.candidateSites.forEach(site => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${site.district}</strong></td>
          <td>${site.parcelSize}</td>
          <td>${site.terrainSlope}</td>
          <td>${site.gridDistance}</td>
          <td><span class="badge-black" style="font-family: var(--font-mono); font-size: 0.82rem;">${site.score} / 100</span></td>
          <td><span class="${site.status === 'Approved' ? 'badge-black' : 'badge-white'}">${site.status}</span></td>
        `;
        tableBody.appendChild(tr);
      });
    }
  }

  recalculateSuitability() {
    const weights = {
      slope: parseInt(document.getElementById('sliderSlope')?.value || 20),
      roadProximity: parseInt(document.getElementById('sliderRoad')?.value || 25),
      waterBuffer: parseInt(document.getElementById('sliderWater')?.value || 15),
      gridAccess: parseInt(document.getElementById('sliderGrid')?.value || 20),
      settlement: parseInt(document.getElementById('sliderSettlement')?.value || 10),
      ecoBuffer: parseInt(document.getElementById('sliderEco')?.value || 10)
    };

    document.getElementById('lblSlope').textContent = `${weights.slope}%`;
    document.getElementById('lblRoad').textContent = `${weights.roadProximity}%`;
    document.getElementById('lblWater').textContent = `${weights.waterBuffer}%`;
    document.getElementById('lblGrid').textContent = `${weights.gridAccess}%`;
    document.getElementById('lblSettlement').textContent = `${weights.settlement}%`;
    document.getElementById('lblEco').textContent = `${weights.ecoBuffer}%`;

    const res = this.suitabilityEngine.calculateSuitability(weights, this.currentStateKey);
    const scoreEl = document.getElementById('suitabilityScore');
    const catEl = document.getElementById('suitabilityCategory');
    const recEl = document.getElementById('suitabilityRecommendation');

    if (scoreEl) scoreEl.textContent = res.score;
    if (catEl) {
      catEl.textContent = res.category;
      catEl.className = `gauge-score-label badge-black`;
    }
    if (recEl) recEl.textContent = res.recommendation;
  }

  // ==========================================
  // SCREEN 5: URBAN PLANNING
  // ==========================================
  renderUrbanPlanningScreen(stateKey) {
    const alerts = this.urbanEngine.getEncroachmentAlerts(stateKey);
    const container = document.getElementById('encroachmentAlertsContainer');
    if (container) {
      container.innerHTML = '';
      alerts.forEach(a => {
        const card = document.createElement('div');
        card.className = 'radar-alert-card';
        card.innerHTML = `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="radar-alert-info">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h5>${a.location}</h5>
              <span class="badge-black" style="font-size:0.68rem;">${a.severity}</span>
            </div>
            <p><strong>Category:</strong> ${a.category} | <strong>Area:</strong> ${a.areaAffected} | <strong>Confidence:</strong> ${a.confidence}</p>
            <p style="margin-top:0.25rem; font-weight:700; color:#000000; font-size:0.75rem;"><strong>Action:</strong> ${a.actionStatus}</p>
          </div>
        `;
        container.appendChild(card);
      });
    }

    this.calculateFARForm();
  }

  calculateFARForm() {
    const plotArea = document.getElementById('inputPlotArea')?.value || 1500;
    const roadWidth = document.getElementById('inputRoadWidth')?.value || 18;
    const zoneKey = document.getElementById('selectZoning')?.value || "residential_high";
    const premiumFAR = document.getElementById('inputPremiumFAR')?.value || 0;

    const res = this.urbanEngine.calculateFAR(plotArea, roadWidth, zoneKey, premiumFAR);
    const farVal = document.getElementById('resultEffectiveFAR');
    const builtUpVal = document.getElementById('resultBuiltUpArea');
    const coverageVal = document.getElementById('resultCoverageArea');
    const heightVal = document.getElementById('resultMaxHeight');

    if (farVal) farVal.textContent = res.effectiveFAR;
    if (builtUpVal) builtUpVal.textContent = `${res.permissibleBuiltUpArea.toLocaleString()} sqm`;
    if (coverageVal) coverageVal.textContent = `${res.groundCoverageSqm.toLocaleString()} sqm (${res.maxCoveragePercent})`;
    if (heightVal) heightVal.textContent = res.estimatedHeightMeters;
  }

  // ==========================================
  // SCREEN 6: LAND GOVERNANCE
  // ==========================================
  renderGovernanceScreen(stateKey) {
    this.updateCadastralDistrictOptions(stateKey);
    this.setupCadastralEventListeners();
    this.queryCadastralParcel();
  }

  updateCadastralDistrictOptions(stateKey) {
    const state = stateDatabase[stateKey] || stateDatabase[this.currentStateKey];
    if (!state) return;

    const datalist = document.getElementById('cadastralDistrictList');
    const districtInput = document.getElementById('inputCadastralDistrict');

    if (datalist) {
      datalist.innerHTML = '';
      if (state.districtList && state.districtList.length > 0) {
        state.districtList.forEach(dist => {
          const opt = document.createElement('option');
          opt.value = dist;
          datalist.appendChild(opt);
        });
      }
    }

    if (districtInput) {
      const currentVal = districtInput.value.trim();
      const stateDistricts = state.districtList || [];
      // If empty or switching to a state where the current value is not in its district list, default to first district
      if (!currentVal || (stateDistricts.length > 0 && !stateDistricts.includes(currentVal))) {
        districtInput.value = stateDistricts[0] || `${state.name} Central`;
      }
    }
  }

  setupCadastralEventListeners() {
    if (this._cadastralEventsAttached) return;
    this._cadastralEventsAttached = true;

    const inputs = ['inputCadastralQuery', 'inputCadastralDistrict', 'inputCadastralUlpin'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.queryCadastralParcel();
          }
        });
        el.addEventListener('input', () => {
          clearTimeout(this._cadastralDebounce);
          this._cadastralDebounce = setTimeout(() => {
            this.queryCadastralParcel();
          }, 350);
        });
      }
    });

    const districtInput = document.getElementById('inputCadastralDistrict');
    if (districtInput) {
      districtInput.addEventListener('change', () => {
        this.queryCadastralParcel();
      });
    }
  }

  queryCadastralParcel(queryNum) {
    const queryInput = document.getElementById('inputCadastralQuery');
    const districtInput = document.getElementById('inputCadastralDistrict');
    const ulpinInput = document.getElementById('inputCadastralUlpin');

    const inputVal = queryNum || queryInput?.value?.trim() || "104/2A";
    const districtVal = districtInput?.value?.trim() || "";
    const ulpinVal = ulpinInput?.value?.trim() || "";

    const effectiveQuery = ulpinVal || inputVal;
    const parcel = this.governanceEngine.searchParcel(effectiveQuery, this.currentStateKey, districtVal);

    const rorContainer = document.getElementById('rorDocumentContainer');
    if (rorContainer) {
      const qrSvg = (typeof GLIS_QR !== 'undefined')
        ? GLIS_QR.generateSVG(`https://glis.gov.in/verify?ulpin=${parcel.ulpin}&khasra=${parcel.surveyNumber}&khata=${parcel.khataNumber}&state=${encodeURIComponent(parcel.state)}`, 88)
        : '';

      rorContainer.innerHTML = `
        <div class="ror-document-preview">
          <div class="ror-header" style="display:flex; justify-content:space-between; align-items:flex-start; gap:1.25rem;">
            <div style="flex:1;">
              <span class="badge-black" style="margin-bottom: 0.5rem; display: inline-block;">${parcel.authority}</span>
              <h3>${parcel.docTitle}</h3>
              <p>${parcel.portalName} • Bhu-Aadhaar ULPIN: <strong>${parcel.ulpin}</strong></p>
            </div>
            <div class="ror-qr-badge" style="background:#ffffff; border:1px solid #000000; border-radius:8px; padding:6px; text-align:center; box-shadow:var(--shadow-sm); flex-shrink:0;">
              ${qrSvg}
              <div style="font-size:0.62rem; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; margin-top:3px; color:#000000;">Scan to Verify</div>
            </div>
          </div>
          <table class="ror-data-table">
            <tr><th>State / Division</th><td>${parcel.state} / ${parcel.district}</td><th>Taluk / Tehsil</th><td>${parcel.taluk}</td></tr>
            <tr><th>Village / Sector</th><td>${parcel.village}</td><th>Survey / Khasra No</th><td><strong>${parcel.surveyNumber}</strong></td></tr>
            <tr><th>Khatauni Number</th><td>${parcel.khataNumber}</td><th>Total Land Area</th><td><strong>${parcel.areaHectares}</strong></td></tr>
            <tr><th>Primary Owner(s)</th><td colspan="3"><strong>${parcel.ownerName}</strong></td></tr>
            <tr><th>Land Classification</th><td>${parcel.landClassification}</td><th>Irrigation Source</th><td>${parcel.irrigationSource}</td></tr>
            <tr><th>Annual Land Revenue</th><td>${parcel.taxAssessment}</td><th>Dispute Registry</th><td><span class="badge-white">${parcel.disputeStatus}</span></td></tr>
            <tr><th>Encumbrance / Lien</th><td colspan="3"><span class="badge-gray">${parcel.encumbranceStatus}</span></td></tr>
          </table>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem; font-size:0.75rem; color:#52525b; flex-wrap:wrap; gap:1rem;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="display:inline-block; width:8px; height:8px; background:#16a34a; border-radius:50%;"></span>
              <span>Digitally Signed &amp; Certified (Sec 65B) | Mutation: <strong>${parcel.mutationNumber}</strong> (${parcel.mutationDate})</span>
            </div>
            <div style="display:flex; gap:0.75rem;">
              <button class="btn-primary" style="padding:0.45rem 1rem; font-size:0.78rem; display:inline-flex; align-items:center; gap:0.4rem;" onclick="window.app.exportCurrentRoRPDF()">
                <svg style="width:14px; height:14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>Certified PDF Export</span>
              </button>
              <button class="btn-secondary" style="padding:0.45rem 0.85rem; font-size:0.78rem;" onclick="window.print()">Print Extract</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  exportCurrentRoRPDF() {
    const surveyInput = document.getElementById('inputCadastralQuery');
    const districtInput = document.getElementById('inputCadastralDistrict');
    const surveyNum = surveyInput ? surveyInput.value : "104/2A";
    const district = districtInput ? districtInput.value : "";
    const parcel = this.governanceEngine.searchParcel(surveyNum, this.currentStateKey, district);
    this.governanceEngine.exportCertifiedRoRPDF(parcel);
  }

  // ==========================================
  // SCREEN 7: SOIL QUALITY & CROP AGRO-INTELLIGENCE
  // ==========================================
  renderSoilQualityScreen(stateKey) {
    const state = stateKey || this.currentStateKey || 'gujarat';
    this.renderSoilStateView(state);
    this.renderSoilCropView(this.soilEngine.currentSelectedCrop || 'cotton');
    this.renderSoilNationalMatrix();
    this.renderQuickCropPills(this.soilEngine.currentCategoryFilter || 'ALL');

    // Sync Soil State selector dropdown
    const sel = document.getElementById('soilStateSelect');
    if (sel && sel.value !== state) {
      sel.value = state;
    }
  }

  switchSoilTab(tabName) {
    this.soilEngine.currentSoilTab = tabName;

    // Toggle button active classes
    const btnState = document.getElementById('btnSoilTabState');
    const btnCrop = document.getElementById('btnSoilTabCrop');
    const btnMatrix = document.getElementById('btnSoilTabMatrix');

    if (btnState) btnState.classList.toggle('active', tabName === 'state');
    if (btnCrop) btnCrop.classList.toggle('active', tabName === 'crop');
    if (btnMatrix) btnMatrix.classList.toggle('active', tabName === 'matrix');

    // Toggle container views
    const viewState = document.getElementById('soilViewStateContainer');
    const viewCrop = document.getElementById('soilViewCropContainer');
    const viewMatrix = document.getElementById('soilViewMatrixContainer');

    if (viewState) viewState.style.display = tabName === 'state' ? 'block' : 'none';
    if (viewCrop) viewCrop.style.display = tabName === 'crop' ? 'block' : 'none';
    if (viewMatrix) viewMatrix.style.display = tabName === 'matrix' ? 'block' : 'none';
  }

  selectSoilState(stateKey) {
    if (!stateKey) return;
    this.currentStateKey = stateKey;
    this.soilEngine.currentSelectedState = stateKey;

    // Sync all global state selectors
    document.querySelectorAll('.state-selector-dropdown').forEach(s => s.value = stateKey);

    this.renderSoilStateView(stateKey);
    this.showToast(`Inspecting Soil Profile for ${stateDatabase[stateKey]?.name || stateKey}`);
  }

  renderSoilStateView(stateKey) {
    const key = stateKey || this.currentStateKey || 'gujarat';
    const profile = this.soilEngine.getStateSoilProfile(key);
    const kpis = this.soilEngine.calculateStateSoilKPIs(key);
    const state = stateDatabase[key] || { name: profile.stateName || 'State' };

    // Title & Health Score Badge
    const titleEl = document.getElementById('soilStateProfileTitle');
    const badgeEl = document.getElementById('soilStateHealthBadge');
    if (titleEl) titleEl.textContent = `${state.name} Soil Profile & Health Rating`;
    if (badgeEl) {
      badgeEl.textContent = `Soil Health Index: ${kpis.healthIndex} / 100 • ${kpis.rating}`;
      badgeEl.className = kpis.badgeClass;
    }

    // Distribution Bars
    const barsContainer = document.getElementById('soilStateDistBars');
    if (barsContainer) {
      barsContainer.innerHTML = '';
      profile.soilDistribution.forEach(soil => {
        const item = document.createElement('div');
        item.className = 'soil-dist-bar-item';
        item.innerHTML = `
          <div class="soil-dist-bar-header">
            <span>${soil.name} (${soil.areaKm2 ? soil.areaKm2.toLocaleString() + ' km²' : ''})</span>
            <span style="font-family:var(--font-mono);">${soil.percent}%</span>
          </div>
          <div class="soil-dist-progress">
            <div class="soil-dist-progress-fill" style="width: ${soil.percent}%;"></div>
          </div>
        `;
        barsContainer.appendChild(item);
      });
    }

    // Physical & Chemical Parameters Grid
    const paramsContainer = document.getElementById('soilStateParamsGrid');
    if (paramsContainer) {
      const primarySoilId = profile.soilDistribution[0]?.type || 'alluvial';
      const masterSoil = this.soilEngine.getSoilType(primarySoilId);

      paramsContainer.innerHTML = `
        <div class="soil-param-box">
          <span>Primary Soil Order</span>
          <strong>${masterSoil.name}</strong>
        </div>
        <div class="soil-param-box">
          <span>Soil pH Range</span>
          <strong>${masterSoil.phRange} (Median: ${masterSoil.phMedian})</strong>
        </div>
        <div class="soil-param-box">
          <span>Organic Carbon</span>
          <strong>${masterSoil.organicCarbon}</strong>
        </div>
        <div class="soil-param-box">
          <span>Moisture Capacity</span>
          <strong>${masterSoil.moistureRetention}</strong>
        </div>
        <div class="soil-param-box">
          <span>NPK Status</span>
          <strong>N: ${masterSoil.npkProfile.nitrogen.split(' ')[0]} | P: ${masterSoil.npkProfile.phosphorus.split(' ')[0]} | K: High</strong>
        </div>
        <div class="soil-param-box">
          <span>Soil Drainage</span>
          <strong>${masterSoil.drainage}</strong>
        </div>
      `;
    }

    // Advisory
    const advisoryEl = document.getElementById('soilStateAdvisoryText');
    if (advisoryEl) {
      advisoryEl.textContent = profile.soilAdvisories || kpis.advisory;
    }

    // District Clusters
    const clusterContainer = document.getElementById('soilDistrictClustersContainer');
    if (clusterContainer) {
      clusterContainer.innerHTML = '';
      if (profile.districtClusters && Object.keys(profile.districtClusters).length > 0) {
        Object.keys(profile.districtClusters).forEach(clusterName => {
          const dists = profile.districtClusters[clusterName];
          const div = document.createElement('div');
          div.style.cssText = 'background:var(--ink-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.85rem 1rem;';
          div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <strong style="font-size:0.88rem; color:#000000;">${clusterName}</strong>
              <span class="badge-white" style="font-size:0.7rem;">${dists.length} Districts</span>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:0.35rem;">
              ${dists.map(d => `<span class="district-harvest-badge" onclick="window.app.selectDistrict('${d}', stateDatabase['${key}'])">${d}</span>`).join('')}
            </div>
          `;
          clusterContainer.appendChild(div);
        });
      } else {
        clusterContainer.innerHTML = `<p style="font-size:0.8rem; color:var(--ink-500); margin:0;">All districts in this state feature homogenous agro-climatic conditions.</p>`;
      }
    }

    // Crop Suitability for State's Soils
    const cropsContainer = document.getElementById('soilStateCropsContainer');
    if (cropsContainer) {
      cropsContainer.innerHTML = '';
      const renderedCrops = new Set();

      profile.soilDistribution.forEach(soilItem => {
        const masterSoil = this.soilEngine.getSoilType(soilItem.type);
        if (masterSoil && masterSoil.suitableCrops) {
          masterSoil.suitableCrops.forEach(crop => {
            if (!renderedCrops.has(crop.name)) {
              renderedCrops.add(crop.name);
              const card = document.createElement('div');
              card.className = 'soil-crop-card';
              card.onclick = () => {
                // Reverse search this crop in Crop view
                this.selectSoilCrop(crop.name);
              };

              card.innerHTML = `
                <div>
                  <div class="soil-crop-card-top">
                    <h4>${crop.name}</h4>
                    <span class="badge-black" style="font-size:0.7rem;">${crop.suitability}</span>
                  </div>
                  <p style="font-size:0.78rem; color:var(--ink-500); margin:0 0 0.5rem;">Soil: <strong>${masterSoil.name.split('(')[0]}</strong></p>
                  <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--ink-600); margin-bottom:0.75rem; background:var(--ink-50); padding:0.4rem 0.6rem; border-radius:var(--radius-sm);">
                    <span>Season: <strong>${crop.season}</strong></span>
                    <span>Yield: <strong>${crop.yieldPotential}</strong></span>
                  </div>
                </div>
                <div style="display:flex; justify-content:flex-end;">
                  <span style="font-size:0.75rem; font-weight:700; color:#000000; display:inline-flex; align-items:center; gap:0.25rem;">
                    Find Harvest Districts →
                  </span>
                </div>
              `;
              cropsContainer.appendChild(card);
            }
          });
        }
      });
    }
  }

  renderSoilCropView(cropKeyOrQuery) {
    const crop = this.soilEngine.getCropProfile(cropKeyOrQuery);
    if (!crop) return;

    this.soilEngine.currentSelectedCrop = crop.id;

    // Crop Intel Hero Card
    const catBadge = document.getElementById('cropIntelCategoryBadge');
    const titleEl = document.getElementById('cropIntelTitle');
    const shareEl = document.getElementById('cropIntelNationalShare');
    const soilEl = document.getElementById('cropIntelSoil');
    const phEl = document.getElementById('cropIntelPh');
    const climateEl = document.getElementById('cropIntelClimate');
    const seasonEl = document.getElementById('cropIntelSeason');

    if (catBadge) catBadge.textContent = crop.category;
    if (titleEl) titleEl.innerHTML = `${crop.icon || '🌱'} ${crop.name} <span style="font-size:1.1rem; opacity:0.8; font-weight:600;">(${crop.hindiName || ''})</span>`;
    if (shareEl) shareEl.textContent = `${crop.nationalShare} • Harvest Months: ${crop.harvestMonths}`;
    if (soilEl) soilEl.textContent = crop.idealSoil;
    if (phEl) phEl.textContent = `${crop.soilPh} (Optimal Range)`;
    if (climateEl) climateEl.textContent = `${crop.temperature} • Rain: ${crop.rainfall}`;
    if (seasonEl) seasonEl.textContent = `${crop.season} (${crop.harvestMonths})`;

    // Producing States & Districts Count Badge
    const countBadge = document.getElementById('cropProducingStatesCountBadge');
    const headingEl = document.getElementById('cropHarvestHeading');
    if (countBadge) countBadge.textContent = `${crop.producingStates.length} Major Producing States`;
    if (headingEl) headingEl.textContent = `Harvesting States & Major Producing Districts for ${crop.name}`;

    // Producing States & Districts List
    const statesContainer = document.getElementById('cropHarvestStatesContainer');
    if (statesContainer) {
      statesContainer.innerHTML = '';
      crop.producingStates.forEach(st => {
        const card = document.createElement('div');
        card.className = 'state-harvest-card';
        card.innerHTML = `
          <div class="state-harvest-top">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <h3>${st.state}</h3>
              <span class="badge-black" style="font-family:var(--font-mono); font-size:0.78rem;">${st.sharePercent}% National Output</span>
            </div>
            <span class="badge-white" style="font-size:0.78rem;">Harvest Window: <strong>${st.harvestSeason}</strong></span>
          </div>
          <div>
            <span style="font-size:0.75rem; font-weight:700; color:var(--ink-500); text-transform:uppercase; letter-spacing:0.04em;">Major Harvesting Districts (${st.majorDistricts.length} Identified):</span>
            <div class="harvest-district-chips">
              ${st.majorDistricts.map(d => `<span class="district-harvest-badge" onclick="window.app.focusDistrictHarvest('${d}', '${st.state}')">📍 ${d}</span>`).join('')}
            </div>
          </div>
        `;
        statesContainer.appendChild(card);
      });
    }
  }

  focusDistrictHarvest(distName, stateName) {
    this.showToast(`Selected ${distName} District, ${stateName}`);
    // If state exists, switch state
    const stateKey = Object.keys(stateDatabase).find(k => stateDatabase[k].name.toLowerCase() === stateName.toLowerCase());
    if (stateKey) {
      this.currentStateKey = stateKey;
      const districtInput = document.getElementById('inputCadastralDistrict');
      if (districtInput) districtInput.value = distName;
    }
  }

  selectSoilCrop(cropKey) {
    this.switchSoilTab('crop');
    this.renderSoilCropView(cropKey);
    const searchInput = document.getElementById('soilCropSearchInput');
    if (searchInput) searchInput.value = '';

    const heroBanner = document.getElementById('cropIntelHeroBanner');
    if (heroBanner) {
      heroBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const crop = this.soilEngine.getCropProfile(cropKey);
    this.showToast(`Inspecting Harvest Districts for ${crop.name}`);
  }

  filterCropCategory(category, btnElement) {
    this.soilEngine.currentCategoryFilter = category;

    // Update active filter chip button
    document.querySelectorAll('.crop-filter-chip').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    this.renderQuickCropPills(category);

    // Auto-select first crop in category
    const crops = this.soilEngine.filterCropsByCategory(category);
    if (crops.length > 0) {
      this.renderSoilCropView(crops[0].id);
    }
  }

  searchSoilCrops(query) {
    if (!query || query.trim() === '') {
      this.renderSoilCropView(this.soilEngine.currentSelectedCrop || 'cotton');
      return;
    }

    const results = this.soilEngine.searchCrops(query);
    if (results.length > 0) {
      this.renderSoilCropView(results[0].id);
    } else {
      const statesContainer = document.getElementById('cropHarvestStatesContainer');
      if (statesContainer) {
        statesContainer.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--ink-500); font-weight:600;">No matching crops found for "${query}". Try searching Rice, Wheat, Cotton, Tea, Coffee, etc.</div>`;
      }
    }
  }

  renderQuickCropPills(category = 'ALL') {
    const container = document.getElementById('cropQuickPillsContainer');
    if (!container) return;

    container.innerHTML = '<span style="font-size:0.75rem; font-weight:700; color:var(--ink-500); margin-right:0.35rem;">Quick Select:</span>';
    const crops = this.soilEngine.filterCropsByCategory(category);

    crops.slice(0, 14).forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'crop-filter-chip';
      btn.style.cssText = 'padding:0.3rem 0.75rem; font-size:0.75rem;';
      btn.innerHTML = `${c.icon || '🌱'} ${c.name}`;
      btn.onclick = () => this.selectSoilCrop(c.id);
      container.appendChild(btn);
    });
  }

  renderSoilNationalMatrix() {
    const tableBody = document.getElementById('nationalSoilMatrixTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const soils = this.soilEngine.getAllSoilTypes();

    soils.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong style="font-size:0.95rem; color:#000000;">${s.name}</strong><br>
          <span style="font-size:0.78rem; color:var(--ink-500);">${s.hindiName} • Order: ${s.order}</span>
        </td>
        <td>
          <strong>${s.coveragePercent}%</strong><br>
          <span style="font-size:0.75rem; color:var(--ink-500);">${(s.coverageAreaKm2 / 1000).toFixed(0)}k km²</span>
        </td>
        <td>
          <span class="badge-black" style="font-family:var(--font-mono); font-size:0.75rem;">pH ${s.phRange}</span><br>
          <span style="font-size:0.75rem; color:var(--ink-600); margin-top:3px; display:inline-block;">OC: ${s.organicCarbon.split(' ')[0]}</span>
        </td>
        <td>
          <span style="font-size:0.75rem; color:var(--ink-600); line-height:1.4; display:block;">
            <strong>N:</strong> ${s.npkProfile.nitrogen.split(' ')[0]}<br>
            <strong>P:</strong> ${s.npkProfile.phosphorus.split(' ')[0]}<br>
            <strong>K:</strong> ${s.npkProfile.potassium.split(' ')[0]}
          </span>
        </td>
        <td>
          <div style="display:flex; flex-wrap:wrap; gap:0.25rem;">
            ${s.suitableCrops.slice(0, 4).map(c => `<span class="badge-white" style="font-size:0.7rem; cursor:pointer;" onclick="window.app.selectSoilCrop('${c.name}')">${c.name}</span>`).join('')}
          </div>
        </td>
        <td style="max-width:240px; font-size:0.78rem; color:var(--ink-600);">${s.majorBelts}</td>
        <td style="max-width:240px; font-size:0.78rem; color:var(--ink-600);">${s.managementAdvisory}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // ==========================================
  // AI SATELLITE ML LAB & PYTORCH U-NET INFERENCE
  // ==========================================
  async setupAiEngine() {
    this.currentAiSample = 'data/segmentation/test_image/Test_1.jpg';
    this.currentAiBase64 = null;

    try {
      const status = await this.aiEngine.checkStatus();
      this.updateAiTelemetryUI(status);
      const samples = await this.aiEngine.fetchSamples();
      if (samples && samples.length > 0) {
        this.renderAiSampleGallery(samples);
      }
    } catch (e) {
      console.warn("AI Engine setup warning:", e);
    }
  }

  updateAiTelemetryUI(status) {
    const headerStatus = document.getElementById('aiHeaderStatusText');
    const gpuNameEl = document.getElementById('aiCardGpuName');
    const cudaStatusEl = document.getElementById('aiCardCudaStatus');
    const modelPill = document.getElementById('aiActiveModelPill');

    if (status && status.ai_engine === 'active') {
      const gpu = status.gpu_name !== 'None' ? status.gpu_name : 'PyTorch CPU';
      if (headerStatus) headerStatus.textContent = `AI GPU (${gpu.replace('NVIDIA ', '')})`;
      if (gpuNameEl) gpuNameEl.textContent = gpu;
      if (cudaStatusEl) cudaStatusEl.textContent = `PyTorch ${status.pytorch_version} • CUDA Enabled`;
      if (modelPill) modelPill.textContent = 'Active: unet_resnet34_lulc_best.pth';
    } else {
      if (headerStatus) headerStatus.textContent = 'AI Model Ready';
      if (gpuNameEl) gpuNameEl.textContent = 'PyTorch Engine';
    }
  }

  renderAiSampleGallery(samples) {
    const gallery = document.getElementById('aiSampleTileGallery');
    if (!gallery || !samples || samples.length === 0) return;

    gallery.innerHTML = '';
    samples.slice(0, 8).forEach((sample, idx) => {
      const btn = document.createElement('div');
      btn.className = `tile-sample-btn ${idx === 0 ? 'active' : ''}`;
      btn.onclick = () => this.selectAiSample(sample.path, sample.relative_url, btn);

      const label = sample.name.replace('.jpg', '').replace('Test_', 'GIS-Tile-').replace('PHOTO-2023-04-08-', 'Map-Raster-');
      btn.innerHTML = `
        <img src="${sample.relative_url}" alt="${sample.name}" onerror="this.src='/data/segmentation/test_image/Test_1.jpg'">
        <span>${label}</span>
      `;
      gallery.appendChild(btn);
    });
  }

  renderAiSatelliteScreen() {
    if (!this._aiScreenInitialized) {
      this._aiScreenInitialized = true;
      this.runAiSegmentation();
    }
  }

  selectAiSample(samplePath, relativeUrl, btnEl) {
    if (typeof relativeUrl === 'object' || typeof relativeUrl === 'undefined') {
      btnEl = relativeUrl;
      relativeUrl = undefined;
    }

    let url = relativeUrl;
    if (!url) {
      if (samplePath.includes('data\\segmentation') || samplePath.includes('data/segmentation')) {
        // Extract the relative path starting from 'data/'
        const match = samplePath.match(/data[\\/].*/);
        if (match) {
          url = '/' + match[0].replace(/\\/g, '/');
        } else {
          url = samplePath;
        }
      } else {
        url = samplePath.startsWith('http') || samplePath.startsWith('/') ? samplePath : `/${samplePath.replace(/\\/g, '/')}`;
      }
    }

    this.currentAiSample = samplePath;
    this.currentAiBase64 = null;

    document.querySelectorAll('.tile-sample-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    const rawImg = document.getElementById('aiRawPreviewImg');
    const underlayImg = document.getElementById('aiUnderlayImg');

    if (rawImg) rawImg.src = url;
    if (underlayImg) underlayImg.src = url;

    this.runAiSegmentation();
  }

  handleCustomImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentAiBase64 = e.target.result;
      this.currentAiSample = null;

      const rawImg = document.getElementById('aiRawPreviewImg');
      const underlayImg = document.getElementById('aiUnderlayImg');
      if (rawImg) rawImg.src = this.currentAiBase64;
      if (underlayImg) underlayImg.src = this.currentAiBase64;

      document.querySelectorAll('.tile-sample-btn').forEach(b => b.classList.remove('active'));
      this.runAiSegmentation();
    };
    reader.readAsDataURL(file);
  }

  async runAiSegmentation() {
    const badge = document.getElementById('aiInferenceTimeBadge');
    const btn = document.getElementById('btnRunAiSegmentation');
    const maskImg = document.getElementById('aiMaskPreviewImg');

    if (badge) badge.innerHTML = '<span style="color:#2563eb;">Running PyTorch U-Net on GPU...</span>';
    if (btn) btn.disabled = true;

    try {
      const payload = this.currentAiBase64 
        ? { image_base64: this.currentAiBase64, confidence_threshold: this.currentAiConfThreshold || 0 } 
        : { image_path: this.currentAiSample || 'data/segmentation/test_image/Test_1.jpg', confidence_threshold: this.currentAiConfThreshold || 0 };

      const result = await this.aiEngine.runSegmentation(payload);

      if (maskImg && result.mask_url) {
        maskImg.src = `${result.mask_url}?t=${Date.now()}`;
      }

      if (badge) {
        badge.innerHTML = `<span style="color:#10b981;">✓ Inference Complete in ${result.latencyMs} ms (${result.resolution})</span>`;
      }

      const meanEl = document.getElementById('aiMeanConfVal');
      const covEl = document.getElementById('aiConfCoverageVal');
      if (meanEl && result.mean_confidence !== undefined) meanEl.textContent = `${result.mean_confidence}%`;
      if (covEl && result.confidence_coverage !== undefined) covEl.textContent = `${result.confidence_coverage}%`;

      this.renderLulcClassBreakdown(result.class_breakdown);
      this.showToast(`Neural segmentation completed in ${result.latencyMs} ms (Conf: ${result.confidence_threshold || 0}%)`);
    } catch (e) {
      if (badge) badge.innerHTML = `<span style="color:#ef4444;">Inference Error: ${e.message}</span>`;
      this.showToast(`AI Inference Error: ${e.message}`);
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  updateMaskOpacity(val) {
    const maskImg = document.getElementById('aiMaskPreviewImg');
    const underlayImg = document.getElementById('aiUnderlayImg');
    const textEl = document.getElementById('aiOpacityValText');

    const opacity = parseInt(val, 10) / 100;
    if (maskImg) maskImg.style.opacity = opacity;
    if (underlayImg) underlayImg.style.opacity = 1 - opacity;
    if (textEl) textEl.textContent = `${val}%`;
  }

  updateConfidenceThreshold(val) {
    const textEl = document.getElementById('aiConfidenceValText');
    this.currentAiConfThreshold = parseInt(val, 10);
    if (textEl) textEl.textContent = `${val}%`;

    clearTimeout(this._confDebounceTimer);
    this._confDebounceTimer = setTimeout(() => {
      this.runAiSegmentation();
    }, 150);
  }

  autoSetConfidenceThreshold() {
    const meanEl = document.getElementById('aiMeanConfVal');
    if (meanEl) {
      const meanConf = parseFloat(meanEl.textContent) || 90;
      let suggested = Math.floor((meanConf - 5) / 5) * 5;
      suggested = Math.max(0, Math.min(95, suggested));
      
      const slider = document.getElementById('aiConfidenceSlider');
      if (slider) slider.value = suggested;
      
      this.updateConfidenceThreshold(suggested);
    }
  }

  renderLulcClassBreakdown(breakdown) {
    const container = document.getElementById('aiLulcClassGrid');
    if (!container || !breakdown) return;

    container.innerHTML = '';
    const orderedClasses = ['barren', 'urban', 'water', 'forest', 'agriculture', 'wetland', 'uncertain'];
    const colorMap = {
      barren: '#a0a0a0',
      urban: '#dc143c',
      water: '#1e90ff',
      forest: '#228b22',
      agriculture: '#ffd700',
      wetland: '#9400d3',
      uncertain: '#4b5563'
    };

    orderedClasses.forEach(className => {
      if (!breakdown[className]) return;
      const data = breakdown[className];
      const isUncertain = className.toLowerCase() === 'uncertain';
      const color = colorMap[className.toLowerCase()] || '#000000';
      const card = document.createElement('div');
      card.className = 'lulc-class-pill';
      if (isUncertain) {
        card.style.background = '#f3f4f6';
        card.style.border = '1px dashed #9ca3af';
      }
      card.innerHTML = `
        <div class="lulc-class-top">
          <span><span class="class-indicator-dot" style="background:${color};"></span>${className.toUpperCase()}</span>
          <strong>${data.percentage}%</strong>
        </div>
        <div style="font-size:0.7rem; color:var(--ink-500);">${data.count.toLocaleString()} pixels</div>
        <div class="lulc-class-meter">
          <div class="lulc-class-meter-fill" style="width:${data.percentage}%; background:${color};"></div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  async runGISModelInference() {
    const elev = parseFloat(document.getElementById('gisElevationInput')?.value || 180);
    const slope = parseFloat(document.getElementById('gisSlopeInput')?.value || 4.2);
    const road = parseFloat(document.getElementById('gisRoadDistInput')?.value || 1.5);
    const ndvi = parseFloat(document.getElementById('gisNdviInput')?.value || 0.48);

    const payload = {
      elevation_m: elev,
      slope_pct: slope,
      dist_road_km: road,
      ndvi_mean: ndvi
    };

    try {
      const res = await this.aiEngine.runGISPrediction(payload);
      const container = document.getElementById('gisModelResultContainer');
      const targetNameEl = document.getElementById('gisResultTargetName');
      const valEl = document.getElementById('gisResultVal');

      if (container) container.style.display = 'flex';
      if (targetNameEl) targetNameEl.textContent = (res.target || 'Land Valuation / Suitability Index').replace(/_/g, ' ').toUpperCase();
      if (valEl) valEl.textContent = `${res.predicted_value} Index`;

      this.showToast(`GIS Neural Prediction: ${res.predicted_value}`);
    } catch (e) {
      this.showToast(`GIS Inference Error: ${e.message}`);
    }
  }

  // ==========================================
  // SCREEN 8: SOCIO-ECONOMIC
  // ==========================================
  renderSocioEconomicScreen(stateKey) {
    const prof = this.socioEconomicEngine.getSocioEconomicProfile(stateKey);
    const densityEl = document.getElementById('socioDensity');
    const urbanEl = document.getElementById('socioUrban');
    const radianceEl = document.getElementById('socioRadiance');
    const gdpEl = document.getElementById('socioGDP');
    const literacyEl = document.getElementById('socioLiteracy');

    if (densityEl) densityEl.textContent = prof.densityPerSqKm;
    if (urbanEl) urbanEl.textContent = `${prof.urbanShare} Urban / ${prof.ruralShare} Rural`;
    if (radianceEl) radianceEl.textContent = prof.viirsRadiance;
    if (gdpEl) gdpEl.textContent = prof.gdpContribution;
    if (literacyEl) literacyEl.textContent = prof.literacyRate;
  }

  // ==========================================
  // SCREEN 9: REPORT BUILDER
  // ==========================================
  renderReportBuilderScreen(stateKey) {
    const dossier = this.reportEngine.generateDossier(stateKey);
    const previewContainer = document.getElementById('dossierPreviewContainer');
    if (previewContainer) {
      previewContainer.innerHTML = `
        <div class="dossier-preview-sheet">
          <div class="dossier-header-section">
            <div>
              <span class="badge-black" style="margin-bottom:0.5rem; display:inline-block;">EXECUTIVE GIS DOSSIER</span>
              <h2>${dossier.state.name}</h2>
              <p style="color:#71717a; font-size:0.82rem;">Document ID: <strong>${dossier.dossierId}</strong> | Generated: ${dossier.generatedDate}</p>
            </div>
            <div style="text-align:right;">
              <span class="badge-white">${dossier.state.zone} Zone</span>
            </div>
          </div>
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:0.75rem; margin-bottom:1.5rem;">
            <div style="background:#f4f4f5; padding:0.85rem; border-radius:6px; border:1px solid #e4e4e7;">
              <span style="font-size:0.72rem; color:#71717a; font-weight:700;">CAPITAL</span>
              <h4 style="font-size:1.1rem; color:#000000; margin-top:0.2rem;">${dossier.state.capital}</h4>
            </div>
            <div style="background:#f4f4f5; padding:0.85rem; border-radius:6px; border:1px solid #e4e4e7;">
              <span style="font-size:0.72rem; color:#71717a; font-weight:700;">POPULATION</span>
              <h4 style="font-size:1.1rem; color:#000000; margin-top:0.2rem;">${dossier.state.population}</h4>
            </div>
            <div style="background:#f4f4f5; padding:0.85rem; border-radius:6px; border:1px solid #e4e4e7;">
              <span style="font-size:0.72rem; color:#71717a; font-weight:700;">AREA</span>
              <h4 style="font-size:1.1rem; color:#000000; margin-top:0.2rem;">${dossier.state.area}</h4>
            </div>
            <div style="background:#f4f4f5; padding:0.85rem; border-radius:6px; border:1px solid #e4e4e7;">
              <span style="font-size:0.72rem; color:#71717a; font-weight:700;">DISTRICTS</span>
              <h4 style="font-size:1.1rem; color:#000000; margin-top:0.2rem;">${dossier.state.districts}</h4>
            </div>
          </div>
          <h4 style="font-size:1.05rem; color:#000000; margin-bottom:0.6rem; font-weight:800;">1. Land Use Composition (ISRO Bhuvan / DES)</h4>
          <p style="font-size:0.82rem; color:#3f3f46; margin-bottom:1rem;">
            Agriculture: <strong>${dossier.state.land.agriculture}%</strong> | Forest: <strong>${dossier.state.land.forest}%</strong> | Built-up: <strong>${dossier.state.land.built}%</strong> | Water: <strong>${dossier.state.land.water}%</strong> | Barren: <strong>${dossier.state.land.barren}%</strong>
          </p>
          <h4 style="font-size:1.05rem; color:#000000; margin-bottom:0.6rem; font-weight:800;">2. Strategic Geospatial Infrastructure Projects</h4>
          <ul style="padding-left:1.25rem; font-size:0.82rem; color:#3f3f46; margin-bottom:1.5rem;">
            ${(dossier.state.keyProjects || []).map(p => `<li>${p}</li>`).join('')}
          </ul>
          <div style="display:flex; gap:0.75rem; border-top:1px solid #e4e4e7; padding-top:1.25rem;">
            <button class="btn-primary" onclick="window.app.reportEngine.printDossier()">Print / Export PDF</button>
            <button class="btn-secondary" onclick="window.app.reportEngine.downloadStateGeoJSON('${stateKey}')">Download GeoJSON</button>
            <button class="btn-secondary" onclick="window.app.reportEngine.downloadStateCSV()">Export All States CSV</button>
          </div>
        </div>
      `;
    }
  }

  // ==========================================
  // SCREEN 10: ADMIN DATA MANAGEMENT
  // ==========================================
  renderAdminScreen() {
    const stats = this.adminEngine.getPipelineStats();
    const statTotal = document.getElementById('adminTotalDatasets');
    const statOnline = document.getElementById('adminOnlineStatus');
    const statApis = document.getElementById('adminApis');
    const statSync = document.getElementById('adminLastSync');
    const tableBody = document.getElementById('adminDatasetsTableBody');

    if (statTotal) statTotal.textContent = stats.totalDatasets;
    if (statOnline) statOnline.textContent = stats.onlineStatus;
    if (statApis) statApis.textContent = stats.apisIntegrated;
    if (statSync) statSync.textContent = stats.lastCrawlerSync;

    if (tableBody) {
      tableBody.innerHTML = '';
      this.adminEngine.datasets.forEach(ds => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${ds.name}</strong></td>
          <td><span class="badge-white" style="font-size:0.72rem;">${ds.category.replace(/_/g, ' ')}</span></td>
          <td>${ds.provider}</td>
          <td><span class="badge-black">${ds.status}</span></td>
          <td><button class="btn-secondary" style="padding:0.25rem 0.65rem; font-size:0.72rem;" onclick="window.app.pingAdminDataset('${ds.id}')">Test Ping</button></td>
        `;
        tableBody.appendChild(tr);
      });
    }

    const auditContainer = document.getElementById('adminAuditLogsContainer');
    if (auditContainer) {
      auditContainer.innerHTML = '';
      this.adminEngine.auditLogs.forEach(log => {
        const div = document.createElement('div');
        div.style.padding = '0.6rem 0.75rem';
        div.style.borderBottom = '1px solid #f4f4f5';
        div.style.fontSize = '0.8rem';
        div.innerHTML = `
          <div style="display:flex; justify-content:space-between; color:#71717a;">
            <span><strong>${log.action}</strong> by ${log.user}</span>
            <span style="font-family:var(--font-mono); font-size:0.72rem;">${log.timestamp}</span>
          </div>
          <p style="color:#09090b; margin-top:0.2rem;">${log.details}</p>
        `;
        auditContainer.appendChild(div);
      });
    }
  }

  pingAdminDataset(datasetId) {
    const res = this.adminEngine.pingDataset(datasetId);
    this.showToast(`Ping ${res.name}: ${res.httpStatus} OK (${res.latency})`);
  }

  triggerCrawlerSync() {
    this.showToast("Starting automated dataset crawler batch...");
    this.adminEngine.triggerCrawlerSync().then(res => {
      this.renderAdminScreen();
      this.showToast(`Crawler sync completed: ${res.count} GIS resources verified.`);
    });
  }

  // ==========================================
  // RESOURCE LIBRARY (32 Datasets Filter)
  // ==========================================
  setupResourceLibrary() {
    const tabsContainer = document.getElementById('resourceCategoryTabs');

    if (tabsContainer) {
      const categories = [
        { id: "ALL", name: "All 32 Datasets" },
        { id: "01_Satellite_Imagery", name: "01 Satellite Imagery (12)" },
        { id: "02_Elevation_Roads_Boundaries", name: "02 Elevation & Roads (6)" },
        { id: "03_Population_Socioeconomic", name: "03 Population & Socio-Eco (5)" },
        { id: "04_Land_Records", name: "04 Land Records (3)" },
        { id: "05_Modeling_Tools", name: "05 Modeling Tools (6)" }
      ];

      tabsContainer.innerHTML = '';
      categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `category-tab-btn ${cat.id === this.currentResourceCategory ? 'active' : ''}`;
        btn.textContent = cat.name;
        btn.addEventListener('click', () => {
          this.currentResourceCategory = cat.id;
          document.querySelectorAll('.category-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
          this.renderResourceCards();
        });
        tabsContainer.appendChild(btn);
      });
    }

    this.renderResourceCards();
  }

  renderResourceCards() {
    const container = document.getElementById('resourceCardsGrid');
    if (!container) return;

    const filtered = this.currentResourceCategory === 'ALL'
      ? resourceDatabase
      : resourceDatabase.filter(r => r.category === this.currentResourceCategory);

    container.innerHTML = '';
    filtered.forEach(res => {
      const card = document.createElement('div');
      card.className = 'resource-card';
      card.innerHTML = `
        <div>
          <div class="resource-top-meta">
            <h4>${res.name}</h4>
            <span class="badge-black">${res.status}</span>
          </div>
          <div class="resource-provider">${res.provider}</div>
          <p class="resource-desc">${res.description}</p>
          <div class="resource-tags">
            <span class="badge-white">${res.accessType}</span>
            <span class="badge-gray">${res.coverage}</span>
            ${res.apiAvailable ? '<span class="badge-black">API Ready</span>' : ''}
          </div>
        </div>
        <div class="resource-actions">
          <span style="font-size:0.75rem; color:#71717a; font-family:var(--font-mono);">${res.formats[0] || 'Web GIS'}</span>
          <a href="${res.url}" target="_blank" rel="noopener" class="btn-primary" style="padding:0.35rem 0.85rem; font-size:0.78rem;">
            Open Portal
            <svg style="width:13px; height:13px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // ==========================================
  // GLOBAL SEARCH & AUTOCOMPLETE
  // ==========================================
  setupGlobalSearch() {
    const modalBackdrop = document.getElementById('searchModalBackdrop');
    const searchInput = document.getElementById('globalModalSearchInput');
    const heroSearchInput = document.getElementById('heroSearchInput');

    if (heroSearchInput) {
      heroSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.performHeroSearch();
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.renderSearchResults(e.target.value);
      });
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          this.closeSearchModal();
        }
      });
    }

    // Global keyboard shortcuts (Ctrl+K to open, Esc to close)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearchModal();
      } else if (e.key === 'Escape') {
        this.closeSearchModal();
      }
    });
  }

  performHeroSearch() {
    const heroSearchInput = document.getElementById('heroSearchInput');
    const val = heroSearchInput ? heroSearchInput.value.trim().toLowerCase() : '';
    if (val) {
      const match = Object.keys(stateDatabase).find(k => 
        k.includes(val) || 
        stateDatabase[k].name.toLowerCase().includes(val) || 
        stateDatabase[k].capital.toLowerCase().includes(val)
      );
      if (match) {
        this.selectState(match);
        this.switchScreen('main_dashboard');
        document.getElementById('profileStateName')?.scrollIntoView({ behavior: 'smooth' });
        this.showToast(`Navigated to ${stateDatabase[match].name}`);
        return;
      }
    }
    this.openSearchModal();
    if (val) {
      const searchInput = document.getElementById('globalModalSearchInput');
      if (searchInput) {
        searchInput.value = val;
        this.renderSearchResults(val);
      }
    }
  }

  openSearchModal() {
    const modal = document.getElementById('searchModalBackdrop');
    const input = document.getElementById('globalModalSearchInput');
    if (modal && input) {
      modal.classList.add('open');
      input.value = '';
      input.focus();
      this.renderSearchResults('');
    }
  }

  closeSearchModal() {
    const modal = document.getElementById('searchModalBackdrop');
    if (modal) modal.classList.remove('open');
  }

  renderSearchResults(query) {
    const container = document.getElementById('searchModalResults');
    if (!container) return;

    const q = query.trim().toLowerCase();
    container.innerHTML = '';

    // 1. States Search
    const matchingStates = Object.keys(stateDatabase).filter(k => 
      !q || k.includes(q) || stateDatabase[k].name.toLowerCase().includes(q) || stateDatabase[k].capital.toLowerCase().includes(q)
    ).slice(0, 5);

    if (matchingStates.length > 0) {
      const groupTitle = document.createElement('div');
      groupTitle.className = 'search-group-title';
      groupTitle.textContent = 'Indian States & UTs';
      container.appendChild(groupTitle);

      matchingStates.forEach(k => {
        const state = stateDatabase[k];
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <div class="search-result-left">
            <div class="search-result-icon">${state.code}</div>
            <div class="search-result-info">
              <h4>${state.name}</h4>
              <p>Capital: ${state.capital} | Population: ${state.population} | Area: ${state.area}</p>
            </div>
          </div>
          <span class="search-result-tag">${state.zone} Zone</span>
        `;
        item.addEventListener('click', () => {
          this.selectState(k);
          this.closeSearchModal();
          this.switchScreen('main_dashboard');
        });
        container.appendChild(item);
      });
    }

    // 2. Resources Search
    const matchingResources = resourceDatabase.filter(r =>
      !q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q)
    ).slice(0, 4);

    if (matchingResources.length > 0) {
      const groupTitle = document.createElement('div');
      groupTitle.className = 'search-group-title';
      groupTitle.textContent = 'GIS Datasets & Platforms';
      container.appendChild(groupTitle);

      matchingResources.forEach(r => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <div class="search-result-left">
            <div class="search-result-icon" style="background:#000000; color:#ffffff;">GIS</div>
            <div class="search-result-info">
              <h4>${r.name}</h4>
              <p>${r.provider} | ${r.accessType}</p>
            </div>
          </div>
          <span class="search-result-tag">${r.status}</span>
        `;
        item.addEventListener('click', () => {
          window.open(r.url, '_blank');
          this.closeSearchModal();
        });
        container.appendChild(item);
      });
    }
  }

  // ==========================================
  // TOAST NOTIFICATIONS (Pure Black & White)
  // ==========================================
  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <svg style="width:16px; height:16px; color:#ffffff; flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  openSuitabilityForState(stateKey) {
    this.selectState(stateKey);
    this.switchScreen('site_suitability');
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.app = new IndiaLandApp();
  window.app.init();
});

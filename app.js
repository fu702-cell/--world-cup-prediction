// World Cup 2026 Prediction Web Application Controller
// Orchestrates user interaction, runs simulators, and handles rendering.

// Flag Mapping
const FLAG_MAP = {
  usa: "🇺🇸", colombia: "🇨🇴", nigeria: "🇳🇬", iraq: "🇮🇶",
  mexico: "🇲🇽", croatia: "🇭🇷", egypt: "🇪🇬", australia: "🇦🇺",
  canada: "🇨🇦", uruguay: "🇺🇾", turkey: "🇹🇷", qatar: "🇶🇦",
  argentina: "🇦🇷", denmark: "🇩🇰", algeria: "🇩🇿", uzbekistan: "🇺🇿",
  france: "🇫🇷", switzerland: "🇨🇭", senegal: "🇸🇳", saudi_arabia: "🇸🇦",
  brazil: "🇧🇷", austria: "🇦🇹", tunisia: "🇹🇳", panama: "🇵🇦",
  england: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", ecuador: "🇪🇨", mali: "🇲🇱", jamaica: "🇯🇲",
  spain: "🇪🇸", chile: "🇨🇱", ivory_coast: "🇨🇮", costa_rica: "🇨🇷",
  portugal: "🇵🇹", netherlands: "🇳🇱", peru: "🇵🇪", new_zealand: "🇳🇿",
  italy: "🇮🇹", morocco: "🇲🇦", south_korea: "🇰🇷", honduras: "🇭🇳",
  germany: "🇩🇪", japan: "🇯🇵", poland: "🇵🇱", angola: "🇦🇴",
  belgium: "🇧🇪", ukraine: "🇺🇦", cameroon: "🇨🇲", iran: "🇮🇷",
  south_africa: "🇿🇦", czechia: "🇨🇿", bosnia: "🇧🇦", haiti: "🇭🇹",
  scotland: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", paraguay: "🇵🇾", curacao: "🇨🇼", sweden: "🇸🇪",
  cape_verde: "🇨🇻", norway: "🇳🇴", jordan: "🇯🇴", dr_congo: "🇨🇩",
  ghana: "🇬🇭"
};

// Global Application State
let appState = {
  teams: [],
  selectedHomeId: "argentina",
  selectedAwayId: "france",
  matchLocation: "neutral", // neutral, home-host, away-host, home-continent, away-continent
  activeTab: "tab-predictor",
  activeSimSubtab: "subtab-groups",
  monteCarloRunning: false,
  monteCarloResults: null,
  singleSimDone: false,
  currentSimData: null
};

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  // Load teams from data.js (cloned deeply to avoid mutating base database during editing)
  appState.teams = JSON.parse(JSON.stringify(TEAMS_DATA));
  
  initTabNavigation();
  initMatchPredictor();
  initTournamentSimulator();
  initTeamDatabase();
  initModal();
  
  // Initial calculation
  calculateMatchPrediction();
});

// ==========================================
// TABS NAVIGATION
// ==========================================
function initTabNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      
      navButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      
      btn.classList.add("active");
      document.getElementById(tabId).classList.add("active");
      appState.activeTab = tabId;
      
      // Refresh context if needed
      if (tabId === "tab-predictor") {
        refreshPredictorSelectors();
        calculateMatchPrediction();
      } else if (tabId === "tab-database") {
        renderTeamDatabase();
      }
    });
  });

  // Simulator Subtabs Navigation
  const subnavButtons = document.querySelectorAll(".subnav-btn");
  const subtabContents = document.querySelectorAll(".subtab-content");

  subnavButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const subtabId = btn.getAttribute("data-subtab");
      
      subnavButtons.forEach(b => b.classList.remove("active"));
      subtabContents.forEach(c => c.classList.remove("active"));
      
      btn.classList.add("active");
      document.getElementById(subtabId).classList.add("active");
      appState.activeSimSubtab = subtabId;
    });
  });
}

// ==========================================
// MATCH PREDICTOR LOGIC
// ==========================================
function initMatchPredictor() {
  const homeSelect = document.getElementById("home-team-select");
  const awaySelect = document.getElementById("away-team-select");

  // Populate selectors
  populatePredictorSelectors();

  // Selection events
  homeSelect.addEventListener("change", (e) => {
    appState.selectedHomeId = e.target.value;
    renderStarPlayers("home", appState.selectedHomeId);
    calculateMatchPrediction();
  });

  awaySelect.addEventListener("change", (e) => {
    appState.selectedAwayId = e.target.value;
    renderStarPlayers("away", appState.selectedAwayId);
    calculateMatchPrediction();
  });

  // Location Factor change events
  const locationRadios = document.querySelectorAll("input[name='match-location']");
  locationRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      appState.matchLocation = e.target.value;
      calculateMatchPrediction();
    });
  });

  // Odds inputs events
  const oddsInputs = ["odds-home", "odds-draw", "odds-away", "odds-handicap", "handicap-select"];
  oddsInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", calculateMatchPrediction);
    document.getElementById(id).addEventListener("change", calculateMatchPrediction);
  });

  // Initial render of players
  renderStarPlayers("home", appState.selectedHomeId);
  renderStarPlayers("away", appState.selectedAwayId);
}

function populatePredictorSelectors() {
  const homeSelect = document.getElementById("home-team-select");
  const awaySelect = document.getElementById("away-team-select");
  
  homeSelect.innerHTML = "";
  awaySelect.innerHTML = "";

  // Sort teams alphabetically
  const sortedTeams = [...appState.teams].sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));

  sortedTeams.forEach(team => {
    const optHome = document.createElement("option");
    optHome.value = team.id;
    optHome.textContent = `${FLAG_MAP[team.id] || ""} ${team.name}`;
    optHome.selected = team.id === appState.selectedHomeId;
    homeSelect.appendChild(optHome);

    const optAway = document.createElement("option");
    optAway.value = team.id;
    optAway.textContent = `${FLAG_MAP[team.id] || ""} ${team.name}`;
    optAway.selected = team.id === appState.selectedAwayId;
    awaySelect.appendChild(optAway);
  });
}

function refreshPredictorSelectors() {
  const homeSelect = document.getElementById("home-team-select");
  const awaySelect = document.getElementById("away-team-select");
  
  homeSelect.value = appState.selectedHomeId;
  awaySelect.value = appState.selectedAwayId;
  
  renderStarPlayers("home", appState.selectedHomeId);
  renderStarPlayers("away", appState.selectedAwayId);
}

function renderStarPlayers(side, teamId) {
  const container = document.getElementById(`${side}-players-list`);
  container.innerHTML = "";

  const team = appState.teams.find(t => t.id === teamId);
  if (!team || !team.players || team.players.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); font-size: 0.8rem; text-align: center;">该队无录入的关键主力球员</div>`;
    return;
  }

  team.players.forEach(p => {
    const row = document.createElement("div");
    row.className = "player-status-row";

    const starsHtml = "★".repeat(p.stars) + "☆".repeat(5 - p.stars);
    row.innerHTML = `
      <div class="player-info">
        <span class="player-pos">${p.pos}</span>
        <span class="player-name">${p.name}</span>
        <span class="player-stars font-orbitron">${starsHtml}</span>
      </div>
      <div class="status-toggles">
        <button class="status-btn ${p.status === 'fit' ? 'active' : ''}" data-status="fit" data-player-id="${p.id}" data-side="${side}">健康</button>
        <button class="status-btn ${p.status === 'peak' ? 'active' : ''}" data-status="peak" data-player-id="${p.id}" data-side="${side}">巅峰</button>
        <button class="status-btn ${p.status === 'fatigued' ? 'active' : ''}" data-status="fatigued" data-player-id="${p.id}" data-side="${side}">疲劳</button>
        <button class="status-btn ${p.status === 'injured' ? 'active' : ''}" data-status="injured" data-player-id="${p.id}" data-side="${side}">伤病</button>
      </div>
    `;

    // Add click listeners to buttons
    const buttons = row.querySelectorAll(".status-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const newStatus = btn.getAttribute("data-status");
        p.status = newStatus;
        
        // Update styling
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        calculateMatchPrediction();
      });
    });

    container.appendChild(row);
  });
}

function calculateMatchPrediction() {
  const homeTeam = appState.teams.find(t => t.id === appState.selectedHomeId);
  const awayTeam = appState.teams.find(t => t.id === appState.selectedAwayId);

  if (!homeTeam || !awayTeam) return;

  // Determine host and continent flags
  let isHomeHost = appState.matchLocation === "home-host";
  let isAwayHost = appState.matchLocation === "away-host";
  let isHomeSameCont = appState.matchLocation === "home-continent";
  let isAwaySameCont = appState.matchLocation === "away-continent";

  // Calculate adjusted Elo
  const eloA = mathEngine.getAdjustedElo(homeTeam, isHomeHost, isHomeSameCont);
  const eloB = mathEngine.getAdjustedElo(awayTeam, isAwayHost, isAwaySameCont);

  // Update ratings in DOM
  document.getElementById("home-badge").textContent = FLAG_MAP[homeTeam.id] || "🏳️";
  document.getElementById("away-badge").textContent = FLAG_MAP[awayTeam.id] || "🏳️";
  document.getElementById("home-base-elo").textContent = homeTeam.elo;
  document.getElementById("away-base-elo").textContent = awayTeam.elo;
  document.getElementById("home-adj-elo").textContent = Math.round(eloA);
  document.getElementById("away-adj-elo").textContent = Math.round(eloB);

  // Calculate Lambda (expected goals)
  const { lambdaA, lambdaB } = mathEngine.calculateExpectedGoals(eloA, eloB);
  document.getElementById("xg-home-val").textContent = lambdaA.toFixed(2);
  document.getElementById("xg-away-val").textContent = lambdaB.toFixed(2);

  // Generate Poisson Score Matrix (10x10)
  const matrix = mathEngine.generateScoreMatrix(lambdaA, lambdaB, 10);

  // Compute standard outcomes
  const outcomes = mathEngine.computeMatchOutcomes(matrix);

  // Update probability bar
  const probHomePct = (outcomes.homeWin * 100).toFixed(1) + "%";
  const probDrawPct = (outcomes.draw * 100).toFixed(1) + "%";
  const probAwayPct = (outcomes.awayWin * 100).toFixed(1) + "%";

  const homeSegment = document.querySelector(".prob-home");
  const drawSegment = document.querySelector(".prob-draw");
  const awaySegment = document.querySelector(".prob-away");

  homeSegment.style.width = probHomePct;
  homeSegment.querySelector(".val").textContent = probHomePct;
  
  drawSegment.style.width = probDrawPct;
  drawSegment.querySelector(".val").textContent = probDrawPct;
  
  awaySegment.style.width = probAwayPct;
  awaySegment.querySelector(".val").textContent = probAwayPct;

  // Update other statistics
  document.getElementById("prob-under-val").textContent = (outcomes.under2_5 * 100).toFixed(1) + "%";
  document.getElementById("prob-over-val").textContent = (outcomes.over2_5 * 100).toFixed(1) + "%";
  document.getElementById("prob-btts-val").textContent = (outcomes.btts * 100).toFixed(1) + "%";

  // Find most likely scoreline
  let maxProb = 0;
  let bestH = 1, bestA = 1;
  for (let h = 0; h < 6; h++) {
    for (let a = 0; a < 6; a++) {
      if (matrix[h][a] > maxProb) {
        maxProb = matrix[h][a];
        bestH = h;
        bestA = a;
      }
    }
  }
  document.getElementById("prob-exact-val").textContent = `${bestH} - ${bestA} (${(maxProb * 100).toFixed(1)}%)`;

  // Render Poisson Heatmap (6x6 for space and readability)
  renderPoissonHeatmap(matrix, bestH, bestA);

  // Calculate Kelly betting filtration
  calculateKellyBetting(outcomes, matrix);
}

function renderPoissonHeatmap(matrix, bestH, bestA) {
  const table = document.getElementById("poisson-heatmap");
  table.innerHTML = "";

  // Header row (Away goals)
  const headerRow = document.createElement("tr");
  const cornerTh = document.createElement("th");
  cornerTh.innerHTML = "主 \\ 客";
  headerRow.appendChild(cornerTh);

  for (let a = 0; a <= 5; a++) {
    const th = document.createElement("th");
    th.className = "font-orbitron";
    th.textContent = `${a}球`;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  // Rows (Home goals)
  for (let h = 0; h <= 5; h++) {
    const row = document.createElement("tr");
    
    // Row header (Home goals)
    const th = document.createElement("th");
    th.className = "font-orbitron";
    th.textContent = `${h}球`;
    row.appendChild(th);

    // Cells
    for (let a = 0; a <= 5; a++) {
      const td = document.createElement("td");
      td.className = "heatmap-cell";
      
      const prob = matrix[h][a];
      const probPct = (prob * 100).toFixed(2);
      
      // Background shading based on probability (maximum is usually around 0.15)
      const maxIntensity = 0.15;
      const intensity = Math.min(1, prob / maxIntensity);
      
      // Interpolate colors: slate grey (rgba(15, 22, 42, 0.4)) to bright cyan (rgba(0, 242, 254, intensity))
      td.style.backgroundColor = `rgba(0, 242, 254, ${intensity * 0.4})`;
      
      // Highlight exact score
      if (h === bestH && a === bestA) {
        td.style.boxShadow = "inset 0 0 0 2px var(--neon-gold)";
      }

      td.innerHTML = `
        <span class="cell-prob font-orbitron" style="color: rgba(255,255,255,${0.5 + intensity * 0.5})">${probPct}%</span>
        <span class="cell-score">${h}-${a}</span>
      `;

      // Cell click details
      td.addEventListener("click", () => {
        alert(`比分预测详情：\n主队 ${h} - 客队 ${a}\n理论概率：${probPct}%\n折合市场公允赔率：${(1/prob).toFixed(2)}`);
      });

      row.appendChild(td);
    }
    table.appendChild(row);
  }
}

function calculateKellyBetting(outcomes, matrix) {
  const oddsH = parseFloat(document.getElementById("odds-home").value);
  const oddsD = parseFloat(document.getElementById("odds-draw").value);
  const oddsA = parseFloat(document.getElementById("odds-away").value);
  
  const handicapVal = parseFloat(document.getElementById("handicap-select").value);
  const oddsHandicap = parseFloat(document.getElementById("odds-handicap").value);

  const panel = document.getElementById("kelly-panel");
  panel.innerHTML = "";

  // Normalize odds to find margins
  const norm = mathEngine.normalizeOdds(oddsH, oddsD, oddsA);
  const marginInfo = norm ? ` (庄家抽水: ${(norm.margin * 100).toFixed(1)}%)` : "";

  // Calculate Kelly for 1X2 outcomes
  const kellyHome = mathEngine.calculateKelly(outcomes.homeWin, oddsH);
  const kellyDraw = mathEngine.calculateKelly(outcomes.draw, oddsD);
  const kellyAway = mathEngine.calculateKelly(outcomes.awayWin, oddsA);

  // Calculate handicap probability
  // Note: handicap input is from Home perspective (e.g. -0.5)
  const handProbs = mathEngine.computeHandicapProbabilities(matrix, handicapVal);
  // For betting on handicap, if it pushes we get money back, so the fair decimal odds apply to the winning probability.
  // Fair win probability adjusting for push: win_prob / (1 - push_prob)
  const adjustedHandicapWinProb = handProbs.push >= 1 ? 0 : handProbs.win / (1 - handProbs.push);
  // Kelly calculation on handicap
  const kellyHandicap = mathEngine.calculateKelly(adjustedHandicapWinProb, oddsHandicap);

  // HTML Rendering
  let html = `
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
      🔍 <strong>模型估值报告</strong> ${marginInfo}
    </div>
  `;

  // Draw 1X2 values
  const drawBetLine = (name, modelProb, odds, kellyResult) => {
    const kellyPct = (kellyResult.fraction * 100).toFixed(1);
    const edgePct = (kellyResult.edge * 100).toFixed(1);
    const hasValue = kellyResult.isValue;
    
    return `
      <div class="kelly-item">
        <span>${name} (赔率 ${odds.toFixed(2)})</span>
        <span>模型概率: <strong>${(modelProb*100).toFixed(1)}%</strong></span>
        <span class="kelly-tag ${hasValue ? 'kelly-value-yes' : 'kelly-value-no'}">
          ${hasValue ? `有价值 (+${edgePct}%)` : '无价值'}
        </span>
        <span>推荐仓位: <strong class="${hasValue ? 'kelly-recom font-orbitron' : ''}">${hasValue ? `${kellyPct}%` : '0%'}</strong></span>
      </div>
    `;
  };

  html += drawBetLine("主胜 (3)", outcomes.homeWin, oddsH, kellyHome);
  html += drawBetLine("平局 (X)", outcomes.draw, oddsD, kellyDraw);
  html += drawBetLine("客胜 (0)", outcomes.awayWin, oddsA, kellyAway);

  // Draw Handicap value
  const handDesc = handicapVal > 0 ? `+${handicapVal}` : `${handicapVal}`;
  const handicapResultHtml = `
    <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed rgba(255,255,255,0.1);">
      <div class="kelly-item" style="border-bottom: none;">
        <span>主队让球 (${handDesc}) 赔率 ${oddsHandicap.toFixed(2)}</span>
        <span style="font-size: 0.75rem; text-align: right; color: var(--text-secondary);">
          胜/半胜/走/负概率: <br>
          <strong style="color: var(--neon-cyan);">${(handProbs.win*100).toFixed(1)}%</strong> / 
          <strong>${(handProbs.halfWin*100).toFixed(1)}%</strong> / 
          <strong>${(handProbs.push*100).toFixed(1)}%</strong> / 
          <strong>${(handProbs.loss*100).toFixed(1)}%</strong>
        </span>
      </div>
      <div class="kelly-item" style="border-bottom: none; margin-top: 4px;">
        <span>让球折算赢率: <strong>${(adjustedHandicapWinProb*100).toFixed(1)}%</strong></span>
        <span class="kelly-tag ${kellyHandicap.isValue ? 'kelly-value-yes' : 'kelly-value-no'}">
          ${kellyHandicap.isValue ? `有价值 (+${(kellyHandicap.edge*100).toFixed(1)}%)` : '无价值'}
        </span>
        <span>推荐仓位: <strong class="${kellyHandicap.isValue ? 'kelly-recom font-orbitron' : ''}">${kellyHandicap.isValue ? `${(kellyHandicap.fraction*100).toFixed(1)}%` : '0%'}</strong></span>
      </div>
    </div>
  `;

  html += handicapResultHtml;
  panel.innerHTML = html;
}

// ==========================================
// TOURNAMENT SIMULATOR ENGINE (48 Teams)
// ==========================================
function initTournamentSimulator() {
  document.getElementById("btn-run-once").addEventListener("click", runSingleSimulation);
  document.getElementById("btn-run-montecarlo").addEventListener("click", runMonteCarloSimulation);
  document.getElementById("btn-reset-sim").addEventListener("click", resetSimulation);
  
  // Render empty group structures initially
  renderGroupsContainer();
}

function renderGroupsContainer() {
  const container = document.getElementById("groups-container");
  container.innerHTML = "";

  GROUPS.forEach(g => {
    const card = document.createElement("div");
    card.className = "glass-card group-card animate-slide-in";
    
    // Filter teams in this group
    const groupTeams = appState.teams.filter(t => t.group === g);
    
    let rowsHtml = "";
    groupTeams.forEach((t, index) => {
      rowsHtml += `
        <tr>
          <td class="pos">${index + 1}</td>
          <td class="team-name">${FLAG_MAP[t.id] || ""} ${t.name}</td>
          <td class="num font-orbitron">0</td>
          <td class="num font-orbitron">0</td>
          <td class="pts font-orbitron">0</td>
        </tr>
      `;
    });

    card.innerHTML = `
      <div class="group-card-header">
        <span>小组 ${g}</span>
        <span style="font-size: 0.7rem; color: var(--text-muted);">Elo: ${Math.round(groupTeams.reduce((sum, t) => sum + t.elo, 0)/4)}</span>
      </div>
      <table class="group-table">
        <thead>
          <tr>
            <th>#</th>
            <th>球队</th>
            <th style="text-align: right;">得失</th>
            <th style="text-align: right;">净</th>
            <th style="text-align: right;">分</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
    container.appendChild(card);
  });
}

/**
 * Simulates a single match score using Poisson expectations.
 * Returns { scoreH, scoreA, winner } where winner is 'home', 'away', or 'draw'
 */
function simulateMatchScore(teamA, teamB, isKnockout = false) {
  // Check location factor (neutral context in simulator, but check host flags)
  const eloA = mathEngine.getAdjustedElo(teamA, teamA.isHost, false);
  const eloB = mathEngine.getAdjustedElo(teamB, teamB.isHost, false);

  const { lambdaA, lambdaB } = mathEngine.calculateExpectedGoals(eloA, eloB);

  // Generate scores using inverse transform sampling
  const drawPoisson = (lambda) => {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return k - 1;
  };

  let scoreA = drawPoisson(lambdaA);
  let scoreB = drawPoisson(lambdaB);

  // Knockout extra-time and penalties logic
  if (isKnockout && scoreA === scoreB) {
    // 1. Simulate Extra Time (30 mins = 1/3 goals lambda)
    const extraScoreA = drawPoisson(lambdaA / 3);
    const extraScoreB = drawPoisson(lambdaB / 3);
    scoreA += extraScoreA;
    scoreB += extraScoreB;

    // 2. Simulate Penalty Shootout if still tied
    if (scoreA === scoreB) {
      // Base shootout probability is 50-50, but adjust slightly based on Elo (e.g. up to 10% edge)
      const diff = eloA - eloB;
      const teamAWinPct = 0.5 + Math.min(0.1, Math.max(-0.1, diff / 1000));
      
      if (Math.random() < teamAWinPct) {
        // Team A wins shootout, mark with +1 to score in bracket display (or denote penalty winner)
        return { scoreH: scoreA, scoreA: scoreB, penaltyWinner: "home" };
      } else {
        return { scoreH: scoreA, scoreA: scoreB, penaltyWinner: "away" };
      }
    }
  }

  return {
    scoreH: scoreA,
    scoreA: scoreB,
    winner: scoreA > scoreB ? "home" : (scoreA < scoreB ? "away" : "draw")
  };
}

/**
 * Runs a single complete tournament simulation.
 */
function runSingleSimulation() {
  if (appState.monteCarloRunning) return;

  // Initialize simulation data structure
  const sim = {
    teams: JSON.parse(JSON.stringify(appState.teams)), // Cloned list with stats
    groupStandings: {}, // Map of group -> team stats array
    thirdPlaces: [],
    bracket: {
      r32: [], // Round of 32 matches
      r16: [], // Round of 16
      qf: [],  // Quarterfinals
      sf: [],  // Semifinals
      thirdPlace: null, // Third place playoff
      final: null, // Final
      champion: null
    }
  };

  // 1. Initialize standing stats for each team
  sim.teams.forEach(t => {
    t.sim = { w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  });

  // 2. Simulate Group Matches
  GROUPS.forEach(g => {
    const groupTeams = sim.teams.filter(t => t.group === g);
    
    // Group plays round robin (6 matches)
    for (let i = 0; i < groupTeams.length; i++) {
      for (let j = i + 1; j < groupTeams.length; j++) {
        const teamA = groupTeams[i];
        const teamB = groupTeams[j];
        
        const res = simulateMatchScore(teamA, teamB, false);
        
        teamA.sim.gf += res.scoreH;
        teamA.sim.ga += res.scoreA;
        teamA.sim.gd += (res.scoreH - res.scoreA);
        
        teamB.sim.gf += res.scoreA;
        teamB.sim.ga += res.scoreH;
        teamB.sim.gd += (res.scoreA - res.scoreH);

        if (res.winner === "home") {
          teamA.sim.w += 1;
          teamA.sim.pts += 3;
          teamB.sim.l += 1;
        } else if (res.winner === "away") {
          teamB.sim.w += 1;
          teamB.sim.pts += 3;
          teamA.sim.l += 1;
        } else {
          teamA.sim.d += 1;
          teamA.sim.pts += 1;
          teamB.sim.d += 1;
          teamB.sim.pts += 1;
        }
      }
    }

    // Sort group standings: 1. Pts, 2. GD, 3. GF, 4. base Elo
    groupTeams.sort((a, b) => {
      if (b.sim.pts !== a.sim.pts) return b.sim.pts - a.sim.pts;
      if (b.sim.gd !== a.sim.gd) return b.sim.gd - a.sim.gd;
      if (b.sim.gf !== a.sim.gf) return b.sim.gf - a.sim.gf;
      return b.elo - a.elo;
    });

    sim.groupStandings[g] = groupTeams;
  });

  // 3. Compile Third-Place Rankings (12 teams)
  GROUPS.forEach(g => {
    const standings = sim.groupStandings[g];
    const thirdTeam = standings[2]; // 3rd element (index 2)
    sim.thirdPlaces.push({
      team: thirdTeam,
      group: g
    });
  });

  // Sort Third-Place leaderboard: 1. Pts, 2. GD, 3. GF, 4. base Elo
  sim.thirdPlaces.sort((a, b) => {
    if (b.team.sim.pts !== a.team.sim.pts) return b.team.sim.pts - a.team.sim.pts;
    if (b.team.sim.gd !== a.team.sim.gd) return b.team.sim.gd - a.team.sim.gd;
    if (b.team.sim.gf !== a.team.sim.gf) return b.team.sim.gf - a.team.sim.gf;
    return b.team.elo - a.team.elo;
  });

  // Top 8 advance
  const qualifiedThirds = sim.thirdPlaces.slice(0, 8).map(x => x.team);

  // 4. Assemble the Round of 32 Seeding
  // Qualifiers: 12 group winners, 12 runners-up, 8 best thirds
  const winners = GROUPS.map(g => sim.groupStandings[g][0]);
  const runnersUp = GROUPS.map(g => sim.groupStandings[g][1]);

  // Seeding brackets logic (deterministic layout)
  // Let's create the 16 match-ups for R32
  // We pair them such that group winners play thirds / lower runnersUp, and avoid same-group matchups.
  // Matchup indices:
  const r32Matches = [];

  const addMatch = (teamA, teamB, name) => {
    r32Matches.push({ teamA, teamB, name, scoreA: null, scoreB: null, penaltyWinner: null, winner: null });
  };

  // Set up matchups (ensuring A1 vs 3rd, etc.)
  // Let's map Winners and RunnersUp and Thirds into a balanced tree
  addMatch(winners[0], qualifiedThirds[0], "M1");  // A1 vs 3rd-1
  addMatch(runnersUp[1], runnersUp[2], "M2");     // B2 vs C2
  addMatch(winners[2], qualifiedThirds[1], "M3");  // C1 vs 3rd-2
  addMatch(winners[3], runnersUp[4], "M4");        // D1 vs E2
  addMatch(winners[4], qualifiedThirds[2], "M5");  // E1 vs 3rd-3
  addMatch(winners[5], runnersUp[6], "M6");        // F1 vs G2
  addMatch(winners[6], qualifiedThirds[3], "M7");  // G1 vs 3rd-4
  addMatch(winners[7], runnersUp[8], "M8");        // H1 vs I2

  addMatch(winners[8], qualifiedThirds[4], "M9");  // I1 vs 3rd-5
  addMatch(winners[9], runnersUp[10], "M10");     // J1 vs K2
  addMatch(winners[10], qualifiedThirds[5], "M11"); // K1 vs 3rd-6
  addMatch(winners[11], runnersUp[0], "M12");     // L1 vs A2
  addMatch(winners[1], qualifiedThirds[6], "M13"); // B1 vs 3rd-7
  addMatch(runnersUp[3], runnersUp[5], "M14");     // D2 vs F2
  addMatch(runnersUp[7], runnersUp[9], "M15");     // H2 vs J2
  addMatch(runnersUp[11], qualifiedThirds[7], "M16"); // L2 vs 3rd-8

  // Simulate Round of 32
  const r16Teams = [];
  r32Matches.forEach(m => {
    const res = simulateMatchScore(m.teamA, m.teamB, true);
    m.scoreA = res.scoreH;
    m.scoreB = res.scoreA;
    m.penaltyWinner = res.penaltyWinner;
    
    if (res.penaltyWinner === "home" || res.scoreH > res.scoreA) {
      m.winner = m.teamA;
    } else {
      m.winner = m.teamB;
    }
    r16Teams.push(m.winner);
  });
  sim.bracket.r32 = r32Matches;

  // Simulate Round of 16 (8 matches)
  const r16Matches = [];
  const qfTeams = [];
  for (let i = 0; i < 16; i += 2) {
    const teamA = r16Teams[i];
    const teamB = r16Teams[i+1];
    const res = simulateMatchScore(teamA, teamB, true);
    
    const m = { teamA, teamB, name: `R16-${i/2+1}`, scoreA: res.scoreH, scoreB: res.scoreA, penaltyWinner: res.penaltyWinner, winner: null };
    if (res.penaltyWinner === "home" || res.scoreH > res.scoreA) {
      m.winner = teamA;
    } else {
      m.winner = teamB;
    }
    r16Matches.push(m);
    qfTeams.push(m.winner);
  }
  sim.bracket.r16 = r16Matches;

  // Simulate Quarterfinals (4 matches)
  const qfMatches = [];
  const sfTeams = [];
  for (let i = 0; i < 8; i += 2) {
    const teamA = qfTeams[i];
    const teamB = qfTeams[i+1];
    const res = simulateMatchScore(teamA, teamB, true);
    
    const m = { teamA, teamB, name: `QF-${i/2+1}`, scoreA: res.scoreH, scoreB: res.scoreA, penaltyWinner: res.penaltyWinner, winner: null };
    if (res.penaltyWinner === "home" || res.scoreH > res.scoreA) {
      m.winner = teamA;
    } else {
      m.winner = teamB;
    }
    qfMatches.push(m);
    sfTeams.push(m.winner);
  }
  sim.bracket.qf = qfMatches;

  // Simulate Semifinals (2 matches)
  const sfMatches = [];
  const finalTeams = [];
  const thirdPlayoffTeams = [];

  for (let i = 0; i < 4; i += 2) {
    const teamA = sfTeams[i];
    const teamB = sfTeams[i+1];
    const res = simulateMatchScore(teamA, teamB, true);
    
    const m = { teamA, teamB, name: `SF-${i/2+1}`, scoreA: res.scoreH, scoreB: res.scoreA, penaltyWinner: res.penaltyWinner, winner: null, loser: null };
    if (res.penaltyWinner === "home" || res.scoreH > res.scoreA) {
      m.winner = teamA;
      m.loser = teamB;
    } else {
      m.winner = teamB;
      m.loser = teamA;
    }
    sfMatches.push(m);
    finalTeams.push(m.winner);
    thirdPlayoffTeams.push(m.loser);
  }
  sim.bracket.sf = sfMatches;

  // Third Place Playoff
  const tpRes = simulateMatchScore(thirdPlayoffTeams[0], thirdPlayoffTeams[1], true);
  sim.bracket.thirdPlace = {
    teamA: thirdPlayoffTeams[0],
    teamB: thirdPlayoffTeams[1],
    name: "3rd-Playoff",
    scoreA: tpRes.scoreH,
    scoreB: tpRes.scoreA,
    penaltyWinner: tpRes.penaltyWinner,
    winner: (tpRes.penaltyWinner === "home" || tpRes.scoreH > tpRes.scoreA) ? thirdPlayoffTeams[0] : thirdPlayoffTeams[1]
  };

  // Final
  const finalRes = simulateMatchScore(finalTeams[0], finalTeams[1], true);
  sim.bracket.final = {
    teamA: finalTeams[0],
    teamB: finalTeams[1],
    name: "Final",
    scoreA: finalRes.scoreH,
    scoreB: finalRes.scoreA,
    penaltyWinner: finalRes.penaltyWinner,
    winner: (finalRes.penaltyWinner === "home" || finalRes.scoreH > finalRes.scoreA) ? finalTeams[0] : finalTeams[1]
  };

  sim.bracket.champion = sim.bracket.final.winner;

  // Render Simulation Results
  appState.currentSimData = sim;
  appState.singleSimDone = true;
  
  renderGroupTablesInDom(sim);
  renderThirdPlaceInDom(sim);
  renderKnockoutBracketInDom(sim);
  
  // Jump to group subtab
  document.querySelector('.subnav-btn[data-subtab="subtab-groups"]').click();
}

function renderGroupTablesInDom(sim) {
  const container = document.getElementById("groups-container");
  container.innerHTML = "";

  GROUPS.forEach(g => {
    const card = document.createElement("div");
    card.className = "glass-card group-card animate-slide-in";
    
    const standings = sim.groupStandings[g];
    
    let rowsHtml = "";
    standings.forEach((t, index) => {
      // Classes to denote qualification status
      let qualClass = "";
      if (index < 2) qualClass = "qualify-top";
      else if (index === 2) qualClass = "qualify-3rd";

      rowsHtml += `
        <tr class="${qualClass}">
          <td class="pos">${index + 1}</td>
          <td class="team-name" style="text-shadow: ${t.isHost ? '0 0 8px rgba(0, 242, 254, 0.4)' : 'none'}">
            ${FLAG_MAP[t.id] || ""} ${t.name} ${t.isHost ? "🏠" : ""}
          </td>
          <td class="num font-orbitron">${t.sim.gf}:${t.sim.ga}</td>
          <td class="num font-orbitron">${t.sim.gd > 0 ? "+" : ""}${t.sim.gd}</td>
          <td class="pts font-orbitron">${t.sim.pts}</td>
        </tr>
      `;
    });

    card.innerHTML = `
      <div class="group-card-header">
        <span>小组 ${g}</span>
      </div>
      <table class="group-table">
        <thead>
          <tr>
            <th>#</th>
            <th>球队</th>
            <th style="text-align: right;">得失</th>
            <th style="text-align: right;">净</th>
            <th style="text-align: right;">分</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
    container.appendChild(card);
  });
}

function renderThirdPlaceInDom(sim) {
  const tbody = document.getElementById("third-places-tbody");
  tbody.innerHTML = "";

  // The sorted list of 12 third-place teams
  sim.thirdPlaces.forEach((tp, index) => {
    const isQualify = index < 8;
    const row = document.createElement("tr");
    
    if (isQualify) {
      row.className = "third-place-qualify";
    }

    row.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>小组 ${tp.group}</strong></td>
      <td>${FLAG_MAP[tp.team.id] || ""} ${tp.team.name}</td>
      <td class="font-orbitron" style="font-weight: bold;">${tp.team.sim.pts}</td>
      <td class="font-orbitron">${tp.team.sim.gd > 0 ? "+" : ""}${tp.team.sim.gd}</td>
      <td class="font-orbitron">${tp.team.sim.gf}</td>
      <td>${tp.team.sim.w}-${tp.team.sim.d}-${tp.team.sim.l}</td>
      <td>${tp.team.elo}</td>
      <td><span class="kelly-tag ${isQualify ? 'kelly-value-yes' : 'kelly-value-no'}">${isQualify ? '晋级 32强' : '淘汰'}</span></td>
    `;
    tbody.appendChild(row);
  });
}

function renderKnockoutBracketInDom(sim) {
  const container = document.getElementById("bracket-container");
  container.innerHTML = "";

  const bracketRow = document.createElement("div");
  bracketRow.className = "bracket-row animate-slide-in";

  // Columns setup
  const colR32 = document.createElement("div"); colR32.className = "bracket-column";
  const colR16 = document.createElement("div"); colR16.className = "bracket-column";
  const colQF = document.createElement("div");  colQF.className = "bracket-column";
  const colSF = document.createElement("div");  colSF.className = "bracket-column";
  const colFinal = document.createElement("div"); colFinal.className = "bracket-column";
  const colChamp = document.createElement("div"); colChamp.className = "bracket-column";

  // Headers
  colR32.innerHTML = `<div class="round-header">32 强 (Round of 32)</div>`;
  colR16.innerHTML = `<div class="round-header">16 强 (Round of 16)</div>`;
  colQF.innerHTML = `<div class="round-header">四分之一决赛 (QF)</div>`;
  colSF.innerHTML = `<div class="round-header">半决赛 (SF)</div>`;
  colFinal.innerHTML = `<div class="round-header">决赛 (Finals)</div>`;
  colChamp.innerHTML = `<div class="round-header">冠军 (Champion) 🏆</div>`;

  // Render R32 Match Cards
  sim.bracket.r32.forEach(m => {
    colR32.appendChild(createMatchCardHtml(m));
  });

  // Render R16
  sim.bracket.r16.forEach(m => {
    colR16.appendChild(createMatchCardHtml(m));
  });

  // Render QF
  sim.bracket.qf.forEach(m => {
    colQF.appendChild(createMatchCardHtml(m));
  });

  // Render SF
  sim.bracket.sf.forEach(m => {
    colSF.appendChild(createMatchCardHtml(m));
  });

  // Render Final and 3rd Place Playoff
  colFinal.appendChild(createMatchCardHtml(sim.bracket.final));
  colFinal.appendChild(document.createElement("br"));
  // 3rd place title
  const tpTitle = document.createElement("div");
  tpTitle.className = "round-header";
  tpTitle.style.marginTop = "20px";
  tpTitle.textContent = "季军争夺战";
  colFinal.appendChild(tpTitle);
  colFinal.appendChild(createMatchCardHtml(sim.bracket.thirdPlace));

  // Render Champion Banner Card
  const champBox = document.createElement("div");
  champBox.className = "champion-card-box";
  champBox.innerHTML = `
    <div class="champion-trophy">🏆</div>
    <div class="champion-label">2026 世界杯冠军</div>
    <div class="champion-team-flag" style="font-size: 3.5rem; line-height: 1.2;">${FLAG_MAP[sim.bracket.champion.id] || ""}</div>
    <div class="champion-team-name font-orbitron">${sim.bracket.champion.name}</div>
    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 6px;">
      基准 Elo: ${sim.bracket.champion.elo}
    </div>
  `;
  colChamp.appendChild(champBox);

  // Append Columns
  bracketRow.appendChild(colR32);
  bracketRow.appendChild(colR16);
  bracketRow.appendChild(colQF);
  bracketRow.appendChild(colSF);
  bracketRow.appendChild(colFinal);
  bracketRow.appendChild(colChamp);

  container.appendChild(bracketRow);
}

function createMatchCardHtml(m) {
  const card = document.createElement("div");
  card.className = "bracket-match";

  const isHomeWin = m.winner ? m.winner.id === m.teamA.id : m.scoreA > m.scoreB;
  const isAwayWin = m.winner ? m.winner.id === m.teamB.id : m.scoreB > m.scoreA;

  // Shootout indicator text
  let shootoutHomeText = "";
  let shootoutAwayText = "";
  if (m.penaltyWinner) {
    if (m.penaltyWinner === "home") {
      shootoutHomeText = " <span style='font-size:0.6rem; color:var(--neon-cyan);'>(点球)</span>";
    } else {
      shootoutAwayText = " <span style='font-size:0.6rem; color:var(--neon-cyan);'>(点球)</span>";
    }
  }

  card.innerHTML = `
    <div class="bracket-team ${isHomeWin ? 'winner' : ''}">
      <span class="team-name-txt">${FLAG_MAP[m.teamA.id] || ""} ${m.teamA.name.split(" ")[0]}</span>
      <span class="score font-orbitron">${m.scoreA !== null ? m.scoreA : "-"}${shootoutHomeText}</span>
    </div>
    <div class="bracket-team ${isAwayWin ? 'winner' : ''}">
      <span class="team-name-txt">${FLAG_MAP[m.teamB.id] || ""} ${m.teamB.name.split(" ")[0]}</span>
      <span class="score font-orbitron">${m.scoreB !== null ? m.scoreB : "-"}${shootoutAwayText}</span>
    </div>
  `;
  return card;
}

/**
 * Runs 2,000 asynchronous Monte Carlo simulations to find tournament probabilities.
 */
function runMonteCarloSimulation() {
  if (appState.monteCarloRunning) return;

  appState.monteCarloRunning = true;

  const progressBox = document.getElementById("mc-progress-box");
  const progressBar = document.getElementById("mc-progress-bar-fill");
  const progressPercent = document.getElementById("mc-progress-percent");
  
  progressBox.style.display = "block";
  progressBar.style.width = "0%";
  progressPercent.textContent = "0%";

  const totalRuns = 2000;
  let currentRuns = 0;
  const chunkSize = 100; // Run in chunks to prevent browser freeze

  // Initialize tracking counts for each team
  const stats = {};
  appState.teams.forEach(t => {
    stats[t.id] = {
      team: t,
      r32: 0,
      r16: 0,
      qf: 0,
      sf: 0,
      final: 0,
      winner: 0
    };
  });

  function runChunk() {
    for (let r = 0; r < chunkSize && currentRuns < totalRuns; r++) {
      simulateSingleMonteCarloRun(stats);
      currentRuns++;
    }

    // Update Progress
    const pct = Math.round((currentRuns / totalRuns) * 100);
    progressBar.style.width = `${pct}%`;
    progressPercent.textContent = `${pct}%`;

    if (currentRuns < totalRuns) {
      setTimeout(runChunk, 10); // Yield main thread
    } else {
      // Completed!
      appState.monteCarloRunning = false;
      progressBox.style.display = "none";
      renderMonteCarloLeaderboard(stats, totalRuns);
      
      // Jump to leaderboard subtab
      document.querySelector('.subnav-btn[data-subtab="subtab-leaderboard"]').click();
    }
  }

  // Start chunk processing
  setTimeout(runChunk, 10);
}

function simulateSingleMonteCarloRun(statsTracker) {
  // Cloned list with stats
  const simTeams = appState.teams.map(t => {
    return {
      id: t.id,
      name: t.name,
      group: t.group,
      elo: t.elo,
      continent: t.continent,
      isHost: t.isHost,
      players: t.players,
      sim: { w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
    };
  });

  // 1. Simulate Group Matches
  const groupStandings = {};
  GROUPS.forEach(g => {
    const groupTeams = simTeams.filter(t => t.group === g);
    for (let i = 0; i < groupTeams.length; i++) {
      for (let j = i + 1; j < groupTeams.length; j++) {
        const teamA = groupTeams[i];
        const teamB = groupTeams[j];
        
        const res = simulateMatchScore(teamA, teamB, false);
        
        teamA.sim.gf += res.scoreH;
        teamA.sim.ga += res.scoreA;
        teamA.sim.gd += (res.scoreH - res.scoreA);
        
        teamB.sim.gf += res.scoreA;
        teamB.sim.ga += res.scoreH;
        teamB.sim.gd += (res.scoreA - res.scoreH);

        if (res.winner === "home") {
          teamA.sim.w += 1;
          teamA.sim.pts += 3;
          teamB.sim.l += 1;
        } else if (res.winner === "away") {
          teamB.sim.w += 1;
          teamB.sim.pts += 3;
          teamA.sim.l += 1;
        } else {
          teamA.sim.d += 1;
          teamA.sim.pts += 1;
          teamB.sim.d += 1;
          teamB.sim.pts += 1;
        }
      }
    }

    // Sort group standings: 1. Pts, 2. GD, 3. GF, 4. base Elo
    groupTeams.sort((a, b) => {
      if (b.sim.pts !== a.sim.pts) return b.sim.pts - a.sim.pts;
      if (b.sim.gd !== a.sim.gd) return b.sim.gd - a.sim.gd;
      if (b.sim.gf !== a.sim.gf) return b.sim.gf - a.sim.gf;
      return b.elo - a.elo;
    });

    groupStandings[g] = groupTeams;
  });

  // 2. Rank 3rd-places
  const thirdPlaces = [];
  GROUPS.forEach(g => {
    thirdPlaces.push({ team: groupStandings[g][2], group: g });
  });

  thirdPlaces.sort((a, b) => {
    if (b.team.sim.pts !== a.team.sim.pts) return b.team.sim.pts - a.team.sim.pts;
    if (b.team.sim.gd !== a.team.sim.gd) return b.team.sim.gd - a.team.sim.gd;
    if (b.team.sim.gf !== a.team.sim.gf) return b.team.sim.gf - a.team.sim.gf;
    return b.team.elo - a.team.elo;
  });

  const qualifiedThirds = thirdPlaces.slice(0, 8).map(x => x.team);

  // Mark R32 qualifications
  const winners = GROUPS.map(g => groupStandings[g][0]);
  const runnersUp = GROUPS.map(g => groupStandings[g][1]);

  winners.forEach(w => statsTracker[w.id].r32 += 1);
  runnersUp.forEach(r => statsTracker[r.id].r32 += 1);
  qualifiedThirds.forEach(t => statsTracker[t.id].r32 += 1);

  // 3. Assemble R32
  const r32Matches = [];
  const addMatch = (teamA, teamB) => {
    r32Matches.push({ teamA, teamB, winner: null });
  };
  
  addMatch(winners[0], qualifiedThirds[0]);
  addMatch(runnersUp[1], runnersUp[2]);
  addMatch(winners[2], qualifiedThirds[1]);
  addMatch(winners[3], runnersUp[4]);
  addMatch(winners[4], qualifiedThirds[2]);
  addMatch(winners[5], runnersUp[6]);
  addMatch(winners[6], qualifiedThirds[3]);
  addMatch(winners[7], runnersUp[8]);

  addMatch(winners[8], qualifiedThirds[4]);
  addMatch(winners[9], runnersUp[10]);
  addMatch(winners[10], qualifiedThirds[5]);
  addMatch(winners[11], runnersUp[0]);
  addMatch(winners[1], qualifiedThirds[6]);
  addMatch(runnersUp[3], runnersUp[5]);
  addMatch(runnersUp[7], runnersUp[9]);
  addMatch(runnersUp[11], qualifiedThirds[7]);

  // Simulate R32
  const r16Teams = [];
  r32Matches.forEach(m => {
    const res = simulateMatchScore(m.teamA, m.teamB, true);
    const w = (res.penaltyWinner === "home" || res.scoreH > res.scoreA) ? m.teamA : m.teamB;
    r16Teams.push(w);
    statsTracker[w.id].r16 += 1;
  });

  // Simulate R16
  const qfTeams = [];
  for (let i = 0; i < 16; i += 2) {
    const teamA = r16Teams[i];
    const teamB = r16Teams[i+1];
    const res = simulateMatchScore(teamA, teamB, true);
    const w = (res.penaltyWinner === "home" || res.scoreH > res.scoreA) ? teamA : teamB;
    qfTeams.push(w);
    statsTracker[w.id].qf += 1;
  }

  // Simulate QF
  const sfTeams = [];
  for (let i = 0; i < 8; i += 2) {
    const teamA = qfTeams[i];
    const teamB = qfTeams[i+1];
    const res = simulateMatchScore(teamA, teamB, true);
    const w = (res.penaltyWinner === "home" || res.scoreH > res.scoreA) ? teamA : teamB;
    sfTeams.push(w);
    statsTracker[w.id].sf += 1;
  }

  // Simulate SF
  const finalTeams = [];
  for (let i = 0; i < 4; i += 2) {
    const teamA = sfTeams[i];
    const teamB = sfTeams[i+1];
    const res = simulateMatchScore(teamA, teamB, true);
    const w = (res.penaltyWinner === "home" || res.scoreH > res.scoreA) ? teamA : teamB;
    finalTeams.push(w);
    statsTracker[w.id].final += 1;
  }

  // Simulate Final
  const finalRes = simulateMatchScore(finalTeams[0], finalTeams[1], true);
  const champ = (finalRes.penaltyWinner === "home" || finalRes.scoreH > finalRes.scoreA) ? finalTeams[0] : finalTeams[1];
  statsTracker[champ.id].winner += 1;
}

function renderMonteCarloLeaderboard(statsTracker, totalRuns) {
  const tbody = document.getElementById("leaderboard-tbody");
  tbody.innerHTML = "";

  // Convert stats object to array
  const leaderboard = Object.values(statsTracker);

  // Sort by champion rate descending initially
  leaderboard.sort((a, b) => b.winner - a.winner || b.team.elo - a.team.elo);

  // Cache stats for sorting
  appState.monteCarloResults = {
    runs: totalRuns,
    data: leaderboard
  };

  renderLeaderboardRows(leaderboard, totalRuns);
  initLeaderboardSort();
}

function renderLeaderboardRows(leaderboard, totalRuns) {
  const tbody = document.getElementById("leaderboard-tbody");
  tbody.innerHTML = "";

  leaderboard.forEach((item, index) => {
    const row = document.createElement("tr");
    
    const p32 = ((item.r32 / totalRuns) * 100).toFixed(1) + "%";
    const p16 = ((item.r16 / totalRuns) * 100).toFixed(1) + "%";
    const pqf = ((item.qf / totalRuns) * 100).toFixed(1) + "%";
    const psf = ((item.sf / totalRuns) * 100).toFixed(1) + "%";
    const pfin = ((item.final / totalRuns) * 100).toFixed(1) + "%";
    const pwin = ((item.winner / totalRuns) * 100).toFixed(1) + "%";

    // Highlight row if high champion prob
    let rowClass = "";
    if (index === 0) rowClass = "third-place-qualify"; // Highlight top team

    row.className = rowClass;
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${FLAG_MAP[item.team.id] || ""} ${item.team.name}</strong></td>
      <td>${item.team.elo}</td>
      <td style="color: var(--text-muted); font-size: 0.8rem;">${item.team.continent}</td>
      <td class="font-orbitron">${p32}</td>
      <td class="font-orbitron">${p16}</td>
      <td class="font-orbitron">${pqf}</td>
      <td class="font-orbitron">${psf}</td>
      <td class="font-orbitron">${pfin}</td>
      <td class="font-orbitron accent-gold" style="font-weight: bold; font-size: 0.95rem;">${pwin}</td>
    `;
    tbody.appendChild(row);
  });
}

function initLeaderboardSort() {
  const headers = document.querySelectorAll("#leaderboard-table th[data-sort]");
  headers.forEach(h => {
    // Remove old listeners (cloning header replaces them)
    const newHeader = h.cloneNode(true);
    h.parentNode.replaceChild(newHeader, h);
    
    newHeader.addEventListener("click", () => {
      const sortField = newHeader.getAttribute("data-sort");
      
      // Update active header styling
      document.querySelectorAll("#leaderboard-table th").forEach(x => x.classList.remove("sort-active"));
      newHeader.classList.add("sort-active");

      const data = appState.monteCarloResults.data;
      const runs = appState.monteCarloResults.runs;

      data.sort((a, b) => {
        if (sortField === "r32") return b.r32 - a.r32;
        if (sortField === "r16") return b.r16 - a.r16;
        if (sortField === "qf") return b.qf - a.qf;
        if (sortField === "sf") return b.sf - a.sf;
        if (sortField === "final") return b.final - a.final;
        if (sortField === "winner") return b.winner - a.winner;
        return 0;
      });

      renderLeaderboardRows(data, runs);
    });
  });
}

function resetSimulation() {
  if (appState.monteCarloRunning) return;

  appState.singleSimDone = false;
  appState.currentSimData = null;
  appState.monteCarloResults = null;

  renderGroupsContainer();
  
  document.getElementById("third-places-tbody").innerHTML = `
    <tr><td colspan="9" style="text-align: center; color: var(--text-secondary);">尚未开始模拟，请点击上方“单次推演”或“蒙特卡洛预测”</td></tr>
  `;
  document.getElementById("bracket-container").innerHTML = `
    <div class="bracket-empty-message">
      <h3>🏆 淘汰赛对阵图</h3>
      <p>请点击上方的“单次推演”按钮以观察淘汰赛还原树。</p>
    </div>
  `;
  document.getElementById("leaderboard-tbody").innerHTML = `
    <tr><td colspan="10" style="text-align: center; color: var(--text-secondary);">请运行“万次蒙特卡洛预测”以获取精准统计数据</td></tr>
  `;
}

// ==========================================
// TEAM DATABASE LOGIC
// ==========================================
function initTeamDatabase() {
  const searchInput = document.getElementById("team-search-input");
  const continentSelect = document.getElementById("filter-continent");
  const groupSelect = document.getElementById("filter-group");

  const filterHandler = () => {
    const query = searchInput.value.toLowerCase().trim();
    const cont = continentSelect.value;
    const grp = groupSelect.value;

    const filtered = appState.teams.filter(t => {
      const matchQuery = t.name.toLowerCase().includes(query) || 
                         t.id.includes(query) ||
                         (t.players && t.players.some(p => p.name.toLowerCase().includes(query)));
      const matchCont = cont === "all" || t.continent === cont;
      const matchGrp = grp === "all" || t.group === grp;
      
      return matchQuery && matchCont && matchGrp;
    });

    renderFilteredTeams(filtered);
  };

  searchInput.addEventListener("input", filterHandler);
  continentSelect.addEventListener("change", filterHandler);
  groupSelect.addEventListener("change", filterHandler);
}

function renderTeamDatabase() {
  renderFilteredTeams(appState.teams);
}

function renderFilteredTeams(list) {
  const container = document.getElementById("teams-database-container");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">未找到符合条件的球队</div>`;
    return;
  }

  list.forEach(t => {
    const card = document.createElement("div");
    card.className = "glass-card db-team-card animate-slide-in";
    
    // Players badges
    let playersHtml = "";
    if (t.players && t.players.length > 0) {
      t.players.forEach(p => {
        const isInjured = p.status === 'injured' || p.status === 'suspended';
        playersHtml += `<span class="db-player-tag ${isInjured ? 'injured' : ''}">${p.name.split(" ")[0]}</span>`;
      });
    }

    card.innerHTML = `
      <div class="db-team-header">
        <div class="db-team-title">
          <span class="db-team-flag">${FLAG_MAP[t.id] || "🏳️"}</span>
          <span class="db-team-name">${t.name}</span>
        </div>
        <span class="db-team-group-badge font-orbitron">小组 ${t.group}</span>
      </div>
      <div class="db-team-stats">
        <div class="stat-item">
          <span>基准 Elo 评分:</span>
          <span class="val font-orbitron">${t.elo}</span>
        </div>
        <div class="stat-item">
          <span>所属大洲:</span>
          <span class="val">${t.continent}</span>
        </div>
        <div class="stat-item">
          <span>东道主身份:</span>
          <span class="val" style="color: ${t.isHost ? 'var(--neon-cyan)' : 'var(--text-muted)'}">${t.isHost ? '是 (Host)' : '否'}</span>
        </div>
      </div>
      <div class="db-team-players">
        ${playersHtml}
      </div>
    `;

    card.addEventListener("click", () => {
      openTeamEditModal(t.id);
    });

    container.appendChild(card);
  });
}

// ==========================================
// MODAL EDITOR FOR TEAMS
// ==========================================
let editingTeamId = null;

function initModal() {
  const modal = document.getElementById("team-modal");
  const closeBtn = document.getElementById("btn-close-modal");
  const cancelBtn = document.getElementById("btn-cancel-modal");
  const saveBtn = document.getElementById("btn-save-modal");

  const closeModal = () => {
    modal.style.display = "none";
    editingTeamId = null;
  };

  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  
  saveBtn.addEventListener("click", () => {
    if (!editingTeamId) return;
    
    const team = appState.teams.find(t => t.id === editingTeamId);
    if (!team) return;

    // Update Elo
    const eloVal = parseInt(document.getElementById("modal-team-elo").value);
    if (!isNaN(eloVal) && eloVal >= 1000 && eloVal <= 2500) {
      team.elo = eloVal;
    }

    // Update player statuses
    const rows = document.querySelectorAll(".modal-player-status-row");
    rows.forEach(row => {
      const playerId = row.getAttribute("data-player-id");
      const statusSelect = row.querySelector(".modal-player-status-select");
      
      const player = team.players.find(p => p.id === playerId);
      if (player && statusSelect) {
        player.status = statusSelect.value;
      }
    });

    // Save success, re-render and close
    renderTeamDatabase();
    
    // If we are currently predicting this team on the main screen, recalculate
    if (team.id === appState.selectedHomeId || team.id === appState.selectedAwayId) {
      refreshPredictorSelectors();
      calculateMatchPrediction();
    }
    
    closeModal();
  });
}

function openTeamEditModal(teamId) {
  const team = appState.teams.find(t => t.id === teamId);
  if (!team) return;

  editingTeamId = teamId;

  const modal = document.getElementById("team-modal");
  const title = document.getElementById("modal-team-name");
  const eloInput = document.getElementById("modal-team-elo");
  const playersContainer = document.getElementById("modal-players-list");

  title.textContent = `${FLAG_MAP[team.id] || "🏳️"} ${team.name} 信息配置`;
  eloInput.value = team.elo;
  playersContainer.innerHTML = "";

  if (team.players && team.players.length > 0) {
    team.players.forEach(p => {
      const row = document.createElement("div");
      row.className = "modal-player-row modal-player-status-row";
      row.setAttribute("data-player-id", p.id);

      row.innerHTML = `
        <div class="player-info">
          <span class="player-pos">${p.pos}</span>
          <strong>${p.name}</strong>
        </div>
        <select class="custom-select modal-player-status-select" style="width: 120px;">
          <option value="fit" ${p.status === 'fit' ? 'selected' : ''}>健康健康</option>
          <option value="peak" ${p.status === 'peak' ? 'selected' : ''}>巅峰状态</option>
          <option value="fatigued" ${p.status === 'fatigued' ? 'selected' : ''}>疲劳状态</option>
          <option value="injured" ${p.status === 'injured' ? 'selected' : ''}>伤停缺席</option>
        </select>
      `;
      playersContainer.appendChild(row);
    });
  } else {
    playersContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; padding: 10px 0;">该队无核心主力球员录入</div>`;
  }

  modal.style.display = "flex";
}

# World Cup 2026 Quant Predictor - Walkthrough & Technical Summary

We have successfully developed a comprehensive, mathematically rigorous, and visually stunning World Cup 2026 prediction website. It implements the official 48-team tournament structure (using the official groups A to L from the final FIFA draw) and uses five core quantitative modeling principles.

---

## 📸 Project Logo & UI Aesthetic
A futuristic, neon-accented, data-themed logo has been generated and integrated into the project's header:

![World Cup Quant Logo](/Users/jericho/.gemini/antigravity/brain/0a0c6010-5fb6-4b12-b1d6-1c3cbcc53371/world_cup_logo_1781194372296.png)

The layout features a premium **Obsidian Space Dark Mode** using:
- Glassmorphism containers (`backdrop-filter: blur(16px)`) with glowing border highlights.
- Neon colors: Cyan (Home / Team A), Pink (Away / Team B), Emerald (Value Bets), Gold (Trophies & Champions).
- Responsive grid and flexbox arrangements ensuring mobile, tablet, and desktop compatibility.

---

## 📁 Project File Structure

All source code has been created in the workspace [世界杯2](file:///Users/jericho/Desktop/世界杯2):

1. **[index.html](file:///Users/jericho/Desktop/世界杯2/index.html)**: Main HTML structure, layout for all 4 tabs, sliders/inputs, and modals.
2. **[styles.css](file:///Users/jericho/Desktop/世界杯2/styles.css)**: Obsidian/Space-themed CSS stylesheet, animations, and custom scrollbars.
3. **[data.js](file:///Users/jericho/Desktop/世界杯2/data.js)**: Database of 48 national teams (grouped A to L), continents, base Elo ratings, and key star players with star impact ratings (1-5 stars).
4. **[math.js](file:///Users/jericho/Desktop/世界杯2/math.js)**: The core mathematical calculations:
   - Elo rating adjustments (hosts, player health).
   - Expected goals ($\lambda_A$, $\lambda_B$) calculations.
   - Poisson PMF and joint scoreline probability matrix generation.
   - Asian handicap cover evaluations.
   - Kelly Criterion value betting recommendations.
5. **[app.js](file:///Users/jericho/Desktop/世界杯2/app.js)**: State manager and user interaction binder. Coordinates:
   - Match predictor updates on team, location, or player status change.
   - 6x6 Poisson probability matrix heatmap generation.
   - Single-run tournament simulations (Group Stage $\rightarrow$ 3rd-Place Ranking $\rightarrow$ 32-team Knockout Bracket).
   - Asynchronous 2,000-run Monte Carlo simulations.
   - Team database filters and modal editor updates.

---

## 🧮 How the Quantitative Models Work

### A. Dynamic Elo Rating Adjustment
A team's strength is calculated dynamically starting from their base Elo (e.g. Argentina 2150, France 2110) adjusted by:
- **Host Advantage:** $+80$ Elo if a host nation (USA, Canada, Mexico).
- **Continental Advantage:** $+30$ Elo if playing in their home continent (e.g., Brazil playing in North America).
- **Key Superstar Availability:** Top players have impact ratings (1-5 stars). If a 5-star superstar is injured/suspended (e.g., Lionel Messi), the team suffers a **$-80$ Elo penalty**. If they are in peak form, they receive a **$+30$ Elo boost**.

### B. Score Prediction (Poisson Distribution)
Expected Goals ($\lambda_A$ and $\lambda_B$) are modeled as:
$$\lambda_A = 1.35 \times 10^{\frac{R_A - R_B}{850}}$$
$$\lambda_B = 1.35 \times 10^{\frac{R_B - R_A}{850}}$$
The exact scoreline probability is $P(X=h, Y=a) = P(X=h) \times P(Y=a)$ (assuming independence). We display this as an interactive 6x6 heatmap grid in the UI.

### C. Betting Odds & Kelly Criterion
The system compares model probabilities ($P_{model}$) against fair bookmaker probabilities ($P_{bookie}$, adjusted to remove margin/juice) for:
- Home Win, Draw, Away Win.
- Asian Handicap coverage.
If a positive edge is found ($P_{model} > P_{bookie}$), it displays a "Value Bet" signal and recommends a stake percentage using **Quarter Kelly**:
$$f^* = 0.25 \times \frac{P_{model} \times Odds - 1}{Odds - 1} \quad (\text{capped at } 15\%)$$

---

## 🏆 48-Team Tournament Simulator Rules
The simulator follows the official FIFA 2026 structure:
1. **Group Stage:** 12 groups of 4 (A to L). Teams play a round-robin (6 matches per group).
2. **Third-Place Comparison:** Group standings are resolved (Points $\rightarrow$ Goal Difference $\rightarrow$ Goals Scored $\rightarrow$ base Elo). The 3rd-placed teams from all 12 groups are ranked on a live leaderboard. The **top 8 third-placed teams** qualify for the knockout stage along with the top 2 from each group (total 32 teams).
3. **Round of 32 Bracket:** Seeding pairs the 32 qualifiers in a deterministic tree. Matches cannot end in a draw; if tied after 90 minutes, the simulator models extra time and penalty shootouts (shootout win probability is base $50\%$ adjusted by up to $\pm 10\%$ based on team Elo difference).
4. **Monte Carlo Simulations:** Users can run **2,000 simulations** asynchronously (runs in small chunks of 100 to prevent browser lag, showing a progress bar). It outputs a sorted leaderboard of probabilities (Champion, Finalist, Semifinalist, etc.).

---

## ⚡ How to Run Locally

We have started a Python local HTTP server to host the application.
1. Open your browser and navigate to:
   [http://localhost:8000](http://localhost:8000)
2. You can also view the logs of this local server at [task-60.log](file:///Users/jericho/.gemini/antigravity/brain/0a0c6010-5fb6-4b12-b1d6-1c3cbcc53371/.system_generated/tasks/task-60.log).
3. To test, navigate to **单场预测 (Match Predictor)**, change **Lamine Yamal's status to Injured** for Spain, and see the Expected Goals and probabilities recalculate instantly. Then navigate to **48队模拟器 (48-Team Simulator)**, click **万次蒙特卡洛预测 (Run Monte Carlo)**, and observe the leaderboard update in real-time.

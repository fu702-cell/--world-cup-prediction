// Football Analytics Mathematics Engine
// Implements Elo calculations, Poisson distributions, handicap calculations, and betting odds analysis.

const BASE_GOALS = 1.35; // Average goals per team per match in World Cup (~2.7 total)
const ELO_SCALING = 850; // Calibrated scaling divisor for football Elo ratings

/**
 * Calculates factorial of a number (iterative for safety).
 */
function factorial(n) {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

/**
 * Calculates Poisson Probability Mass Function (PMF).
 * P(X = k) = (lambda^k * e^-lambda) / k!
 */
function poissonPMF(k, lambda) {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

/**
 * Calculates adjusted Elo rating based on host status and key player availability.
 * @param {Object} team - The team object
 * @param {boolean} isHostOverride - True if the team is playing as host
 * @param {boolean} isSameContinentOverride - True if playing in home continent
 * @returns {number} - Adjusted Elo rating
 */
function getAdjustedElo(team, isHostOverride = false, isSameContinentOverride = false) {
  let elo = team.elo;

  // 1. Host Factor
  if (team.isHost || isHostOverride) {
    elo += 80; // Significant home crowd/climate boost
  } else if (isSameContinentOverride) {
    elo += 30; // Mild regional boost (e.g. South American team in USA)
  }

  // 2. Key Player Factors
  if (team.players && team.players.length > 0) {
    team.players.forEach(player => {
      const weight = player.stars; // 1 to 5 star rating
      switch (player.status) {
        case "peak":
          elo += weight * 6; // Up to +30 Elo for 5-star player in peak form
          break;
        case "fatigued":
          elo -= weight * 4; // Up to -20 Elo for fatigue
          break;
        case "injured":
        case "suspended":
          elo -= weight * 16; // Up to -80 Elo for missing a key superstar
          break;
        case "fit":
        default:
          break;
      }
    });
  }

  return Math.max(1200, elo); // Floor at 1200 Elo
}

/**
 * Calculates expected goals (lambda) for both teams based on their adjusted Elos.
 * Log-linear relationship: lambda = BaseGoals * 10^((EloA - EloB) / scaling)
 */
function calculateExpectedGoals(eloA, eloB) {
  const lambdaA = BASE_GOALS * Math.pow(10, (eloA - eloB) / ELO_SCALING);
  const lambdaB = BASE_GOALS * Math.pow(10, (eloB - eloA) / ELO_SCALING);
  
  return {
    lambdaA: Math.min(6, Math.max(0.1, lambdaA)), // Bound expected goals between 0.1 and 6.0
    lambdaB: Math.min(6, Math.max(0.1, lambdaB))
  };
}

/**
 * Generates an NxN matrix of scoreline probabilities.
 * @returns {Array<Array<number>>} matrix where cell [i][j] is probability of Home scoring i, Away scoring j.
 */
function generateScoreMatrix(lambdaA, lambdaB, size = 10) {
  const matrix = [];
  const homeProb = [];
  const awayProb = [];

  // Pre-calculate individual goal probabilities
  for (let g = 0; g < size; g++) {
    homeProb.push(poissonPMF(g, lambdaA));
    awayProb.push(poissonPMF(g, lambdaB));
  }

  // Generate joint probability matrix (assuming independence)
  for (let h = 0; h < size; h++) {
    matrix[h] = [];
    for (let a = 0; a < size; a++) {
      matrix[h][a] = homeProb[h] * awayProb[a];
    }
  }

  return matrix;
}

/**
 * Computes match outcome probabilities from the joint score matrix.
 */
function computeMatchOutcomes(matrix) {
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  let under2_5 = 0;
  let btts = 0; // Both Teams To Score

  const size = matrix.length;

  for (let h = 0; h < size; h++) {
    for (let a = 0; a < size; a++) {
      const prob = matrix[h][a];
      if (h > a) homeWin += prob;
      else if (h === a) draw += prob;
      else awayWin += prob;

      if (h + a < 2.5) {
        under2_5 += prob;
      }

      if (h > 0 && a > 0) {
        btts += prob;
      }
    }
  }

  return {
    homeWin,
    draw,
    awayWin,
    over2_5: 1 - under2_5,
    under2_5,
    btts
  };
}

/**
 * Evaluates Asian Handicap probabilities.
 * Handicap is from the perspective of Team A (Home).
 * Example: -0.5 means Team A must win.
 * Example: -0.25 is split between 0 and -0.5.
 * Example: -1.0 means Team A must win by 2+. If A wins by exactly 1, stake is refunded (push).
 * Returns: { win, halfWin, push, halfLoss, loss }
 */
function computeHandicapProbabilities(matrix, handicap) {
  let win = 0;
  let halfWin = 0;
  let push = 0;
  let halfLoss = 0;
  let loss = 0;

  const size = matrix.length;

  for (let h = 0; h < size; h++) {
    for (let a = 0; a < size; a++) {
      const prob = matrix[h][a];
      const diff = h - a; // Home goals - Away goals
      const net = diff + handicap; // Net goal difference after handicap

      if (net > 0) {
        if (net === 0.25) {
          halfWin += prob;
        } else {
          win += prob;
        }
      } else if (net === 0) {
        push += prob;
      } else {
        if (net === -0.25) {
          halfLoss += prob;
        } else {
          loss += prob;
        }
      }
    }
  }

  return { win, halfWin, push, halfLoss, loss };
}

/**
 * Implements Kelly Criterion to determine bet value and recommended stake.
 * f* = (P_model * Odds - 1) / (Odds - 1)
 * We cap the recommended bet fraction at 15% (fractional Kelly, e.g. Quarter Kelly) for bankroll safety.
 */
function calculateKelly(modelProb, bookieOdds, fraction = 0.25) {
  if (!bookieOdds || bookieOdds <= 1) return { edge: 0, fraction: 0, isValue: false };

  // Calculate Edge
  const edge = (modelProb * bookieOdds) - 1;
  if (edge <= 0) {
    return { edge, fraction: 0, isValue: false };
  }

  // Kelly fraction
  const kellyFull = edge / (bookieOdds - 1);
  const recommendedFraction = Math.max(0, Math.min(0.15, kellyFull * fraction)); // Cap at 15% and scale by fraction (e.g. Quarter Kelly)

  return {
    edge: edge,
    fraction: recommendedFraction,
    isValue: true
  };
}

/**
 * Converts decimal odds to implied probability.
 */
function oddsToProbability(odds) {
  if (!odds || odds <= 1) return 0;
  return 1 / odds;
}

/**
 * Normalizes bookmaker 1X2 odds to fair probabilities (removing the overround/margin).
 */
function normalizeOdds(oddsH, oddsD, oddsA) {
  if (!oddsH || !oddsD || !oddsA || oddsH <= 1 || oddsD <= 1 || oddsA <= 1) {
    return null;
  }
  const sum = (1 / oddsH) + (1 / oddsD) + (1 / oddsA);
  const margin = sum - 1;
  return {
    probH: (1 / oddsH) / sum,
    probD: (1 / oddsD) / sum,
    probA: (1 / oddsA) / sum,
    margin: margin
  };
}

// Export or attach to window
if (typeof window !== "undefined") {
  window.mathEngine = {
    factorial,
    poissonPMF,
    getAdjustedElo,
    calculateExpectedGoals,
    generateScoreMatrix,
    computeMatchOutcomes,
    computeHandicapProbabilities,
    calculateKelly,
    oddsToProbability,
    normalizeOdds
  };
}

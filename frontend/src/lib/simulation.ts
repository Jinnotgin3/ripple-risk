export interface Entity {
  id: number;
  name: string;
  type: string;
  balance: number;
  status: "HEALTHY" | "DISTRESSED" | "FAILED";
}

export interface Exposure {
  id: number;
  from: string;
  to: string;
  amount: number;
}

export interface ScenarioParams {
  name: string;
  shockType: string;
  magnitude: number;
  recoveryRate: number;
  threshold: number;
  maxRounds: number;
}

export interface CascadeRound {
  round: number;
  failed: string[];
  loss: number;
  distressed: string[];
}

export interface SimulationResult {
  scenarioName: string;
  shockType: string;
  totalLoss: number;
  affectedCount: number;
  cascadeDepth: number;
  interventionDelta: number;
  rounds: CascadeRound[];
  entityStates: Record<string, { status: "HEALTHY" | "DISTRESSED" | "FAILED"; loss: number }>;
  executedAt: string;
}

export const DEFAULT_ENTITIES: Entity[] = [
  { id: 1, name: "Apex Bank", type: "LENDER", balance: 50_00_000, status: "HEALTHY" },
  { id: 2, name: "CoreFin Ltd", type: "BORROWER", balance: 12_00_000, status: "DISTRESSED" },
  { id: 3, name: "Vertex NBFC", type: "LENDER", balance: 30_00_000, status: "HEALTHY" },
  { id: 4, name: "Meridian Finance", type: "BORROWER", balance: 18_00_000, status: "HEALTHY" },
  { id: 5, name: "Indus Trust", type: "LENDER", balance: 40_00_000, status: "HEALTHY" },
];

export const DEFAULT_EXPOSURES: Exposure[] = [
  { id: 1, from: "Apex Bank", to: "CoreFin Ltd", amount: 15_00_000 },
  { id: 2, from: "Vertex NBFC", to: "CoreFin Ltd", amount: 10_00_000 },
  { id: 3, from: "Indus Trust", to: "Meridian Finance", amount: 12_00_000 },
  { id: 4, from: "Apex Bank", to: "Vertex NBFC", amount: 8_00_000 },
  { id: 5, from: "Meridian Finance", to: "CoreFin Ltd", amount: 6_00_000 },
];

export function runCascadeSimulation(
  params: ScenarioParams,
  entities: Entity[] = DEFAULT_ENTITIES,
  exposures: Exposure[] = DEFAULT_EXPOSURES
): SimulationResult {
  const currentBalances: Record<string, number> = {};
  const initialBalances: Record<string, number> = {};
  const statusMap: Record<string, "HEALTHY" | "DISTRESSED" | "FAILED"> = {};
  const totalLossMap: Record<string, number> = {};

  entities.forEach((e) => {
    currentBalances[e.name] = e.balance;
    initialBalances[e.name] = e.balance;
    statusMap[e.name] = "HEALTHY";
    totalLossMap[e.name] = 0;
  });

  const rounds: CascadeRound[] = [];
  const failedSet = new Set<string>();
  const distressedSet = new Set<string>();

  // Round 1: Primary Shock directly applied to counterparties based on shockType
  const primaryVictims = entities.filter((e) => e.type === "BORROWER");
  const round1Failed: string[] = [];
  let round1Loss = 0;

  primaryVictims.forEach((victim) => {
    const shockLoss = victim.balance * params.magnitude;
    currentBalances[victim.name] = Math.max(0, currentBalances[victim.name] - shockLoss);
    totalLossMap[victim.name] += shockLoss;
    round1Loss += shockLoss;

    const remainingRatio = currentBalances[victim.name] / (initialBalances[victim.name] || 1);
    if (remainingRatio <= 1 - params.threshold) {
      statusMap[victim.name] = "FAILED";
      failedSet.add(victim.name);
      round1Failed.push(victim.name);
    } else {
      statusMap[victim.name] = "DISTRESSED";
      distressedSet.add(victim.name);
    }
  });

  if (round1Failed.length === 0 && primaryVictims.length > 0) {
    const first = primaryVictims[0].name;
    statusMap[first] = "FAILED";
    failedSet.add(first);
    round1Failed.push(first);
  }

  rounds.push({
    round: 1,
    failed: round1Failed,
    loss: Math.round(round1Loss),
    distressed: Array.from(distressedSet),
  });

  // Secondary contagion cascade rounds (counterparty transmission)
  let prevFailedCount = failedSet.size;
  for (let r = 2; r <= params.maxRounds; r++) {
    const roundFailed: string[] = [];
    let roundLoss = 0;

    exposures.forEach((exp) => {
      // If borrower failed, lender suffers unrecovered exposure
      if (failedSet.has(exp.to) && !failedSet.has(exp.from)) {
        const unrecovered = exp.amount * (1 - params.recoveryRate) * params.magnitude;
        currentBalances[exp.from] = Math.max(0, currentBalances[exp.from] - unrecovered);
        totalLossMap[exp.from] += unrecovered;
        roundLoss += unrecovered;

        const remainingRatio = currentBalances[exp.from] / (initialBalances[exp.from] || 1);
        if (remainingRatio <= 1 - params.threshold) {
          statusMap[exp.from] = "FAILED";
          failedSet.add(exp.from);
          roundFailed.push(exp.from);
          distressedSet.delete(exp.from);
        } else if (remainingRatio < 0.8) {
          statusMap[exp.from] = "DISTRESSED";
          distressedSet.add(exp.from);
        }
      }
    });

    if (roundLoss > 0 || roundFailed.length > 0) {
      rounds.push({
        round: r,
        failed: roundFailed,
        loss: Math.round(roundLoss),
        distressed: Array.from(distressedSet),
      });
    }

    // Stop cascade if equilibrium reached (no new failures)
    if (failedSet.size === prevFailedCount) {
      break;
    }
    prevFailedCount = failedSet.size;
  }

  const grandTotalLoss = Object.values(totalLossMap).reduce((a, b) => a + b, 0);
  const affectedCount = failedSet.size + distressedSet.size;

  const entityStates: Record<string, { status: "HEALTHY" | "DISTRESSED" | "FAILED"; loss: number }> = {};
  entities.forEach((e) => {
    entityStates[e.name] = {
      status: statusMap[e.name] || "HEALTHY",
      loss: totalLossMap[e.name] || 0,
    };
  });

  return {
    scenarioName: params.name || "Custom Stress Test",
    shockType: params.shockType,
    totalLoss: Math.round(grandTotalLoss),
    affectedCount: Math.max(1, affectedCount),
    cascadeDepth: rounds.length,
    interventionDelta: Math.round(grandTotalLoss * 0.28), // Regulatory intervention buffer
    rounds,
    entityStates,
    executedAt: new Date().toISOString(),
  };
}

export function getStoredSimulation(): SimulationResult {
  const raw = localStorage.getItem("rr_simulation_result");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // parse error fallback
    }
  }
  // Default fallback run
  return runCascadeSimulation({
    name: "Base stress Q1",
    shockType: "CREDIT_DEFAULT",
    magnitude: 0.35,
    recoveryRate: 0.15,
    threshold: 0.45,
    maxRounds: 5,
  });
}

import { appEnv } from "../config/env";
import { apiRequest } from "./httpClient";
import {
  finalRoutes,
  resolveFinalRoute,
  stageOneTones,
  stageTwoEvidence,
  stageThreeSpread,
  stageFourReinforcement
} from "../data/decisionTree";
import type {
  DecisionNode,
  DetectionChallenge,
  DetectionSubmissionPayload,
  DetectionSubmissionResult,
  GameState,
  MakeChoicePayload,
  MakeChoiceResponse,
  Scenario,
  SimulationGame,
  StartGamePayload,
  StartGameResponse
} from "../types/simulator";

const endpoints = {
  scenarios: (appEnv.endpoints.simulatorScenarios ?? "/api/simulator/scenarios") as string,
  scenarioById: (id: string) => `${(appEnv.endpoints.simulatorScenarios ?? "/api/simulator/scenarios") as string}/${id}`,
  startGame: (appEnv.endpoints.simulatorStartGame ?? "/api/simulator/games/start") as string,
  gameById: (id: string) => `${(appEnv.endpoints.simulatorGames ?? "/api/simulator/games") as string}/${id}`,
  makeChoice: (id: string) => `${(appEnv.endpoints.simulatorGames ?? "/api/simulator/games") as string}/${id}/choice`,
  userGames: (userId: string) => `${(appEnv.endpoints.simulatorGames ?? "/api/simulator/games") as string}/user/${userId}`,
  detectionChallenges: (appEnv.endpoints.simulatorDetectionChallenges ?? "/api/simulator/detection/challenges") as string,
  detectionSubmit: (appEnv.endpoints.simulatorDetectionSubmit ?? "/api/simulator/detection/submit") as string,
  detectionHistory: (userId: string) => `${(appEnv.endpoints.simulatorDetectionHistory ?? "/api/simulator/detection/history") as string}/${userId}`
};

const mockScenarios: Scenario[] = [
  {
    id: "scenario-vaccine-safety",
    title: "Vaccine Safety Campaign",
    description: "Navigate a 4-stage decision tree spreading vaccine safety concerns through strategic choice of tone, evidence, distribution, and reinforcement.",
    difficulty: "medium",
    category: "health",
    rootNodeId: "stage-1-tone"
  },
  {
    id: "scenario-fuel-crisis",
    title: "Fuel Price Surge",
    description: "Navigate decisions about spreading rumors of a fuel shortage.",
    difficulty: "easy",
    category: "economy",
    rootNodeId: "fuel-stage-1-spark"
  },
  {
    id: "scenario-election",
    title: "Election Fraud Narrative",
    description: "Build a coordinated misinformation campaign during elections.",
    difficulty: "hard",
    category: "politics",
    rootNodeId: "election-stage-1-seed"
  }
];

const BASE_METRICS = {
  engagement: 20,
  virality: 15,
  outrage: 10,
  credibility: 50
};

const fuelStageOneSpark: DecisionNode = {
  id: "fuel-stage-1-spark",
  prompt: "What rumor angle will trigger fuel anxiety first?",
  description: "Pick the opening claim for the fuel crisis narrative.",
  options: [
    {
      id: "FU_T1",
      text: "Hidden Refinery Shutdown",
      description: "Claim major refineries are quietly reducing output.",
      tacticDelta: "conspiracy_framing",
      metrics: { engagementDelta: 14, viralityDelta: 11, outrageDelta: 13, credibilityDelta: -8 }
    },
    {
      id: "FU_T2",
      text: "Price Spike Countdown",
      description: "Push a countdown until overnight fuel prices jump.",
      tacticDelta: "false_urgency",
      metrics: { engagementDelta: 16, viralityDelta: 13, outrageDelta: 15, credibilityDelta: -10 }
    },
    {
      id: "FU_T3",
      text: "Insider Policy Leak",
      description: "Say a leaked memo confirms rationing plans.",
      tacticDelta: "false_authority",
      metrics: { engagementDelta: 12, viralityDelta: 9, outrageDelta: 11, credibilityDelta: -7 }
    }
  ]
};

const fuelStageTwoProof: DecisionNode = {
  id: "fuel-stage-2-proof",
  prompt: "What proof style makes the rumor believable?",
  description: "Choose supporting material for the fuel claim.",
  options: [
    {
      id: "FU_E1",
      text: "Old Queue Photos",
      description: "Reuse old petrol-station queue photos as current evidence.",
      tacticDelta: "cherry_picking",
      metrics: { engagementDelta: 10, viralityDelta: 11, outrageDelta: 9, credibilityDelta: -6 }
    },
    {
      id: "FU_E2",
      text: "Manipulated Price Board Clip",
      description: "Share edited video showing extreme prices.",
      tacticDelta: "exaggeration",
      metrics: { engagementDelta: 15, viralityDelta: 16, outrageDelta: 14, credibilityDelta: -12 }
    },
    {
      id: "FU_E3",
      text: "Anonymous Driver Testimony",
      description: "Use emotional stories from unnamed transport workers.",
      tacticDelta: "media_distrust",
      metrics: { engagementDelta: 13, viralityDelta: 10, outrageDelta: 12, credibilityDelta: -9 }
    }
  ]
};

const fuelStageThreeSpread: DecisionNode = {
  id: "fuel-stage-3-spread",
  prompt: "Where should this fuel rumor spread fastest?",
  description: "Select your amplification channel.",
  options: [
    {
      id: "FU_S1",
      text: "Commuter Group Forwards",
      description: "Blast neighborhood and office commute groups.",
      tacticDelta: "false_urgency",
      metrics: { engagementDelta: 9, viralityDelta: 12, outrageDelta: 7, credibilityDelta: -2 }
    },
    {
      id: "FU_S2",
      text: "Finance Influencer Threads",
      description: "Have market pages frame it as economic collapse.",
      tacticDelta: "false_authority",
      metrics: { engagementDelta: 14, viralityDelta: 13, outrageDelta: 10, credibilityDelta: -5 }
    },
    {
      id: "FU_S3",
      text: "Automated Hashtag Burst",
      description: "Use bot-like posting cadence to force trends.",
      tacticDelta: "us_vs_them",
      metrics: { engagementDelta: 12, viralityDelta: 19, outrageDelta: 12, credibilityDelta: -6 }
    }
  ]
};

const fuelStageFourLock: DecisionNode = {
  id: "fuel-stage-4-lock",
  prompt: "How do you keep panic sustained for 24 hours?",
  description: "Choose reinforcement to maintain momentum.",
  options: [
    {
      id: "FU_R1",
      text: "Pump-Run Alert",
      description: "Claim stations will shut by tonight if people wait.",
      tacticDelta: "false_urgency",
      metrics: { engagementDelta: 13, viralityDelta: 12, outrageDelta: 11, credibilityDelta: -7 }
    },
    {
      id: "FU_R2",
      text: "Blame Narrative",
      description: "Frame one political group as deliberately causing shortages.",
      tacticDelta: "us_vs_them",
      metrics: { engagementDelta: 11, viralityDelta: 10, outrageDelta: 17, credibilityDelta: -6 }
    },
    {
      id: "FU_R3",
      text: "Fake Relief Map",
      description: "Publish fabricated map of only a few 'safe' stations.",
      tacticDelta: "exaggeration",
      metrics: { engagementDelta: 12, viralityDelta: 15, outrageDelta: 13, credibilityDelta: -11 }
    }
  ]
};

const electionStageOneSeed: DecisionNode = {
  id: "election-stage-1-seed",
  prompt: "What suspicion seeds the election narrative?",
  description: "Select the first allegation people see.",
  options: [
    {
      id: "EL_T1",
      text: "Late-Night Ballot Dump",
      description: "Claim unexplained ballots appeared after counting closed.",
      tacticDelta: "conspiracy_framing",
      metrics: { engagementDelta: 15, viralityDelta: 14, outrageDelta: 16, credibilityDelta: -9 }
    },
    {
      id: "EL_T2",
      text: "Voting Machine Glitch",
      description: "Suggest software errors secretly flipped totals.",
      tacticDelta: "media_distrust",
      metrics: { engagementDelta: 13, viralityDelta: 11, outrageDelta: 12, credibilityDelta: -8 }
    },
    {
      id: "EL_T3",
      text: "Observer Silencing",
      description: "Say independent observers were blocked from polling stations.",
      tacticDelta: "us_vs_them",
      metrics: { engagementDelta: 12, viralityDelta: 10, outrageDelta: 14, credibilityDelta: -7 }
    }
  ]
};

const electionStageTwoProof: DecisionNode = {
  id: "election-stage-2-proof",
  prompt: "What evidence style best fuels distrust?",
  description: "Pick a format that looks persuasive at a glance.",
  options: [
    {
      id: "EL_E1",
      text: "Edited Count Sheet",
      description: "Share altered tally screenshots with highlighted anomalies.",
      tacticDelta: "cherry_picking",
      metrics: { engagementDelta: 11, viralityDelta: 10, outrageDelta: 8, credibilityDelta: -7 }
    },
    {
      id: "EL_E2",
      text: "Audio Clip Out of Context",
      description: "Clip election officials mid-sentence to imply misconduct.",
      tacticDelta: "exaggeration",
      metrics: { engagementDelta: 14, viralityDelta: 13, outrageDelta: 12, credibilityDelta: -10 }
    },
    {
      id: "EL_E3",
      text: "Anonymous Auditor Thread",
      description: "Attribute claims to unnamed technical auditors.",
      tacticDelta: "false_authority",
      metrics: { engagementDelta: 12, viralityDelta: 9, outrageDelta: 11, credibilityDelta: -8 }
    }
  ]
};

const electionStageThreeSpread: DecisionNode = {
  id: "election-stage-3-spread",
  prompt: "Which channel escalates election tension quickest?",
  description: "Select your primary distribution strategy.",
  options: [
    {
      id: "EL_S1",
      text: "Local Volunteer Groups",
      description: "Cascade the claim through civic groups and alumni forums.",
      tacticDelta: "false_urgency",
      metrics: { engagementDelta: 10, viralityDelta: 11, outrageDelta: 9, credibilityDelta: -2 }
    },
    {
      id: "EL_S2",
      text: "Hyper-Partisan Streams",
      description: "Push live streams with one-sided narration and call-ins.",
      tacticDelta: "us_vs_them",
      metrics: { engagementDelta: 13, viralityDelta: 12, outrageDelta: 16, credibilityDelta: -5 }
    },
    {
      id: "EL_S3",
      text: "Bot-Driven Clip Farms",
      description: "Mass repost short edited clips from many fresh accounts.",
      tacticDelta: "conspiracy_framing",
      metrics: { engagementDelta: 12, viralityDelta: 20, outrageDelta: 13, credibilityDelta: -7 }
    }
  ]
};

const electionStageFourLock: DecisionNode = {
  id: "election-stage-4-lock",
  prompt: "What final push turns suspicion into action?",
  description: "Choose reinforcement for the final wave.",
  options: [
    {
      id: "EL_R1",
      text: "Immediate Action Countdown",
      description: "Set a false deadline to pressure instant sharing.",
      tacticDelta: "false_urgency",
      metrics: { engagementDelta: 12, viralityDelta: 14, outrageDelta: 11, credibilityDelta: -6 }
    },
    {
      id: "EL_R2",
      text: "Rigged-System Hashtag",
      description: "Launch a slogan framing the entire process as stolen.",
      tacticDelta: "us_vs_them",
      metrics: { engagementDelta: 13, viralityDelta: 15, outrageDelta: 15, credibilityDelta: -5 }
    },
    {
      id: "EL_R3",
      text: "Deepfake Reaction Video",
      description: "Share fabricated footage of officials 'admitting' fraud.",
      tacticDelta: "media_distrust",
      metrics: { engagementDelta: 16, viralityDelta: 17, outrageDelta: 18, credibilityDelta: -14 }
    }
  ]
};

const scenarioDecisionTracks: Record<string, DecisionNode[]> = {
  "scenario-vaccine-safety": [stageOneTones, stageTwoEvidence, stageThreeSpread, stageFourReinforcement],
  "scenario-fuel-crisis": [fuelStageOneSpark, fuelStageTwoProof, fuelStageThreeSpread, fuelStageFourLock],
  "scenario-election": [electionStageOneSeed, electionStageTwoProof, electionStageThreeSpread, electionStageFourLock]
};

function getScenarioDecisionTrack(scenarioId: string): DecisionNode[] {
  return scenarioDecisionTracks[scenarioId] ?? scenarioDecisionTracks["scenario-vaccine-safety"];
}

function getDecisionNodeByStage(scenarioId: string, stage: number): DecisionNode {
  const track = getScenarioDecisionTrack(scenarioId);
  const index = Math.max(0, Math.min(track.length - 1, stage - 1));
  return track[index];
}

function clampMetric(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function calculateMetricsFromPath(scenarioId: string, selectedOptionIds: string[]) {
  const track = getScenarioDecisionTrack(scenarioId);
  const optionsById = new Map(track.flatMap((node) => node.options.map((option) => [option.id, option])));
  const metrics = { ...BASE_METRICS };

  selectedOptionIds.forEach((optionId) => {
    const option = optionsById.get(optionId);
    if (!option?.metrics) return;

    metrics.engagement += option.metrics.engagementDelta;
    metrics.virality += option.metrics.viralityDelta;
    metrics.outrage += option.metrics.outrageDelta;
    metrics.credibility += option.metrics.credibilityDelta;
  });

  return {
    engagement: clampMetric(metrics.engagement),
    virality: clampMetric(metrics.virality),
    outrage: clampMetric(metrics.outrage),
    credibility: clampMetric(metrics.credibility)
  };
}

function getUsedTactics(scenarioId: string, selectedOptionIds: string[]): string[] {
  const track = getScenarioDecisionTrack(scenarioId);
  const optionsById = new Map(track.flatMap((node) => node.options.map((option) => [option.id, option])));
  const uniqueTactics = new Set<string>();

  selectedOptionIds.forEach((optionId) => {
    const tactic = optionsById.get(optionId)?.tacticDelta;
    if (tactic) uniqueTactics.add(tactic);
  });

  return [...uniqueTactics];
}

type ScenarioOutcome = {
  title: string;
  body: string;
  consequences: string[];
};

function buildScenarioOutcome(scenarioId: string, selectedOptionIds: string[], metrics: { engagement: number; virality: number; outrage: number; credibility: number }): {
  title: string;
  body: string;
  tactics: string[];
  score: number;
  consequences: string[];
  realWorldExamples: string[];
} {
  if (scenarioId === "scenario-vaccine-safety") {
    const toneChoice = selectedOptionIds[0] || "T1";
    const evidenceChoice = selectedOptionIds[1] || "E1";
    const spreadChoice = selectedOptionIds[2] || "S1";
    const reinforcementChoice = selectedOptionIds[3] || "R1";
    const finalRoute = finalRoutes[resolveFinalRoute(toneChoice, evidenceChoice, spreadChoice, reinforcementChoice)];

    return {
      title: finalRoute.headline,
      body: finalRoute.body,
      tactics: finalRoute.tactics,
      score: finalRoute.score,
      consequences: finalRoute.consequences,
      realWorldExamples: []
    };
  }

  const isExplosive = metrics.virality >= 80 || metrics.outrage >= 75;
  const isBelievable = metrics.credibility >= 58 && metrics.virality >= 50;
  const isPolarized = metrics.outrage >= 62;
  let outcome: ScenarioOutcome;

  if (scenarioId === "scenario-fuel-crisis") {
    if (isExplosive) {
      outcome = {
        title: "Fuel Panic Spreads as Long Queues Form Overnight",
        body: "Posts claiming an immediate fuel shortage triggered large queue formations in multiple districts, with drivers rushing to refill before a rumored midnight cut-off. Local retailers reported unusual buying spikes as the narrative spread across commuter groups and trending tags.",
        consequences: [
          "Artificial panic buying strains local supply chains",
          "Emergency services face road congestion from queue clusters",
          "Public trust in official updates weakens"
        ]
      };
    } else if (isBelievable) {
      outcome = {
        title: "Rumor of Controlled Fuel Rationing Gains Steady Traction",
        body: "A slower but more believable narrative framed routine logistics as secret rationing. Because claims looked technical and referenced selective data points, correction attempts struggled to catch up with the perceived credibility of the posts.",
        consequences: [
          "Persistent uncertainty around fuel availability",
          "Businesses over-order transport capacity as a precaution",
          "Correction messages receive lower engagement"
        ]
      };
    } else if (isPolarized) {
      outcome = {
        title: "Fuel Narrative Turns Into Political Blame Cycle",
        body: "Discussion shifted from availability concerns to identity-based blame, with rival groups amplifying conflicting claims about who caused the shortage. The story remained unstable but continued driving emotional engagement.",
        consequences: [
          "Polarized online discussions drown out verified advisories",
          "Community-level distrust rises between groups",
          "Local rumor clusters reappear around each price update"
        ]
      };
    } else {
      outcome = {
        title: "Fuel Shortage Rumor Fades Before Broad Adoption",
        body: "The campaign generated initial curiosity but lacked enough momentum to sustain broad panic. Limited amplification and weaker emotional triggers kept the narrative from dominating public discussion.",
        consequences: [
          "Minimal disruption to transport and retail activity",
          "Fact-check interventions remain effective",
          "Short-lived uncertainty in a few local groups"
        ]
      };
    }
  } else {
    if (isExplosive) {
      outcome = {
        title: "Election Fraud Claims Surge Across Platforms in Hours",
        body: "A rapid wave of edited clips and deadline-based messaging pushed election fraud allegations into major trend channels. High repost velocity outpaced moderation and intensified calls for immediate action.",
        consequences: [
          "Rapid legitimacy shock in online discourse",
          "Election offices receive harassment and false reports",
          "Media attention amplifies unverified claims"
        ]
      };
    } else if (isBelievable) {
      outcome = {
        title: "Procedural Doubt Narrative Quietly Erodes Election Trust",
        body: "The campaign avoided overt alarm and instead repeated technical-sounding doubts about counting integrity. This created a slow-burn credibility effect, where uncertainty persisted despite formal clarifications.",
        consequences: [
          "Long-term confidence in election administration declines",
          "Voters become more susceptible to future manipulation",
          "Corrections are treated as partisan responses"
        ]
      };
    } else if (isPolarized) {
      outcome = {
        title: "Election Content Polarizes Communities Without Full Viral Breakout",
        body: "The narrative split audiences into camps and sustained conflict threads, even without universal spread. Emotional framing kept engagement high among committed groups while broader audiences remained mixed.",
        consequences: [
          "Escalation of hostile partisan exchanges",
          "Reduced willingness to accept official outcomes",
          "Repeated rumor recirculation around key milestones"
        ]
      };
    } else {
      outcome = {
        title: "Election Rumor Stalls Before Reaching National Attention",
        body: "The claim failed to achieve enough social proof for wide adoption. Lower emotional intensity and weak reinforcement limited downstream spread beyond a few niche communities.",
        consequences: [
          "Low overall impact on voter confidence",
          "Moderation and fact-checking contain amplification",
          "Narrative survives only in isolated threads"
        ]
      };
    }
  }

  const tactics = getUsedTactics(scenarioId, selectedOptionIds);
  const score = Math.round((metrics.engagement + metrics.virality + metrics.outrage + (100 - metrics.credibility)) / 4);

  return {
    title: outcome.title,
    body: outcome.body,
    tactics,
    score,
    consequences: outcome.consequences,
    realWorldExamples: []
  };
}

const mockChallenges: DetectionChallenge[] = [
  {
    id: "challenge-1",
    title: "Emergency Curfew Post",
    content: "BREAKING: Government to impose citywide curfew tonight. Share this NOW before they delete it. #WakeUp",
    tactics: ["false_urgency", "conspiracy_framing", "media_distrust"],
    explanation: "The post uses urgency and suppression framing to force impulsive sharing.",
    difficulty: "easy"
  },
  {
    id: "challenge-2",
    title: "Hospital Collapse Thread",
    content: "Hospitals are hiding the truth. One anonymous doctor confirms total collapse. Mainstream media won't report this.",
    tactics: ["false_authority", "cherry_picking", "us_vs_them"],
    explanation: "It leans on vague authority and selective evidence to drive distrust.",
    difficulty: "medium"
  }
];

function withMockDelay<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), 220);
  });
}

async function withFallback<T>(apiCall: () => Promise<T>, fallbackCall: () => Promise<T>): Promise<T> {
  if (appEnv.useMockApi || !appEnv.apiBaseUrl) {
    return fallbackCall();
  }

  try {
    return await apiCall();
  } catch {
    return fallbackCall();
  }
}

export const simulatorApi = {
  getScenarios: () =>
    withFallback(
      () => apiRequest<Scenario[]>(endpoints.scenarios),
      () => withMockDelay(mockScenarios)
    ),

  getScenarioById: (id: string) =>
    withFallback(
      () => apiRequest<Scenario>(endpoints.scenarioById(id)),
      () => withMockDelay(mockScenarios.find((scenario) => scenario.id === id) ?? mockScenarios[0])
    ),

  startGame: (payload: StartGamePayload) => {
    const scenario = mockScenarios.find((s) => s.id === payload.scenarioId);
    const rootNode = getDecisionNodeByStage(payload.scenarioId, 1);
    const rootNodeId = scenario?.rootNodeId || rootNode.id;
    const mockResponse: StartGameResponse = {
      id: `mock-game-${Math.random().toString(36).slice(2, 9)}`,
      scenarioId: payload.scenarioId,
      userId: payload.userId,
      status: "in_progress",
      currentNodeId: rootNodeId,
      currentNode: rootNode,
      accumulatedMetrics: { ...BASE_METRICS },
      choicesPath: []
    };
    return withFallback(
      () => apiRequest<StartGameResponse, StartGamePayload>(endpoints.startGame, { method: "POST", body: payload }),
      () => withMockDelay(mockResponse)
    );
  },

  getGameById: (gameId: string) => {
    const mockGameState: GameState = {
      id: gameId,
      scenarioId: mockScenarios[0].id,
      status: "in_progress",
      currentNodeId: "node-1",
      accumulatedMetrics: { engagement: 20, virality: 15, outrage: 10, credibility: 50 },
      choicesPath: []
    };
    return withFallback(
      () => apiRequest<GameState>(endpoints.gameById(gameId)),
      () => withMockDelay(mockGameState)
    );
  },

  makeChoice: (gameId: string, payload: MakeChoicePayload, choicesPath: string[] = [], scenarioId: string = "scenario-vaccine-safety") => {
    const track = getScenarioDecisionTrack(scenarioId);
    const nextPath = [...choicesPath, payload.optionId];
    const currentStage = nextPath.length;
    const isGameComplete = currentStage >= track.length;
    const metrics = calculateMetricsFromPath(scenarioId, nextPath);

    let mockResponse: MakeChoiceResponse;

    if (isGameComplete) {
      const generatedNews = buildScenarioOutcome(scenarioId, nextPath, metrics);

      mockResponse = {
        gameId,
        chosenOptionId: payload.optionId,
        currentNodeId: "final-route",
        accumulatedMetrics: metrics,
        choicesPath: nextPath,
        isGameComplete: true,
        generatedNews
      };
    } else {
      const nextNode = getDecisionNodeByStage(scenarioId, currentStage + 1);

      mockResponse = {
        gameId,
        chosenOptionId: payload.optionId,
        currentNodeId: nextNode.id,
        currentNode: nextNode,
        accumulatedMetrics: metrics,
        choicesPath: nextPath,
        isGameComplete: false
      };
    }

    return withFallback(
      () => apiRequest<MakeChoiceResponse, MakeChoicePayload>(endpoints.makeChoice(gameId), { method: "POST", body: payload }),
      () => withMockDelay(mockResponse)
    );
  },

  getUserGames: (userId: string) =>
    withFallback(
      () => apiRequest<SimulationGame[]>(endpoints.userGames(userId)),
      () => withMockDelay([])
    ),

  getDetectionChallenges: () =>
    withFallback(
      () => apiRequest<DetectionChallenge[]>(endpoints.detectionChallenges),
      () => withMockDelay(mockChallenges)
    ),

  submitDetectionAttempt: (payload: DetectionSubmissionPayload) =>
    withFallback(
      () => apiRequest<DetectionSubmissionResult, DetectionSubmissionPayload>(endpoints.detectionSubmit, { method: "POST", body: payload }),
      () => {
        const challenge = mockChallenges.find((item) => item.id === payload.challengeId) ?? mockChallenges[0];
        const correct = payload.selectedTactics.filter((item) => challenge.tactics.includes(item));
        const missed = challenge.tactics.filter((item) => !payload.selectedTactics.includes(item));
        const falsePositives = payload.selectedTactics.filter((item) => !challenge.tactics.includes(item));
        const accuracy = Math.round((correct.length / challenge.tactics.length) * 100);
        const speedBonus = Math.max(0, 30 - (payload.timeSpentSeconds ?? 45));
        const points = Math.max(0, accuracy + speedBonus - falsePositives.length * 7);

        return withMockDelay({
          challengeId: challenge.id,
          accuracy,
          points,
          correctTactics: correct,
          missedTactics: missed,
          falsePositives,
          feedback: "Focus on urgency cues and authority signals before sharing content."
        });
      }
    ),

  getDetectionHistory: (userId: string) =>
    withFallback(
      () => apiRequest<DetectionSubmissionResult[]>(endpoints.detectionHistory(userId)),
      () => withMockDelay([])
    )
};
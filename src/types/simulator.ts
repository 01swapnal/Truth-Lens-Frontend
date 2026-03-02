// Decision Tree Models
export interface DecisionOption {
  id: string;
  text: string;
  description?: string;
  tacticDelta?: string; // Tactic this choice introduces
  metrics?: {
    engagementDelta: number;
    viralityDelta: number;
    outrageDelta: number;
    credibilityDelta: number;
  };
}

export interface DecisionNode {
  id: string;
  prompt: string;
  description?: string;
  options: DecisionOption[];
  isEndNode?: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category?: string;
  difficulty: "easy" | "medium" | "hard";
  rootNodeId?: string;
}

export interface StartGamePayload {
  userId?: string;
  scenarioId: string;
}

export interface StartGameResponse {
  id: string;
  scenarioId: string;
  userId?: string;
  status?: "in_progress" | "completed";
  startedAt?: string;
  currentNodeId?: string;
  currentNode?: DecisionNode;
  accumulatedMetrics?: SimulationMetrics;
  choicesPath?: string[];
}

export interface SimulationMetrics {
  engagement: number;
  virality: number;
  outrage: number;
  credibility: number;
}

export interface MakeChoicePayload {
  optionId: string;
}

export interface MakeChoiceResponse {
  gameId: string;
  chosenOptionId: string;
  currentNodeId: string;
  currentNode?: DecisionNode;
  accumulatedMetrics: SimulationMetrics;
  choicesPath: string[];
  isGameComplete: boolean;
  generatedNews?: {
    title: string;
    body: string;
    tactics: string[];
    score: number;
    consequences: string[];
    realWorldExamples: string[];
  };
}

export interface GameState {
  id: string;
  scenarioId: string;
  userId?: string;
  status: "in_progress" | "completed";
  currentNodeId: string;
  accumulatedMetrics: SimulationMetrics;
  choicesPath: string[];
  createdAt?: string;
  completedAt?: string;
  finalResult?: {
    score: number;
    tactics: string[];
    consequences: string[];
    generatedNews?: string;
  };
}

export interface SimulationGame {
  id: string;
  userId?: string;
  scenarioId: string;
  status: "in_progress" | "completed";
  createdAt?: string;
  completedAt?: string;
  currentNodeId?: string;
  accumulatedMetrics?: SimulationMetrics;
  choicesPath?: string[];
}

export interface DetectionChallenge {
  id: string;
  title: string;
  content: string;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
  tactics: string[];
}

export interface DetectionSubmissionPayload {
  userId?: string;
  challengeId: string;
  selectedTactics: string[];
  timeSpentSeconds?: number;
}

export interface DetectionSubmissionResult {
  challengeId: string;
  accuracy: number;
  points: number;
  correctTactics: string[];
  missedTactics: string[];
  falsePositives: string[];
  feedback?: string;
}

export interface LeaderboardEntry {
  userId: string;
  totalScore: number;
  gamesPlayed: number;
}

export interface UserSimulatorStats {
  userId: string;
  gamesPlayed: number;
  averageManipulationScore: number;
  detectionAccuracy: number;
  completedChallenges: number;
}
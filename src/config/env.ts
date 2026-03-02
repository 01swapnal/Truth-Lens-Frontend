interface AppEnv {
  apiBaseUrl: string;
  useMockApi: boolean;
  requestTimeoutMs: number;
  endpoints: {
    highImpact: string;
    trending: string;
    article: string;
    factCheck: string;
    viral: string;
    lensTruth: string;
    simulatorScenarios: string;
    simulatorGames: string;
    simulatorStartGame: string;
    simulatorDetectionChallenges: string;
    simulatorDetectionSubmit: string;
    simulatorDetectionHistory: string;
  };
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
}

function parseNumber(value: string | undefined, defaultValue: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

export const appEnv: AppEnv = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? "http://localhost:3000",
  useMockApi: parseBoolean(import.meta.env.VITE_USE_MOCK_API as string | undefined, false),
  requestTimeoutMs: parseNumber(import.meta.env.VITE_API_TIMEOUT_MS as string | undefined, 8000),
  endpoints: {
    highImpact: (import.meta.env.VITE_API_HIGH_IMPACT_PATH as string | undefined) ?? "/api/news/high-impact",
    trending: (import.meta.env.VITE_API_TRENDING_PATH as string | undefined) ?? "/api/news/trending",
    article: (import.meta.env.VITE_API_ARTICLE_PATH as string | undefined) ?? "/api/news/article",
    factCheck: (import.meta.env.VITE_API_FACT_CHECK_PATH as string | undefined) ?? "/api/fact-check/text",
    viral: (import.meta.env.VITE_API_VIRAL_PATH as string | undefined) ?? "/api/news/viral",
    lensTruth: (import.meta.env.VITE_API_LENS_TRUTH_PATH as string | undefined) ?? "/api/fact-check/text",
    simulatorScenarios: (import.meta.env.VITE_API_SIM_SCENARIOS_PATH as string | undefined) ?? "/api/simulator/scenarios",
    simulatorGames: (import.meta.env.VITE_API_SIM_GAMES_PATH as string | undefined) ?? "/api/simulator/games",
    simulatorStartGame: (import.meta.env.VITE_API_SIM_START_GAME_PATH as string | undefined) ?? "/api/simulator/games/start",
    simulatorDetectionChallenges:
      (import.meta.env.VITE_API_SIM_DETECTION_CHALLENGES_PATH as string | undefined) ?? "/api/simulator/detection/challenges",
    simulatorDetectionSubmit:
      (import.meta.env.VITE_API_SIM_DETECTION_SUBMIT_PATH as string | undefined) ?? "/api/simulator/detection/submit",
    simulatorDetectionHistory:
      (import.meta.env.VITE_API_SIM_DETECTION_HISTORY_PATH as string | undefined) ?? "/api/simulator/detection/history"
  }
};

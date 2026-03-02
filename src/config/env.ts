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
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? "",
  useMockApi: parseBoolean(import.meta.env.VITE_USE_MOCK_API as string | undefined, true),
  requestTimeoutMs: parseNumber(import.meta.env.VITE_API_TIMEOUT_MS as string | undefined, 8000),
  endpoints: {
    highImpact: (import.meta.env.VITE_API_HIGH_IMPACT_PATH as string | undefined) ?? "/api/news/high-impact",
    trending: (import.meta.env.VITE_API_TRENDING_PATH as string | undefined) ?? "/api/news/trending",
    article: (import.meta.env.VITE_API_ARTICLE_PATH as string | undefined) ?? "/api/news/article",
    factCheck: (import.meta.env.VITE_API_FACT_CHECK_PATH as string | undefined) ?? "/api/news/fact-check",
    viral: (import.meta.env.VITE_API_VIRAL_PATH as string | undefined) ?? "/api/news/viral",
    lensTruth: (import.meta.env.VITE_API_LENS_TRUTH_PATH as string | undefined) ?? "/api/news/lens-truth"
  }
};

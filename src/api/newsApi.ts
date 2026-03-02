import { appEnv } from "../config/env";
import {
  getArticleByTopic,
  highImpactTopics,
  runMockLensTruthCheck,
  runMockFactCheck,
  trendingTopics,
  viralClaims
} from "../data/mockData";
import type { FactCheckResult, LensTruthResult, NewsArticle, TopicSummary, ViralClaim } from "../types/news";
import { apiRequest } from "./httpClient";

const endpoints = {
  highImpact: appEnv.endpoints.highImpact,
  trending: appEnv.endpoints.trending,
  article: (topic: string) => `${appEnv.endpoints.article}/${topic}`,
  factCheck: appEnv.endpoints.factCheck,
  viral: appEnv.endpoints.viral,
  lensTruth: appEnv.endpoints.lensTruth
};

const networkDelayMs = 250;

function withMockDelay<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), networkDelayMs);
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

export const newsApi = {
  getHighImpactTopics: () =>
    withFallback(
      () => apiRequest<TopicSummary[]>(endpoints.highImpact),
      () => withMockDelay(highImpactTopics)
    ),

  getTrendingTopics: () =>
    withFallback(
      () => apiRequest<TopicSummary[]>(endpoints.trending),
      () => withMockDelay(trendingTopics)
    ),

  getArticleByTopic: (topic: string) =>
    withFallback(
      () => apiRequest<NewsArticle>(endpoints.article(topic)),
      () => withMockDelay(getArticleByTopic(topic))
    ),

  checkFact: (claim: string) =>
    withFallback(
      () => apiRequest<FactCheckResult, { claim: string }>(endpoints.factCheck, { method: "POST", body: { claim } }),
      () => withMockDelay(runMockFactCheck(claim))
    ),

  getViralClaims: () =>
    withFallback(
      () => apiRequest<ViralClaim[]>(endpoints.viral),
      () => withMockDelay(viralClaims)
    ),

  checkLensTruth: (target: string) =>
    withFallback(
      () => apiRequest<LensTruthResult, { target: string }>(endpoints.lensTruth, { method: "POST", body: { target } }),
      () => withMockDelay(runMockLensTruthCheck(target))
    )
};

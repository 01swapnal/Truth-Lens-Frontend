import { appEnv } from "../config/env";
import type { ArticleAnalysis, FactCheckResult, LensTruthResult, NewsArticle, TopicSummary, ViralClaim } from "../types/news";
import { apiRequest } from "./httpClient";

const endpoints = {
  highImpact: appEnv.endpoints.highImpact,
  trending: appEnv.endpoints.trending,
  article: (topic: string) => `${appEnv.endpoints.article}/${topic}`,
  factCheck: appEnv.endpoints.factCheck,
  viral: appEnv.endpoints.viral,
  lensTruth: appEnv.endpoints.lensTruth
};

// Helper to transform backend News to frontend TopicSummary
function transformToTopicSummary(news: any): TopicSummary {
  return {
    slug: news.slug || news.id,
    title: news.title,
    summary: news.description,
    impactScore: news.impactScore || 0,
    trendScore: news.trendScore || 0,
    image: news.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"
  };
}

// Helper to transform backend News to frontend NewsArticle
function transformToNewsArticle(news: any): NewsArticle {
  let parsedContent = { body: [], analysis: {}, sourceComparison: [] };
  
  try {
    parsedContent = typeof news.content === 'string' ? JSON.parse(news.content) : news.content;
  } catch (e) {
    console.warn('Failed to parse news content:', e);
  }

  const defaultAnalysis: ArticleAnalysis = {
    confidence: "Medium",
    confidenceScore: 50,
    sourcesAnalyzed: 0,
    lastUpdated: new Date().toISOString(),
    politicalLean: 0,
    emotionalTone: 0,
    factDensity: { factual: 50, contextual: 30, opinion: 20 },
    sourceReliability: []
  };

  return {
    topic: news.slug || news.id,
    title: news.title,
    body: parsedContent.body || [],
    analysis: { ...defaultAnalysis, ...parsedContent.analysis },
    sourceComparison: parsedContent.sourceComparison || []
  };
}

// Helper to transform backend viral claim to frontend ViralClaim
function transformToViralClaim(news: any): ViralClaim {
  return {
    id: news.id,
    headline: news.title,
    status: news.verificationStatus as "Fake" | "Likely True" | "Needs Context",
    summary: news.description
  };
}

export const newsApi = {
  getHighImpactTopics: async () => {
    const response = await apiRequest<any[]>(endpoints.highImpact);
    return response.map(transformToTopicSummary);
  },

  getTrendingTopics: async () => {
    const response = await apiRequest<any[]>(endpoints.trending);
    return response.map(transformToTopicSummary);
  },

  getArticleByTopic: async (topic: string) => {
    const response = await apiRequest<any>(endpoints.article(topic));
    return transformToNewsArticle(response);
  },

  checkFact: async (claim: string) => {
    const response = await apiRequest<any, { text: string }>(
      endpoints.factCheck,
      { method: "POST", body: { text: claim } }
    );
    
    // Transform backend fact-check response to frontend format
    return {
      verdict: response.factCheck?.status || response.verificationStatus || "Needs Context",
      evidence: [
        response.factCheck?.explanation || response.explanation || "No explanation available"
      ]
    } as FactCheckResult;
  },

  getViralClaims: async () => {
    const response = await apiRequest<any[]>(endpoints.viral);
    return response.map(transformToViralClaim);
  },

  checkLensTruth: async (target: string) => {
    // For now, use fact-check endpoint and transform response
    const response = await apiRequest<any, { text: string }>(
      endpoints.lensTruth,
      { method: "POST", body: { text: target } }
    );
    
    const confidence = response.factCheck?.confidence || response.confidence || 0.5;
    const score = Math.round(confidence * 100);
    
    return {
      score,
      verdict: score > 70 ? "Likely True" : score < 40 ? "Likely Misleading" : "Mixed Signals",
      reasons: [
        response.factCheck?.explanation || response.explanation || "Analysis in progress"
      ]
    } as LensTruthResult;
  }
};

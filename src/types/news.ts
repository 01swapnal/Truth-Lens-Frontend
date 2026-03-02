export type HighlightStatus = "verified" | "disputed" | "normal";

export interface HighlightSegment {
  text: string;
  status: HighlightStatus;
}

export interface TopicSummary {
  slug: string;
  title: string;
  summary: string;
  impactScore: number;
  trendScore: number;
  image: string;
}

export interface SourceReliabilityPoint {
  source: string;
  score: number;
}

export interface FactDensity {
  factual: number;
  contextual: number;
  opinion: number;
}

export interface ArticleAnalysis {
  confidence: "High" | "Medium" | "Low";
  confidenceScore: number;
  sourcesAnalyzed: number;
  lastUpdated: string;
  politicalLean: number;
  emotionalTone: number;
  factDensity: FactDensity;
  sourceReliability: SourceReliabilityPoint[];
}

export interface ArticleSource {
  source: string;
  politicalLean: "Left" | "Center" | "Right";
  reliability: number;
  stance: "Supports" | "Mixed" | "Challenges";
}

export interface NewsArticle {
  topic: string;
  title: string;
  body: HighlightSegment[];
  analysis: ArticleAnalysis;
  sourceComparison: ArticleSource[];
}

export interface FactCheckResult {
  verdict: "Likely Accurate" | "Needs Context" | "Potentially Misleading";
  evidence: string[];
}

export interface ViralClaim {
  id: string;
  headline: string;
  status: "Fake" | "Needs Context" | "Likely True";
  summary: string;
}

export interface LensTruthResult {
  score: number;
  verdict: "Likely True" | "Mixed Signals" | "Likely Misleading";
  reasons: string[];
}

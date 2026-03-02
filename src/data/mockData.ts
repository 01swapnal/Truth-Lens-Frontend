import type { FactCheckResult, LensTruthResult, NewsArticle, TopicSummary, ViralClaim } from "../types/news";

export const highImpactTopics: TopicSummary[] = [
  {
    slug: "global-energy-prices",
    title: "Global Energy Prices",
    summary: "Price volatility and policy shifts are reshaping household and industrial costs.",
    impactScore: 92,
    trendScore: 81,
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "public-health-funding",
    title: "Public Health Funding",
    summary: "Budget debates are affecting frontline infrastructure and long-term readiness.",
    impactScore: 88,
    trendScore: 74,
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "ai-regulation-framework",
    title: "AI Regulation Framework",
    summary: "New compliance models are emerging across government and enterprise.",
    impactScore: 90,
    trendScore: 86,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
  }
];

export const trendingTopics: TopicSummary[] = [
  ...highImpactTopics,
  {
    slug: "election-information-integrity",
    title: "Election Information Integrity",
    summary: "Cross-platform claims are being audited for source credibility and timing.",
    impactScore: 85,
    trendScore: 89,
    image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "water-security-index",
    title: "Water Security Index",
    summary: "Regional scarcity metrics are now tied directly to trade and health policy.",
    impactScore: 79,
    trendScore: 77,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80"
  }
];

export const viralClaims: ViralClaim[] = [
  {
    id: "viral-1",
    headline: "Nationwide power prices dropped 40% in one week",
    status: "Fake",
    summary: "No verified grid or regulator dataset supports this scale of short-window decline."
  },
  {
    id: "viral-2",
    headline: "AI policy draft bans every open-source model",
    status: "Needs Context",
    summary: "Current drafts focus on high-risk deployment controls, not blanket model bans."
  },
  {
    id: "viral-3",
    headline: "Preventive health funding expanded in the latest budget cycle",
    status: "Likely True",
    summary: "Budget disclosures and multi-source reports indicate a measurable increase."
  }
];

const defaultArticle: NewsArticle = {
  topic: "global-energy-prices",
  title: "Energy markets stabilize after policy realignment",
  body: [
    {
      text: "Independent energy reports show a 7% decline in wholesale volatility over the last quarter.",
      status: "verified"
    },
    {
      text: "Some outlets claim consumer bills have universally dropped, but regional tariff data remains mixed.",
      status: "disputed"
    },
    {
      text: "Analysts attribute stabilization to strategic reserves, shipping normalization, and incremental demand balancing.",
      status: "normal"
    },
    {
      text: "Regulatory agencies confirmed that emergency subsidy policies are being phased gradually rather than abruptly.",
      status: "verified"
    }
  ],
  analysis: {
    confidence: "Medium",
    confidenceScore: 73,
    sourcesAnalyzed: 14,
    lastUpdated: "2026-03-02T08:30:00.000Z",
    politicalLean: 8,
    emotionalTone: 41,
    factDensity: {
      factual: 58,
      contextual: 27,
      opinion: 15
    },
    sourceReliability: [
      { source: "PolicyWire", score: 86 },
      { source: "Global Ledger", score: 78 },
      { source: "Public Brief", score: 82 },
      { source: "Open Desk", score: 69 },
      { source: "ViewPoint Now", score: 61 }
    ]
  },
  sourceComparison: [
    { source: "PolicyWire", politicalLean: "Center", reliability: 86, stance: "Supports" },
    { source: "Global Ledger", politicalLean: "Right", reliability: 78, stance: "Mixed" },
    { source: "Public Brief", politicalLean: "Center", reliability: 82, stance: "Supports" },
    { source: "Open Desk", politicalLean: "Left", reliability: 69, stance: "Mixed" },
    { source: "ViewPoint Now", politicalLean: "Right", reliability: 61, stance: "Challenges" }
  ]
};

const aiArticle: NewsArticle = {
  ...defaultArticle,
  topic: "ai-regulation-framework",
  title: "Draft AI compliance framework enters cross-sector review",
  body: [
    {
      text: "Regulatory drafts require model risk documentation for high-impact deployments.",
      status: "verified"
    },
    {
      text: "Commentary claiming all open-source models will be banned is not supported by the current text.",
      status: "disputed"
    },
    {
      text: "Stakeholders are negotiating phased timelines for audits and incident disclosure.",
      status: "normal"
    }
  ]
};

const healthArticle: NewsArticle = {
  ...defaultArticle,
  topic: "public-health-funding",
  title: "Public health allocations expand in preventive care but tighten in operations",
  analysis: {
    ...defaultArticle.analysis,
    confidence: "High",
    confidenceScore: 81,
    sourcesAnalyzed: 18,
    politicalLean: -4,
    emotionalTone: 35
  }
};

export const articlesByTopic: Record<string, NewsArticle> = {
  [defaultArticle.topic]: defaultArticle,
  [aiArticle.topic]: aiArticle,
  [healthArticle.topic]: healthArticle
};

export function getArticleByTopic(topic: string): NewsArticle {
  return articlesByTopic[topic] ?? defaultArticle;
}

export function runMockFactCheck(input: string): FactCheckResult {
  const value = input.trim().toLowerCase();

  if (!value) {
    return {
      verdict: "Needs Context",
      evidence: ["No claim provided. Add a sentence to evaluate factual support and source alignment."]
    };
  }

  if (value.includes("always") || value.includes("never") || value.includes("everyone")) {
    return {
      verdict: "Potentially Misleading",
      evidence: [
        "Absolute language increases risk of overgeneralization.",
        "Cross-source comparison indicates meaningful regional variation.",
        "Claim requires bounded scope (time, geography, and source methodology)."
      ]
    };
  }

  return {
    verdict: "Likely Accurate",
    evidence: [
      "Claim aligns with majority-source reporting patterns.",
      "No high-confidence contradiction found in current mock source set.",
      "Additional verification recommended for latest updates before publication."
    ]
  };
}

export function runMockLensTruthCheck(target: string): LensTruthResult {
  const value = target.trim().toLowerCase();

  if (!value) {
    return {
      score: 52,
      verdict: "Mixed Signals",
      reasons: ["No target URL or text was provided for analysis.", "Provide a claim or URL for stronger evidence."]
    };
  }

  if (value.includes("shocking") || value.includes("100%") || value.includes("guaranteed")) {
    return {
      score: 24,
      verdict: "Likely Misleading",
      reasons: [
        "Sensational language detected in headline pattern.",
        "Claim style indicates low-source verification risk.",
        "Cross-source corroboration is weak in mock dataset."
      ]
    };
  }

  return {
    score: 78,
    verdict: "Likely True",
    reasons: [
      "Claim structure aligns with multi-source reporting style.",
      "No direct contradiction in current mock evidence set.",
      "Recommend final verification against latest primary sources."
    ]
  };
}

import type { DecisionNode } from "../types/simulator";

// ============================================================================
// STAGE 1: TONE
// ============================================================================

export const stageOneTones: DecisionNode = {
  id: "stage-1-tone",
  prompt: "What emotional tone will you use to frame this narrative?",
  description: "Choose the primary emotional trigger for your campaign",
  options: [
    {
      id: "T1",
      text: "Fear & Safety",
      description: "Focus on potential harm and danger",
      tacticDelta: "false_urgency",
      metrics: {
        engagementDelta: 18,
        viralityDelta: 14,
        outrageDelta: 20,
        credibilityDelta: -12
      }
    },
    {
      id: "T2",
      text: "Anger & Betrayal",
      description: "Highlight perceived institutional failure",
      tacticDelta: "us_vs_them",
      metrics: {
        engagementDelta: 16,
        viralityDelta: 16,
        outrageDelta: 22,
        credibilityDelta: -10
      }
    },
    {
      id: "T3",
      text: "Conspiracy & Cover-up",
      description: "Suggest hidden truths and suppression",
      tacticDelta: "conspiracy_framing",
      metrics: {
        engagementDelta: 14,
        viralityDelta: 18,
        outrageDelta: 16,
        credibilityDelta: -18
      }
    },
    {
      id: "T4",
      text: "Doubt & Caution",
      description: "Cast subtle questions about legitimacy",
      tacticDelta: "cherry_picking",
      metrics: {
        engagementDelta: 10,
        viralityDelta: 8,
        outrageDelta: 8,
        credibilityDelta: -6
      }
    }
  ]
};

// ============================================================================
// STAGE 2: EVIDENCE TYPE
// ============================================================================

export const stageTwoEvidence: DecisionNode = {
  id: "stage-2-evidence",
  prompt: "What type of 'evidence' will support your narrative?",
  description: "Choose how you'll back up your claim",
  options: [
    {
      id: "E1",
      text: "Fake Expert Quote",
      description: "Attribute claims to unnamed medical professionals",
      tacticDelta: "false_authority",
      metrics: {
        engagementDelta: 12,
        viralityDelta: 10,
        outrageDelta: 8,
        credibilityDelta: -8
      }
    },
    {
      id: "E2",
      text: "Edited Medical Image",
      description: "Manipulate a real image to suggest danger",
      tacticDelta: "media_distrust",
      metrics: {
        engagementDelta: 15,
        viralityDelta: 14,
        outrageDelta: 12,
        credibilityDelta: -14
      }
    },
    {
      id: "E3",
      text: "Old Report (Out of Context)",
      description: "Use outdated research from years ago",
      tacticDelta: "cherry_picking",
      metrics: {
        engagementDelta: 11,
        viralityDelta: 9,
        outrageDelta: 10,
        credibilityDelta: -9
      }
    },
    {
      id: "E4",
      text: "Misquoted Official Statement",
      description: "Twist words from health authority",
      tacticDelta: "exaggeration",
      metrics: {
        engagementDelta: 13,
        viralityDelta: 11,
        outrageDelta: 9,
        credibilityDelta: -7
      }
    }
  ]
};

// ============================================================================
// STAGE 3: SPREAD STRATEGY
// ============================================================================

export const stageThreeSpread: DecisionNode = {
  id: "stage-3-spread",
  prompt: "How will you distribute this narrative?",
  description: "Choose your primary distribution channel",
  options: [
    {
      id: "S1",
      text: "Encrypted Messenger Blast",
      description: "Mass forward through WhatsApp/Telegram groups",
      tacticDelta: "false_urgency",
      metrics: {
        engagementDelta: 8,
        viralityDelta: 12,
        outrageDelta: 6,
        credibilityDelta: 0
      }
    },
    {
      id: "S2",
      text: "Bot Network Amplification",
      description: "Use automated accounts to create fake consensus",
      tacticDelta: "social_proof",
      metrics: {
        engagementDelta: 14,
        viralityDelta: 20,
        outrageDelta: 10,
        credibilityDelta: -4
      }
    },
    {
      id: "S3",
      text: "Influencer Collaboration",
      description: "Pay creators to spread the narrative",
      tacticDelta: "false_authority",
      metrics: {
        engagementDelta: 16,
        viralityDelta: 15,
        outrageDelta: 12,
        credibilityDelta: -6
      }
    },
    {
      id: "S4",
      text: "Targeted Community Ads",
      description: "Micro-target vulnerable populations",
      tacticDelta: "emotional_manipulation",
      metrics: {
        engagementDelta: 12,
        viralityDelta: 9,
        outrageDelta: 14,
        credibilityDelta: -5
      }
    }
  ]
};

// ============================================================================
// STAGE 4: REINFORCEMENT
// ============================================================================

export const stageFourReinforcement: DecisionNode = {
  id: "stage-4-reinforcement",
  prompt: "How will you reinforce the message?",
  description: "Choose how to keep the narrative alive",
  options: [
    {
      id: "R1",
      text: "Artificial Urgency",
      description: "Claim evidence will be 'deleted' / 'suppressed'",
      tacticDelta: "false_urgency",
      metrics: {
        engagementDelta: 10,
        viralityDelta: 14,
        outrageDelta: 8,
        credibilityDelta: -6
      }
    },
    {
      id: "R2",
      text: "Fake Testimonials",
      description: "Post fake patient stories corroborating claims",
      tacticDelta: "social_proof",
      metrics: {
        engagementDelta: 14,
        viralityDelta: 10,
        outrageDelta: 12,
        credibilityDelta: -10
      }
    },
    {
      id: "R3",
      text: "Hashtag Campaign",
      description: "Create trending hashtags to drive algorithmic boost",
      tacticDelta: "groupthink",
      metrics: {
        engagementDelta: 16,
        viralityDelta: 18,
        outrageDelta: 10,
        credibilityDelta: -4
      }
    },
    {
      id: "R4",
      text: "Public Health Framing",
      description: "Frame as 'concerned citizens protecting community'",
      tacticDelta: "false_authority",
      metrics: {
        engagementDelta: 11,
        viralityDelta: 8,
        outrageDelta: 9,
        credibilityDelta: -3
      }
    }
  ]
};

// ============================================================================
// FINAL ROUTE RESOLVER
// Routes determined by Tone + Spread + Evidence combination
// ============================================================================

export type FinalRouteId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export interface FinalRoute {
  id: FinalRouteId;
  name: string;
  description: string;
  headline: string;
  body: string;
  tactics: string[];
  consequences: string[];
  score: number;
  impactProfile: {
    panic: number;
    virality: number;
    believability: number;
    polarization: number;
  };
}

export const finalRoutes: Record<FinalRouteId, FinalRoute> = {
  A: {
    id: "A",
    name: "Panic Explosion",
    description: "Fear tone + messenger spread triggers immediate safety panic",
    headline: "Is The New Vaccine Safe? Concerns Raised by Medical Professional",
    body: `An anonymous source within the medical community has raised serious concerns about the safety protocols surrounding the recently approved vaccine rollout.

"We have not had sufficient time to evaluate long-term effects," the insider alleged in a leaked communication.

Parents are advised to exercise caution and demand additional safety documentation before allowing their children to participate in vaccination programs.

[URGENT] Share this message before it gets removed from social media.`,
    tactics: [
      "false_authority",
      "false_urgency",
      "cherry_picking",
      "emotional_manipulation"
    ],
    consequences: [
      "Immediate vaccine hesitancy among vulnerable populations",
      "Offline community panic and emergency calls to health lines",
      "Disruption of public health initiatives",
      "Preventable disease outbreaks in low-immunity communities"
    ],
    score: 78,
    impactProfile: {
      panic: 92,
      virality: 65,
      believability: 58,
      polarization: 72
    }
  },

  B: {
    id: "B",
    name: "Political Outrage Storm",
    description: "Anger tone + targeted ads creates polarized debate",
    headline: "Government Incompetence? Vaccine Rollout Faces Major Delays and Criticism",
    body: `Critics are now openly questioning the competence of health authorities as the vaccination program faces yet another setback.

"This pattern of failure shows a complete disconnect between officials and public safety," claims a prominent health policy commentator.

Online campaigns under #VaccineFailure2026 are gaining significant traction across social platforms, with thousands calling for accountability.

Supporters and opponents are engaged in heated debate about institutional trustworthiness.`,
    tactics: [
      "us_vs_them",
      "emotional_manipulation",
      "groupthink",
      "false_authority"
    ],
    consequences: [
      "Severe institutional distrust and polarization",
      "Reduced cooperation with future public health measures",
      "Political weaponization of health policy",
      "Long-term erosion of medical authority"
    ],
    score: 72,
    impactProfile: {
      panic: 45,
      virality: 88,
      believability: 62,
      polarization: 95
    }
  },

  C: {
    id: "C",
    name: "Viral Conspiracy Wave",
    description: "Conspiracy tone + bot amplification creates artificial consensus",
    headline: "What Are They Hiding? Leaked Image Suggests Vaccine Safety Concerns",
    body: `A circulating image allegedly obtained from inside a vaccine manufacturing facility has sparked widespread concern among online communities.

The image appears to show concerning conditions, though authorities have not officially commented.

Tech-savvy users are rapidly analyzing and sharing the image across platforms, with online forums suggesting possible regulatory cover-ups.

Automated accounts are amplifying the message to unprecedented reach.`,
    tactics: [
      "conspiracy_framing",
      "media_distrust",
      "false_authority",
      "social_proof"
    ],
    consequences: [
      "Artificial consensus creation through bot networks",
      "Rapid viral spread bypassing fact-checkers",
      "Media coverage due to trending status",
      "Delayed public health response window"
    ],
    score: 81,
    impactProfile: {
      panic: 68,
      virality: 94,
      believability: 48,
      polarization: 74
    }
  },

  D: {
    id: "D",
    name: "Slow Perception Shift",
    description: "Subtle doubt + influencer collaboration erodes trust gradually",
    headline: "Technical Review Reveals Additional Vaccine Safety Considerations",
    body: `Health officials have disclosed that extended safety evaluations have contributed to delays in the vaccine rollout.

According to regulatory documentation, additional structural assessments of manufacturing protocols may require timeline adjustments.

While officials maintain that the process is routine, some health commentators have noted that transparency around these reviews could benefit public confidence.

A respected health influencer recently suggested that asking questions about vaccine timelines is a form of "responsible citizenship."`,
    tactics: [
      "cherry_picking",
      "exaggeration",
      "false_authority",
      "emotional_manipulation"
    ],
    consequences: [
      "Long-term trust erosion among educated populations",
      "Subtle but persistent vaccine hesitancy",
      "Difficulty reversing perception shift",
      "Lower public health compliance over time"
    ],
    score: 58,
    impactProfile: {
      panic: 22,
      virality: 35,
      believability: 78,
      polarization: 48
    }
  },

  E: {
    id: "E",
    name: "Bot-Powered Chaos",
    description: "Bot amplification with hashtag campaign creates trending manipulation",
    headline: "#VaccineConcerns Trends as Rollout Faces Fresh Scrutiny",
    body: `Online discussion surrounding the vaccine program has surged dramatically after new allegations surfaced about potential safety oversights.

The hashtag #VaccineConcerns is now trending across multiple platforms, with thousands of automated and organic posts driving engagement.

Major news outlets have begun covering the trending topic, further amplifying the narrative regardless of factual verification.

Public health authorities are struggling to respond fast enough to the viral information cascade.`,
    tactics: [
      "groupthink",
      "social_proof",
      "false_urgency",
      "emotional_manipulation"
    ],
    consequences: [
      "Trending manipulation forces media pickup",
      "Algorithmic amplification of unverified claims",
      "Fact-checkers overwhelmed by volume",
      "Delayed official response allows misinformation dominance window"
    ],
    score: 75,
    impactProfile: {
      panic: 54,
      virality: 92,
      believability: 45,
      polarization: 68
    }
  },

  F: {
    id: "F",
    name: "Emotional Manipulation Loop",
    description: "Fake testimonials + influencer spread creates community-level panic",
    headline: "Residents Report Health Changes After Vaccine Rollout Announcement",
    body: `Multiple citizens across social media platforms have reported experiencing unexpected health symptoms coinciding with the vaccine program announcement.

"My child became ill the same day the program was announced," shared one concerned parent in a viral post.

Health influencers have amplified these testimonials, sparking wider discussion about potential health concerns.

Although medical causation has not been established, the emotional resonance of these stories is driving significant community-level concern and vaccine hesitancy.`,
    tactics: [
      "social_proof",
      "emotional_manipulation",
      "false_authority",
      "false_urgency"
    ],
    consequences: [
      "High believability due to personal stories",
      "Community-level panic difficult to counter",
      "Rapid vaccine hesitancy adoption",
      "Hard to debunk due to anecdotal nature"
    ],
    score: 76,
    impactProfile: {
      panic: 88,
      virality: 72,
      believability: 72,
      polarization: 58
    }
  },

  G: {
    id: "G",
    name: "Misinformation Fade",
    description: "Subtle tone + low amplification limits spread but maintains doubt",
    headline: "Vaccine Program Faces Minor Administrative Adjustments",
    body: `Health authorities have confirmed that extended documentation review has caused minor adjustments to the vaccine rollout timeline.

Officials attribute the delay to standard regulatory protocols ensuring thorough evaluation of safety measures.

The adjustment is expected to have minimal impact on overall program objectives.

Regulatory agencies maintain that all procedures are proceeding normally.`,
    tactics: [
      "cherry_picking",
      "false_authority",
      "exaggeration"
    ],
    consequences: [
      "Low immediate virality limits spread",
      "Minimal panic or disruption",
      "Fact-checkers can provide quick corrections",
      "Limited long-term trust impact"
    ],
    score: 38,
    impactProfile: {
      panic: 12,
      virality: 18,
      believability: 68,
      polarization: 22
    }
  },

  H: {
    id: "H",
    name: "High-Speed Hybrid Storm",
    description: "Fear + bot amplification + urgency creates explosive short-term chaos",
    headline: "Urgent: Leaked Evidence Suggests Vaccine Safety Risks – Share Before Deletion",
    body: `Online sources are claiming newly surfaced information points to serious structural concerns within the vaccine safety approval process.

An alleged leaked document suggests that critical warnings were overlooked during regulatory review.

Anonymous whistleblowers posted the evidence to multiple platforms simultaneously, claiming that health authorities are working to suppress the information.

"Share immediately before this gets removed," warned the original poster. "They don't want you to know the truth."

The information is spreading at unprecedented velocity across encrypted messaging and social platforms.`,
    tactics: [
      "false_urgency",
      "conspiracy_framing",
      "media_distrust",
      "false_authority",
      "social_proof"
    ],
    consequences: [
      "Explosive viral spread in short 12-24 hour window",
      "Fact-checkers cannot respond quickly enough",
      "Media forced to cover due to trending status",
      "Significant vaccine hesitancy adoption before correction",
      "Public health system response delay allows maximized damage"
    ],
    score: 87,
    impactProfile: {
      panic: 86,
      virality: 96,
      believability: 52,
      polarization: 82
    }
  }
};

// ============================================================================
// ROUTE RESOLUTION LOGIC
// Maps decision path (T, E, S, R) to final route
// ============================================================================

export function resolveFinalRoute(
  tone: string,
  evidence: string,
  spread: string,
  reinforcement: string
): FinalRouteId {
  // Route A: Panic Explosion
  // Fear + (WhatsApp OR Targeted Ads) + Urgency
  if (
    tone === "T1" &&
    (spread === "S1" || spread === "S4") &&
    reinforcement === "R1"
  ) {
    return "A";
  }

  // Route B: Political Outrage Storm
  // Anger + (Targeted Ads OR Hashtag) + (Hashtag OR Public Health Framing)
  if (
    tone === "T2" &&
    (spread === "S4" || spread === "S3") &&
    (reinforcement === "R3" || reinforcement === "R4")
  ) {
    return "B";
  }

  // Route C: Viral Conspiracy Wave
  // Conspiracy + Bot + (Fake Quote OR Edited Image)
  if (tone === "T3" && spread === "S2" && (evidence === "E1" || evidence === "E2")) {
    return "C";
  }

  // Route D: Slow Perception Shift
  // Subtle Doubt + Influencer + Misquote or Old Report
  if (tone === "T4" && spread === "S3" && (evidence === "E3" || evidence === "E4")) {
    return "D";
  }

  // Route E: Bot-Powered Chaos
  // Bot + Hashtag (any tone)
  if (spread === "S2" && reinforcement === "R3") {
    return "E";
  }

  // Route F: Emotional Manipulation Loop
  // Fear OR Anger + Fake Testimonials + Influencer
  if (
    (tone === "T1" || tone === "T2") &&
    reinforcement === "R2" &&
    spread === "S3"
  ) {
    return "F";
  }

  // Route G: Misinformation Fade
  // Subtle + WhatsApp + Public Health Framing
  if (
    tone === "T4" &&
    spread === "S1" &&
    (reinforcement === "R4" || reinforcement === "R1")
  ) {
    return "G";
  }

  // Route H: High-Speed Hybrid Storm
  // (Fear OR Conspiracy) + Bot + Urgency
  if (
    (tone === "T1" || tone === "T3") &&
    spread === "S2" &&
    reinforcement === "R1"
  ) {
    return "H";
  }

  // Default fallback to Route E (bot chaos)
  return "E";
}

// ============================================================================
// METRICS ACCUMULATION
// Calculate final metrics based on path choices
// ============================================================================

export function calculateAccumulatedMetrics(
  tone: string,
  evidence: string,
  spread: string,
  reinforcement: string
): {
  engagement: number;
  virality: number;
  outrage: number;
  credibility: number;
} {
  let engagement = 20;
  let virality = 15;
  let outrage = 10;
  let credibility = 50;

  // Apply tone deltas
  const toneDeltas: Record<string, any> = {
    T1: { engagement: 18, virality: 14, outrage: 20, credibility: -12 },
    T2: { engagement: 16, virality: 16, outrage: 22, credibility: -10 },
    T3: { engagement: 14, virality: 18, outrage: 16, credibility: -18 },
    T4: { engagement: 10, virality: 8, outrage: 8, credibility: -6 }
  };

  if (toneDeltas[tone]) {
    engagement += toneDeltas[tone].engagement;
    virality += toneDeltas[tone].virality;
    outrage += toneDeltas[tone].outrage;
    credibility += toneDeltas[tone].credibility;
  }

  // Apply evidence deltas
  const evidenceDeltas: Record<string, any> = {
    E1: { engagement: 12, virality: 10, outrage: 8, credibility: -8 },
    E2: { engagement: 15, virality: 14, outrage: 12, credibility: -14 },
    E3: { engagement: 11, virality: 9, outrage: 10, credibility: -9 },
    E4: { engagement: 13, virality: 11, outrage: 9, credibility: -7 }
  };

  if (evidenceDeltas[evidence]) {
    engagement += evidenceDeltas[evidence].engagement;
    virality += evidenceDeltas[evidence].virality;
    outrage += evidenceDeltas[evidence].outrage;
    credibility += evidenceDeltas[evidence].credibility;
  }

  // Apply spread deltas
  const spreadDeltas: Record<string, any> = {
    S1: { engagement: 8, virality: 12, outrage: 6, credibility: 0 },
    S2: { engagement: 14, virality: 20, outrage: 10, credibility: -4 },
    S3: { engagement: 16, virality: 15, outrage: 12, credibility: -6 },
    S4: { engagement: 12, virality: 9, outrage: 14, credibility: -5 }
  };

  if (spreadDeltas[spread]) {
    engagement += spreadDeltas[spread].engagement;
    virality += spreadDeltas[spread].virality;
    outrage += spreadDeltas[spread].outrage;
    credibility += spreadDeltas[spread].credibility;
  }

  // Apply reinforcement deltas
  const reinforcementDeltas: Record<string, any> = {
    R1: { engagement: 10, virality: 14, outrage: 8, credibility: -6 },
    R2: { engagement: 14, virality: 10, outrage: 12, credibility: -10 },
    R3: { engagement: 16, virality: 18, outrage: 10, credibility: -4 },
    R4: { engagement: 11, virality: 8, outrage: 9, credibility: -3 }
  };

  if (reinforcementDeltas[reinforcement]) {
    engagement += reinforcementDeltas[reinforcement].engagement;
    virality += reinforcementDeltas[reinforcement].virality;
    outrage += reinforcementDeltas[reinforcement].outrage;
    credibility += reinforcementDeltas[reinforcement].credibility;
  }

  // Normalize to 0-100
  engagement = Math.max(0, Math.min(100, engagement));
  virality = Math.max(0, Math.min(100, virality));
  outrage = Math.max(0, Math.min(100, outrage));
  credibility = Math.max(0, Math.min(100, credibility));

  return { engagement, virality, outrage, credibility };
}

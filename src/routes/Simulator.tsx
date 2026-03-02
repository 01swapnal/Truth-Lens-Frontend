import { useEffect, useMemo, useState } from "react";
import { Target, AlertTriangle, Check, BarChart3, Zap, Palette, RefreshCw, Gamepad2 } from "lucide-react";
import { simulatorApi } from "../api/simulatorApi";
import { useTheme } from "../components/ThemeContext";
import type {
  DecisionNode,
  DetectionChallenge,
  DetectionSubmissionResult,
  GameState,
  MakeChoiceResponse,
  Scenario
} from "../types/simulator";

type Mode = "creation" | "detection";

const tacticOptions = [
  "false_urgency",
  "conspiracy_framing",
  "us_vs_them",
  "false_authority",
  "cherry_picking",
  "media_distrust",
  "exaggeration"
];

// Random curated image collections by theme
const imageCollections = {
  vaccine: [
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1400&h=600&fit=crop"
  ],
  fuel: [
    "https://images.unsplash.com/photo-1545262810-77515befe149?w=1400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1617886322168-72b886573c5f?w=1400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=1400&h=600&fit=crop"
  ],
  election: [
    "https://images.unsplash.com/photo-1495783436814-57b91679ac35?w=1400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=1400&h=600&fit=crop"
  ],
  media: [
    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=900&h=360&fit=crop",
    "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=900&h=360&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=360&fit=crop",
    "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=900&h=360&fit=crop"
  ],
  social: [
    "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=900&h=360&fit=crop",
    "https://images.unsplash.com/photo-1573164574230-db1d5e960238?w=900&h=360&fit=crop",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&h=360&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&h=360&fit=crop"
  ],
  crisis: [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&h=360&fit=crop",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&h=360&fit=crop",
    "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=900&h=360&fit=crop",
    "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?w=900&h=360&fit=crop"
  ],
  stage: [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1400&h=460&fit=crop",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&h=460&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&h=460&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=460&fit=crop"
  ]
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function selectImageFromCollection(collection: string[], seed: string): string {
  const hash = hashString(seed);
  const index = hash % collection.length;
  return collection[index];
}

function getScenarioBannerImage(scenarioId: string | undefined, _scenarioTitle: string): string {
  if (scenarioId?.includes("vaccine")) {
    return selectImageFromCollection(imageCollections.vaccine, `banner-${scenarioId}`);
  }
  if (scenarioId?.includes("fuel")) {
    return selectImageFromCollection(imageCollections.fuel, `banner-${scenarioId}`);
  }
  if (scenarioId?.includes("election")) {
    return selectImageFromCollection(imageCollections.election, `banner-${scenarioId}`);
  }
  return selectImageFromCollection(imageCollections.vaccine, `banner-${scenarioId}`);
}

function getResultImage(scenarioId: string | undefined, resultTitle: string, _resultBody: string): string {
  if (scenarioId?.includes("vaccine")) {
    return selectImageFromCollection(imageCollections.vaccine, `result-${resultTitle}`);
  }
  if (scenarioId?.includes("fuel")) {
    return selectImageFromCollection(imageCollections.fuel, `result-${resultTitle}`);
  }
  if (scenarioId?.includes("election")) {
    return selectImageFromCollection(imageCollections.election, `result-${resultTitle}`);
  }
  return selectImageFromCollection(imageCollections.social, `result-${resultTitle}`);
}

function getStageImage(_scenarioId: string | undefined, nodeId: string, prompt: string, _description?: string): string {
  return selectImageFromCollection(imageCollections.stage, `stage-${nodeId}-${prompt}`);
}

function getConsequenceImage(consequence: string, index: number, _scenarioId?: string): string {
  const text = consequence.toLowerCase();
  
  if (text.includes("panic") || text.includes("outbreak") || text.includes("emergency") || text.includes("disruption")) {
    return selectImageFromCollection(imageCollections.crisis, `consequence-${index}-${consequence}`);
  }
  if (text.includes("media") || text.includes("viral") || text.includes("trend") || text.includes("algorithm")) {
    return selectImageFromCollection(imageCollections.media, `consequence-${index}-${consequence}`);
  }
  
  return selectImageFromCollection(imageCollections.social, `consequence-${index}-${consequence}`);
}

function MetricBar({ label, value, accent, delta, preview }: { label: string; value: number; accent?: boolean; delta?: number; preview?: number }) {
  const displayValue = preview !== undefined ? preview : value;
  const showDelta = delta !== undefined && delta !== 0;
  const previewActive = preview !== undefined;
  
  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wide text-zinc-500">
        <span className="font-semibold">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`transition-all duration-300 ${previewActive ? "text-accent font-bold" : ""}`}>
            {Math.round(displayValue)}
          </span>
          {showDelta && (
            <span className={`text-xs font-bold ${delta! > 0 ? "text-green-500" : "text-red-500"} animate-pulse`}>
              {delta! > 0 ? "+" : ""}{delta}
            </span>
          )}
        </div>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-zinc-700">
        <div 
          className={`h-full transition-all duration-500 ease-out ${accent ? "bg-accent" : "bg-zinc-400"} ${previewActive ? "animate-pulse" : ""}`}
          style={{ width: `${Math.max(0, Math.min(100, displayValue))}%` }}
        />
        {previewActive && preview !== value && (
          <div 
            className="absolute top-0 h-full bg-white/30 transition-all duration-300"
            style={{ 
              left: `${Math.min(value, preview!)}%`,
              width: `${Math.abs(preview! - value)}%`
            }}
          />
        )}
      </div>
    </div>
  );
}

function Simulator() {
  const { mode: themeMode } = useTheme();
  const [mode, setMode] = useState<Mode>("creation");
  const [userId, setUserId] = useState("demo-user");

  // Creation mode state
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [activeGameId, setActiveGameId] = useState("");
  const [currentNode, setCurrentNode] = useState<DecisionNode | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [completedGameResult, setCompletedGameResult] = useState<MakeChoiceResponse | null>(null);
  const [choiceHistory, setChoiceHistory] = useState<string[]>([]);
  const [hoveredOptionId, setHoveredOptionId] = useState<string | null>(null);
  const [previewMetrics, setPreviewMetrics] = useState<{ engagement: number; virality: number; outrage: number; credibility: number } | null>(null);
  const [choiceFeedback, setChoiceFeedback] = useState<string | null>(null);
  const [showScoreReveal, setShowScoreReveal] = useState(false);

  // Detection mode state
  const [challenges, setChallenges] = useState<DetectionChallenge[]>([]);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedTactics, setSelectedTactics] = useState<string[]>([]);
  const [detectionStartAt, setDetectionStartAt] = useState<number | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionSubmissionResult | null>(null);

  // Shared state
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? null,
    [scenarios, selectedScenarioId]
  );

  const currentChallenge = challenges[challengeIndex] ?? null;

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      setIsBusy(true);
      setErrorMessage("");

      try {
        const [scenarioData, challengeData] = await Promise.all([
          simulatorApi.getScenarios(),
          simulatorApi.getDetectionChallenges()
        ]);

        if (!mounted) return;

        setScenarios(scenarioData);
        setSelectedScenarioId((current) => current || scenarioData[0]?.id || "");
        setChallenges(challengeData);
      } catch {
        if (mounted) setErrorMessage("Unable to load simulator data.");
      } finally {
        if (mounted) setIsBusy(false);
      }
    }

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, [userId]);

  useEffect(() => {
    if (mode === "detection") {
      setDetectionStartAt(Date.now());
      setSelectedTactics([]);
      setDetectionResult(null);
    }
  }, [mode, challengeIndex]);

  async function startGame() {
    if (!selectedScenarioId) {
      setErrorMessage("Select a scenario to start.");
      return;
    }

    setErrorMessage("");
    setIsBusy(true);

    try {
      const gameResponse = await simulatorApi.startGame({ userId, scenarioId: selectedScenarioId });
      setActiveGameId(gameResponse.id);
      setChoiceHistory([]);
      setGameState({
        id: gameResponse.id,
        scenarioId: gameResponse.scenarioId,
        userId: gameResponse.userId,
        status: "in_progress",
        currentNodeId: gameResponse.currentNodeId ?? "stage-1-tone",
        accumulatedMetrics: gameResponse.accumulatedMetrics ?? {
          engagement: 20,
          virality: 15,
          outrage: 10,
          credibility: 50
        },
        choicesPath: gameResponse.choicesPath ?? []
      });
      setCurrentNode(gameResponse.currentNode ?? null);
    } catch {
      setErrorMessage("Failed to start game. Please try again.");
    } finally {
      setIsBusy(false);
    }
  }

  async function makeChoice(optionId: string) {
    if (!activeGameId) return;

    setErrorMessage("");
    setIsBusy(true);
    
    // Show choice feedback animation
    const selectedOption = currentNode?.options.find(opt => opt.id === optionId);
    if (selectedOption) {
      setChoiceFeedback(`Choice selected: ${selectedOption.text}`);
      setTimeout(() => setChoiceFeedback(null), 2000);
    }

    try {
      const result = await simulatorApi.makeChoice(activeGameId, { optionId }, choiceHistory, gameState?.scenarioId || selectedScenarioId);
      setChoiceHistory([...choiceHistory, optionId]);
      
      // Clear preview state
      setHoveredOptionId(null);
      setPreviewMetrics(null);

      if (result.isGameComplete && result.generatedNews) {
        setCompletedGameResult(result);
        setShowScoreReveal(false);
        setTimeout(() => setShowScoreReveal(true), 500);
        setGameState((prev) =>
          prev
            ? {
                ...prev,
                status: "completed",
                choicesPath: result.choicesPath,
                accumulatedMetrics: result.accumulatedMetrics,
                finalResult: result.generatedNews
                  ? {
                      score: result.generatedNews.score,
                      tactics: result.generatedNews.tactics,
                      consequences: result.generatedNews.consequences,
                      generatedNews: result.generatedNews.body
                    }
                  : undefined
              }
            : null
        );
      } else {
        // Continue to next stage
        setGameState((prev) =>
          prev
            ? {
                ...prev,
                currentNodeId: result.currentNodeId,
                choicesPath: result.choicesPath,
                accumulatedMetrics: result.accumulatedMetrics
              }
            : null
        );
        setCurrentNode(result.currentNode ?? null);
      }
    } catch {
      setErrorMessage("Failed to make choice. Please try again.");
    } finally {
      setIsBusy(false);
    }
  }

  function handleOptionHover(optionId: string | null) {
    if (!gameState || !currentNode) {
      setHoveredOptionId(null);
      setPreviewMetrics(null);
      return;
    }
    
    setHoveredOptionId(optionId);
    
    if (optionId) {
      const option = currentNode.options.find(opt => opt.id === optionId);
      if (option?.metrics) {
        const currentMetrics = gameState.accumulatedMetrics;
        setPreviewMetrics({
          engagement: Math.max(0, Math.min(100, currentMetrics.engagement + option.metrics.engagementDelta)),
          virality: Math.max(0, Math.min(100, currentMetrics.virality + option.metrics.viralityDelta)),
          outrage: Math.max(0, Math.min(100, currentMetrics.outrage + option.metrics.outrageDelta)),
          credibility: Math.max(0, Math.min(100, currentMetrics.credibility + option.metrics.credibilityDelta))
        });
      }
    } else {
      setPreviewMetrics(null);
    }
  }

  function toggleTactic(tactic: string) {
    setSelectedTactics((current) => (current.includes(tactic) ? current.filter((item) => item !== tactic) : [...current, tactic]));
  }

  async function submitDetection() {
    if (!currentChallenge) {
      setErrorMessage("No detection challenge available.");
      return;
    }

    setErrorMessage("");
    setIsBusy(true);

    try {
      const elapsedSeconds = detectionStartAt ? Math.round((Date.now() - detectionStartAt) / 1000) : undefined;
      const result = await simulatorApi.submitDetectionAttempt({
        userId,
        challengeId: currentChallenge.id,
        selectedTactics,
        timeSpentSeconds: elapsedSeconds
      });
      setDetectionResult(result);
    } catch {
      setErrorMessage("Detection submission failed.");
    } finally {
      setIsBusy(false);
    }
  }

  function nextChallenge() {
    if (!challenges.length) return;
    setChallengeIndex((index) => (index + 1) % challenges.length);
  }

  function resetGame() {
    setActiveGameId("");
    setCurrentNode(null);
    setGameState(null);
    setCompletedGameResult(null);
    setChoiceHistory([]);
    setHoveredOptionId(null);
    setPreviewMetrics(null);
    setChoiceFeedback(null);
    setShowScoreReveal(false);
    setErrorMessage("");
  }

  return (
    <section className="w-full p-6">
      <div>
        <h1 className="text-2xl font-semibold">Misinformation Simulator</h1>
        <p className={themeMode === "dark" ? "mt-2 text-sm text-zinc-400" : "mt-2 text-sm text-zinc-600"}>
          Navigate a branching narrative: see how each choice compounds psychological tactics and spreads misinformation.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMode("creation")}
            className={mode === "creation" ? "rounded-md bg-accent px-3 py-2 text-sm font-medium text-white" : "rounded-md bg-zinc-200 px-3 py-2 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"}
          >
            Creation Mode
          </button>
          <button
            onClick={() => setMode("detection")}
            className={mode === "detection" ? "rounded-md bg-accent px-3 py-2 text-sm font-medium text-white" : "rounded-md bg-zinc-200 px-3 py-2 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"}
          >
            Detection Mode
          </button>
        </div>

        <div className={themeMode === "dark" ? "mt-6 rounded-lg bg-surface p-5" : "mt-6 rounded-lg bg-zinc-100 p-5"}>
          <label className="text-xs uppercase tracking-wide text-zinc-500">User ID</label>
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-400 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Enter user ID"
          />
        </div>

        {mode === "creation" && (
          <div className={themeMode === "dark" ? "mt-6 rounded-lg bg-surface p-5" : "mt-6 rounded-lg bg-zinc-100 p-5"}>
            <h2 className="text-lg font-semibold">Create the Narrative</h2>
            <p className={themeMode === "dark" ? "mt-1 text-sm text-zinc-400" : "mt-1 text-sm text-zinc-600"}>
              Make strategic choices that shape your misinformation campaign. See how tactics compound.
            </p>

            {!activeGameId ? (
              <>
                <div className="mt-4">
                  <label className="text-sm">
                    <span className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Scenario</span>
                    <select
                      value={selectedScenarioId}
                      onChange={(event) => setSelectedScenarioId(event.target.value)}
                      className="w-full rounded-md border border-zinc-400 bg-transparent px-3 py-2 outline-none focus:border-accent"
                    >
                      {scenarios.map((scenario) => (
                        <option key={scenario.id} value={scenario.id} className="text-black">
                          {scenario.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {selectedScenario && (
                  <>
                    <img
                      src={getScenarioBannerImage(selectedScenario.id, selectedScenario.title)}
                      alt={`${selectedScenario.title} visual`}
                      className="mt-4 h-44 w-full rounded-md object-cover"
                      loading="lazy"
                    />
                    <p className={themeMode === "dark" ? "mt-4 text-sm text-zinc-400" : "mt-4 text-sm text-zinc-600"}>{selectedScenario.description}</p>
                  </>
                )}

                <button onClick={() => void startGame()} disabled={isBusy} className="mt-5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                  Start Game
                </button>
              </>
            ) : gameState?.status === "completed" && completedGameResult?.generatedNews ? (
              <>
                {/* Game Complete Banner */}
                <div className={`mt-4 rounded-lg p-6 text-center border-2 ${themeMode === "dark" ? "bg-accent/10 border-accent" : "bg-accent/5 border-accent"}`}>
                  <div className="flex justify-center mb-2">
                    <Target className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className={`text-2xl font-bold ${themeMode === "dark" ? "text-white" : "text-zinc-900"}`}>Campaign Complete!</h2>
                  <p className={`mt-2 text-sm ${themeMode === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>See the impact of your choices</p>
                </div>

                <div className={`mt-4 rounded-md border p-4 transition-all duration-500 ${themeMode === "dark" ? "border-zinc-700 bg-surface" : "border-zinc-300 bg-white"} ${showScoreReveal ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                  <h3 className="text-base font-semibold">{completedGameResult.generatedNews.title}</h3>
                  <img
                    src={getResultImage(gameState?.scenarioId, completedGameResult.generatedNews.title, completedGameResult.generatedNews.body)}
                    alt="Simulation result visual"
                    className="mt-3 h-48 w-full rounded-md object-cover"
                    loading="lazy"
                  />

                  {/* Animated Score Display */}
                  <div className="mt-4 flex items-center justify-center">
                    <div className={`rounded-full px-6 py-3 text-center border-2 ${themeMode === "dark" ? "bg-accent/20 border-accent" : "bg-accent/10 border-accent"}`}>
                      <p className={`text-xs uppercase tracking-wide ${themeMode === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>Educational Score</p>
                      <p className={`text-3xl font-bold transition-all duration-1000 ${themeMode === "dark" ? "text-accent" : "text-accent"} ${showScoreReveal ? "scale-100" : "scale-0"}`}>
                        {completedGameResult.generatedNews.score}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <MetricBar label="Engagement" value={gameState.accumulatedMetrics.engagement} accent />
                    <MetricBar label="Virality" value={gameState.accumulatedMetrics.virality} accent />
                    <MetricBar label="Outrage" value={gameState.accumulatedMetrics.outrage} accent />
                    <MetricBar label="Credibility" value={gameState.accumulatedMetrics.credibility} />
                  </div>

                  <p className={themeMode === "dark" ? "mt-4 text-sm leading-relaxed text-zinc-300" : "mt-4 text-sm leading-relaxed text-zinc-700"}>{completedGameResult.generatedNews.body}</p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center gap-1">
                        <Palette className="w-3 h-3 text-purple-500" />
                        <p className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Tactics Used</p>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {completedGameResult.generatedNews.tactics.map((tactic, idx) => (
                          <li key={tactic} className={`text-sm px-2 py-1 rounded bg-accent/10 transition-all duration-300 delay-${idx * 100}`}>
                            {tactic.replace(/_/g, " ").toUpperCase()}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        <p className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Real-World Consequences</p>
                      </div>
                      <div className="mt-2 space-y-2">
                        {completedGameResult.generatedNews.consequences.map((item, index) => (
                          <div key={item} className={`rounded-md border p-2 transition-all duration-300 hover:scale-105 ${themeMode === "dark" ? "border-zinc-700 hover:border-accent" : "border-zinc-300 hover:border-accent"}`}>
                            <img
                              src={getConsequenceImage(item, index, gameState?.scenarioId)}
                              alt={`Consequence ${index + 1}`}
                              className="h-24 w-full rounded object-cover"
                              loading="lazy"
                            />
                            <p className="mt-2 text-sm">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={resetGame} className="mt-5 w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-accent/90 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Play Another Scenario
                </button>
              </>
            ) : currentNode ? (
              <>
                {/* Progress Tracker */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        step <= choiceHistory.length + 1
                          ? "bg-accent text-white scale-110"
                          : "bg-zinc-700 text-zinc-400"
                      }`}>
                        {step <= choiceHistory.length ? <Check className="w-4 h-4" /> : step}
                      </div>
                      {step < 4 && <div className={`h-1 w-8 transition-all ${
                        step <= choiceHistory.length ? "bg-accent" : "bg-zinc-700"
                      }`} />}
                    </div>
                  ))}
                </div>

                {/* Choice Feedback */}
                {choiceFeedback && (
                  <div className="mt-4 rounded-md bg-accent/20 border-2 border-accent px-4 py-3 text-center animate-pulse">
                    <p className="text-sm font-semibold">{choiceFeedback}</p>
                  </div>
                )}

                <div className={themeMode === "dark" ? "mt-4 rounded-md border border-zinc-700 p-4" : "mt-4 rounded-md border border-zinc-300 p-4"}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{currentNode.prompt}</h3>
                      {currentNode.description && <p className={themeMode === "dark" ? "mt-2 text-sm text-zinc-400" : "mt-2 text-sm text-zinc-600"}>{currentNode.description}</p>}
                    </div>
                    <Gamepad2 className="w-6 h-6 text-accent" />
                  </div>
                  <img
                    src={getStageImage(gameState?.scenarioId || selectedScenarioId, currentNode.id, currentNode.prompt, currentNode.description)}
                    alt="Current stage visual"
                    className="mt-3 h-40 w-full rounded-md object-cover"
                    loading="lazy"
                  />

                  {/* Interactive Metrics with Preview */}
                  <div className="mt-4 rounded-md bg-zinc-800/50 p-3">
                    <div className="flex items-center gap-1 mb-2">
                      <BarChart3 className="w-3 h-3 text-zinc-400" />
                      <p className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Campaign Metrics {hoveredOptionId && "(Preview)"}</p>
                    </div>
                    <div className="space-y-3">
                      <MetricBar 
                        label="Engagement" 
                        value={gameState?.accumulatedMetrics.engagement ?? 20} 
                        preview={previewMetrics?.engagement}
                        delta={previewMetrics ? (previewMetrics.engagement - (gameState?.accumulatedMetrics.engagement ?? 20)) : undefined}
                        accent 
                      />
                      <MetricBar 
                        label="Virality" 
                        value={gameState?.accumulatedMetrics.virality ?? 15} 
                        preview={previewMetrics?.virality}
                        delta={previewMetrics ? (previewMetrics.virality - (gameState?.accumulatedMetrics.virality ?? 15)) : undefined}
                        accent 
                      />
                      <MetricBar 
                        label="Outrage" 
                        value={gameState?.accumulatedMetrics.outrage ?? 10} 
                        preview={previewMetrics?.outrage}
                        delta={previewMetrics ? (previewMetrics.outrage - (gameState?.accumulatedMetrics.outrage ?? 10)) : undefined}
                        accent 
                      />
                      <MetricBar 
                        label="Credibility" 
                        value={gameState?.accumulatedMetrics.credibility ?? 50} 
                        preview={previewMetrics?.credibility}
                        delta={previewMetrics ? (previewMetrics.credibility - (gameState?.accumulatedMetrics.credibility ?? 50)) : undefined}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-4">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <p className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Choose Your Strategy (Hover to Preview Impact)</p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {currentNode.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => void makeChoice(option.id)}
                        onMouseEnter={() => handleOptionHover(option.id)}
                        onMouseLeave={() => handleOptionHover(null)}
                        disabled={isBusy}
                        className={`block w-full rounded-lg border-2 px-4 py-3 text-left transition-all duration-200 disabled:opacity-60 ${
                          hoveredOptionId === option.id
                            ? "border-accent bg-accent/10 scale-105 shadow-lg"
                            : themeMode === "dark"
                            ? "border-zinc-700 hover:border-accent hover:bg-zinc-800"
                            : "border-zinc-300 hover:border-accent hover:bg-zinc-50"
                        }`}
                      >
                        <p className="font-semibold text-base">{option.text}</p>
                        {option.description && <p className={themeMode === "dark" ? "mt-1 text-xs text-zinc-400" : "mt-1 text-xs text-zinc-600"}>{option.description}</p>}
                        {option.metrics && hoveredOptionId === option.id && (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            {option.metrics.engagementDelta !== 0 && (
                              <span className={`px-2 py-1 rounded ${option.metrics.engagementDelta > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                Engagement {option.metrics.engagementDelta > 0 ? "+" : ""}{option.metrics.engagementDelta}
                              </span>
                            )}
                            {option.metrics.viralityDelta !== 0 && (
                              <span className={`px-2 py-1 rounded ${option.metrics.viralityDelta > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                Virality {option.metrics.viralityDelta > 0 ? "+" : ""}{option.metrics.viralityDelta}
                              </span>
                            )}
                            {option.metrics.outrageDelta !== 0 && (
                              <span className={`px-2 py-1 rounded ${option.metrics.outrageDelta > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                Outrage {option.metrics.outrageDelta > 0 ? "+" : ""}{option.metrics.outrageDelta}
                              </span>
                            )}
                            {option.metrics.credibilityDelta !== 0 && (
                              <span className={`px-2 py-1 rounded ${option.metrics.credibilityDelta > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                Credibility {option.metrics.credibilityDelta > 0 ? "+" : ""}{option.metrics.credibilityDelta}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <p className={themeMode === "dark" ? "text-zinc-500" : "text-zinc-600"}>Stage {choiceHistory.length + 1} of 4</p>
                  <p className={`font-semibold ${themeMode === "dark" ? "text-accent" : "text-accent"}`}>Choices made: {choiceHistory.length}</p>
                </div>
              </>
            ) : null}

            {errorMessage && <p className="mt-4 text-sm text-red-500">{errorMessage}</p>}
          </div>
        )}

        {mode === "detection" && (
          <div className={themeMode === "dark" ? "mt-6 rounded-lg bg-surface p-5" : "mt-6 rounded-lg bg-zinc-100 p-5"}>
            <h2 className="text-lg font-semibold">Spot the Tactics</h2>
            <p className={themeMode === "dark" ? "mt-1 text-sm text-zinc-400" : "mt-1 text-sm text-zinc-600"}>
              Identify manipulation tactics in suspicious content to sharpen your detection skills.
            </p>

            {currentChallenge ? (
              <>
                <div className={themeMode === "dark" ? "mt-4 rounded-md border border-zinc-700 p-4" : "mt-4 rounded-md border border-zinc-300 p-4"}>
                  <p className="text-sm font-medium">{currentChallenge.title}</p>
                  <p className={themeMode === "dark" ? "mt-2 text-sm text-zinc-300" : "mt-2 text-sm text-zinc-700"}>{currentChallenge.content}</p>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {tacticOptions.map((tactic) => (
                    <label key={tactic} className="flex items-center gap-2 rounded-md border border-zinc-400 px-3 py-2 text-sm">
                      <input type="checkbox" checked={selectedTactics.includes(tactic)} onChange={() => toggleTactic(tactic)} />
                      <span>{tactic}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => void submitDetection()} disabled={isBusy} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                    Submit Detection
                  </button>
                  <button onClick={nextChallenge} className="rounded-md border border-zinc-500 px-4 py-2 text-sm">
                    Next Challenge
                  </button>
                </div>

                {detectionResult && (
                  <div className={themeMode === "dark" ? "mt-6 rounded-md border border-zinc-700 p-4" : "mt-6 rounded-md border border-zinc-300 p-4"}>
                    <p className="text-sm font-medium">Accuracy: {detectionResult.accuracy}%</p>
                    <p className="mt-1 text-sm">Points: {detectionResult.points}</p>
                    {detectionResult.feedback && <p className={themeMode === "dark" ? "mt-2 text-sm text-zinc-400" : "mt-2 text-sm text-zinc-600"}>{detectionResult.feedback}</p>}
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-500">Correct</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                          {detectionResult.correctTactics.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-500">Missed</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                          {detectionResult.missedTactics.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-500">False Positives</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                          {detectionResult.falsePositives.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className={themeMode === "dark" ? "mt-4 text-sm text-zinc-400" : "mt-4 text-sm text-zinc-600"}>No detection challenges found.</p>
            )}

            {errorMessage && <p className="mt-4 text-sm text-red-500">{errorMessage}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

export default Simulator;
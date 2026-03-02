import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { newsApi } from "../api/newsApi";
import HOTSSection from "../components/HOTSSection";
import LiquidEther from "../components/LiquidEther.jsx";
import RotatingText from "../components/RotatingText";
import SearchBar from "../components/SearchBar";
import SpotlightCards from "../components/SpotlightCards";
import { useTheme } from "../components/ThemeContext";
import type { TopicSummary } from "../types/news";
import GetMessage from "../components/GetMessage";


function Home() {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const [hotTopics, setHotTopics] = useState<TopicSummary[]>([]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      const hotResponse = await newsApi.getHighImpactTopics();

      if (active) {
        setHotTopics(hotResponse);
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="pb-8">
      <GetMessage />
      <section
        className={
          mode === "dark"
            ? "relative left-1/2 right-1/2 -mx-[50vw] min-h-[68vh] w-screen overflow-hidden bg-surface py-16 text-center"
            : "relative left-1/2 right-1/2 -mx-[50vw] min-h-[68vh] w-screen overflow-hidden bg-zinc-50 py-16 text-center shadow-inner"
        }
      >
        <div className={mode === "dark" ? "pointer-events-none absolute inset-0 opacity-65 blur-[0.2px]" : "pointer-events-none absolute inset-0 opacity-80 blur-[0.2px]"}>
          <div className="absolute inset-0 h-full w-full">
            <LiquidEther
              mouseForce={13}
              cursorSize={140}
              isViscous={false}
              viscous={30}
              colors={mode === "dark" ? ["#8B0000", "#B22222", "#4A0B0B"] : ["#5227FF", "#FF9FFC", "#B19EEF"]}
              autoDemo
              autoSpeed={0.5}
              autoIntensity={2.2}
              isBounce={false}
              resolution={0.5}
            />
          </div>
        </div>
        {mode === "dark" ? (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,0,0,0.35),transparent_45%),linear-gradient(180deg,rgba(10,10,10,0.78)_0%,rgba(6,6,6,0.9)_100%)]" />
        ) : (
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(244,244,245,0.7)_100%)]" />
        )}
        <div className="relative z-10 mx-auto max-w-4xl px-4 pt-12 sm:pt-16">
          <h1
            className={
              mode === "dark"
                ? "flex items-center justify-center gap-2 whitespace-nowrap text-2xl font-semibold text-white sm:text-4xl"
                : "flex items-center justify-center gap-2 whitespace-nowrap text-2xl font-semibold text-black sm:text-4xl"
            }
          >
            <span>AI-Powered Neutral</span>
            <RotatingText
              texts={["News Analyzer", "News Identifier", "Friend"]}
              mainClassName="inline-flex h-8 min-w-[170px] items-center justify-center rounded-md bg-accent px-2 text-sm text-white sm:h-9 sm:min-w-[190px] sm:text-base"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={3500}
            />
          </h1>
          <p className={mode === "dark" ? "mt-4 text-sm text-zinc-300 sm:text-base" : "mt-4 text-sm text-zinc-700 sm:text-base"}>
            Search any topic to view source-level comparisons, factual density, confidence score, and editorial risk signals.
          </p>
          <SearchBar className="mt-8" onSearch={(topic) => navigate(`/result/${topic}`)} />
        </div>
      </section>

      <HOTSSection topics={hotTopics} />
      <SpotlightCards />

      <footer className={mode === "dark" ? "mt-12 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-500" : "mt-12 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-600"}>
        Truth Lens | Neutrality-focused analysis skeleton | Mock data mode
      </footer>
    </div>

    
  );
}

export default Home;

import { useNavigate } from "react-router-dom";
import type { TopicSummary } from "../types/news";
import { useTheme } from "./ThemeContext";

interface TrendingSectionProps {
  topics: TopicSummary[];
}

function TrendingSection({ topics }: TrendingSectionProps) {
  const navigate = useNavigate();
  const { mode } = useTheme();

  return (
    <section className={mode === "dark" ? "mt-10 rounded-md bg-surface p-5" : "mt-10 rounded-md bg-zinc-100 p-5"}>
      <h2 className="text-xl font-semibold">Trending Topics</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <article key={topic.slug} className={mode === "dark" ? "overflow-hidden rounded-xl bg-zinc-900" : "overflow-hidden rounded-xl bg-white"}>
            <img src={topic.image} alt={topic.title} className="h-40 w-full object-cover" loading="lazy" />
            <div className="p-4">
              <p className={mode === "dark" ? "text-sm font-semibold text-white" : "text-sm font-semibold text-black"}>{topic.title}</p>
              <p className={mode === "dark" ? "mt-1 text-xs text-zinc-400" : "mt-1 text-xs text-zinc-600"}>{topic.summary}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className={mode === "dark" ? "text-xs text-zinc-500" : "text-xs text-zinc-500"}>Trend Score: {topic.trendScore}</span>
                <button
                  onClick={() => navigate(`/result/${topic.slug}`)}
                  className={mode === "dark" ? "rounded-md bg-zinc-800 px-3 py-1 text-xs text-zinc-200 hover:bg-zinc-700" : "rounded-md bg-zinc-100 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-200"}
                >
                  View
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TrendingSection;

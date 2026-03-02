import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { newsApi } from "../api/newsApi";
import { useTheme } from "../components/ThemeContext";
import type { TopicSummary } from "../types/news";

function Trending() {
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const navigate = useNavigate();
  const { mode } = useTheme();

  useEffect(() => {
    let active = true;

    async function loadTrending() {
      const response = await newsApi.getTrendingTopics();
      if (active) setTopics(response);
    }

    void loadTrending();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">Trending News</h1>
      <p className={mode === "dark" ? "mt-2 text-sm text-zinc-400" : "mt-2 text-sm text-zinc-600"}>
        Most discussed topics in the current analysis window.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {topics.map((topic) => (
          <article key={topic.slug} className={mode === "dark" ? "overflow-hidden rounded-xl bg-surface" : "overflow-hidden rounded-xl bg-zinc-100"}>
            <img src={topic.image} alt={topic.title} className="h-44 w-full object-cover" loading="lazy" />
            <div className="p-4">
              <p className={mode === "dark" ? "font-medium text-white" : "font-medium text-black"}>{topic.title}</p>
              <p className={mode === "dark" ? "mt-1 text-sm text-zinc-400" : "mt-1 text-sm text-zinc-600"}>{topic.summary}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className={mode === "dark" ? "text-xs text-zinc-500" : "text-xs text-zinc-500"}>
                  Trend Score: {topic.trendScore}
                </span>
                <button
                  onClick={() => navigate(`/result/${topic.slug}`)}
                  className={mode === "dark" ? "rounded-md bg-zinc-800 px-3 py-1 text-xs text-zinc-200 hover:bg-zinc-700" : "rounded-md bg-white px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-200"}
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

export default Trending;

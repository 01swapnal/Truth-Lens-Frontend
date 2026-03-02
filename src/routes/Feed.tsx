import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { newsApi } from "../api/newsApi";
import { useTheme } from "../components/ThemeContext";
import type { TopicSummary } from "../types/news";

function Feed() {
  const [items, setItems] = useState<TopicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { mode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function loadFeed() {
      setLoading(true);
      const response = await newsApi.getTrendingTopics();
      if (!active) return;
      setItems(response);
      setLoading(false);
    }

    void loadFeed();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-sm text-zinc-400">Loading feed...</div>;
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Feed</h1>
        <p className={mode === "dark" ? "mt-2 text-sm text-zinc-400" : "mt-2 text-sm text-zinc-600"}>
          Verified by Truth Lens. Scroll vertically like reels.
        </p>
      </div>

      <div className="h-[78vh] snap-y snap-mandatory space-y-4 overflow-y-auto pr-1">
        {items.map((news) => (
          <article
            key={news.slug}
            className={mode === "dark" ? "group relative min-h-[74vh] snap-start overflow-hidden rounded-2xl border border-zinc-800 bg-black" : "group relative min-h-[74vh] snap-start overflow-hidden rounded-2xl border border-zinc-200 bg-white"}
          >
            <img src={news.image} alt={news.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className={mode === "dark" ? "absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" : "absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20"} />

            <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-medium text-white">
                <ShieldCheck size={14} />
                Verified by Truth Lens
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">{news.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-200">{news.summary}</p>

                <div className="mt-4 flex items-center gap-3">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs text-white">
                    Impact {news.impactScore}
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs text-white">
                    Trend {news.trendScore}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/result/${news.slug}`)}
                  className="mt-5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-red-900"
                >
                  Open Analysis
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Feed;

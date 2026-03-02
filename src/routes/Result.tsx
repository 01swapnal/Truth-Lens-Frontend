import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnalyticsPanel from "../components/AnalyticsPanel";
import ArticleView from "../components/ArticleView";
import FactCheckModal from "../components/FactCheckModal";
import SourceComparison from "../components/SourceComparison";
import { newsApi } from "../api/newsApi";
import type { NewsArticle } from "../types/news";

function Result() {
  const { topic = "" } = useParams();
  const [isFactCheckOpen, setFactCheckOpen] = useState(false);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadArticle() {
      setLoading(true);
      const response = await newsApi.getArticleByTopic(topic);
      if (active) {
        setArticle(response);
        setLoading(false);
      }
    }

    void loadArticle();

    return () => {
      active = false;
    };
  }, [topic]);

  if (loading || !article) {
    return <div className="py-20 text-center text-sm text-zinc-400">Loading analysis...</div>;
  }

  return (
    <div className="pb-14">
      <div className="grid gap-6 lg:grid-cols-10">
        <div className="lg:col-span-7">
          <ArticleView article={article} />
        </div>
        <div className="lg:col-span-3">
          <AnalyticsPanel analysis={article.analysis} />
        </div>
      </div>

      <SourceComparison sources={article.sourceComparison} />

      <button
        onClick={() => setFactCheckOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-semibold text-white shadow-lg hover:bg-red-900"
        aria-label="Open fact check"
      >
        FC
      </button>

      <FactCheckModal open={isFactCheckOpen} onClose={() => setFactCheckOpen(false)} onCheck={newsApi.checkFact} />
    </div>
  );
}

export default Result;

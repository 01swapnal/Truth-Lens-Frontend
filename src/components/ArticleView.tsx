import type { NewsArticle } from "../types/news";
import ConfidenceBadge from "./ConfidenceBadge";
import { useTheme } from "./ThemeContext";

interface ArticleViewProps {
  article: NewsArticle;
}

function ArticleView({ article }: ArticleViewProps) {
  const { analysis } = article;
  const { mode } = useTheme();

  return (
    <section className={mode === "dark" ? "rounded-md bg-surface p-6" : "rounded-md bg-zinc-100 p-6"}>
      <h1 className={mode === "dark" ? "text-2xl font-semibold text-white" : "text-2xl font-semibold text-black"}>{article.title}</h1>
      <div className={mode === "dark" ? "mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-300" : "mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-700"}>
        <span>Last updated: {new Date(analysis.lastUpdated).toLocaleString()}</span>
        <span>Sources analyzed: {analysis.sourcesAnalyzed}</span>
        <ConfidenceBadge level={analysis.confidence} score={analysis.confidenceScore} />
      </div>

      <article className={mode === "dark" ? "mt-6 space-y-3 text-sm leading-7 text-zinc-200" : "mt-6 space-y-3 text-sm leading-7 text-zinc-800"}>
        {article.body.map((segment, index) => {
          const baseClass = "rounded px-2 py-1";
          const statusClass =
            segment.status === "verified"
              ? "bg-verified text-black"
              : segment.status === "disputed"
                ? "bg-disputed text-black"
                : mode === "dark"
                  ? "text-zinc-200"
                  : "text-zinc-800";

          return (
            <p key={`${segment.text.slice(0, 16)}-${index}`} className={`${baseClass} ${statusClass}`}>
              {segment.text}
            </p>
          );
        })}
      </article>
    </section>
  );
}

export default ArticleView;

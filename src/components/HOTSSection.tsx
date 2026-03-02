import { useNavigate } from "react-router-dom";
import type { TopicSummary } from "../types/news";
import ChromaGrid from "./ChromaGrid";
import { useTheme } from "./ThemeContext";

interface HOTSSectionProps {
  topics: TopicSummary[];
}

function HOTSSection({ topics }: HOTSSectionProps) {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const chromaItems = topics.slice(0, 3).map((topic, index) => ({
    image: topic.image,
    title: topic.title,
    subtitle: topic.summary,
    handle: `Impact ${topic.impactScore} | Trend ${topic.trendScore}`,
    borderColor: index === 0 ? "#8B0000" : index === 1 ? "#5227FF" : "#10B981",
    gradient:
      index === 0
        ? "linear-gradient(145deg, #8B0000, #000)"
        : index === 1
          ? "linear-gradient(160deg, #5227FF, #000)"
          : "linear-gradient(190deg, #10B981, #000)",
    url: `/result/${topic.slug}`
  }));

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-semibold">High Impact Topics</h2>
      <div className={mode === "dark" ? "relative h-[660px] rounded-xl bg-surface" : "relative h-[660px] rounded-xl bg-zinc-100"}>
        <ChromaGrid
          items={chromaItems}
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
          onItemClick={(item) => {
            if (item.url) navigate(item.url);
          }}
        />
      </div>
    </section>
  );
}

export default HOTSSection;

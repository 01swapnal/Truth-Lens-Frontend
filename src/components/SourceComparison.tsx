import type { ArticleSource } from "../types/news";
import { useTheme } from "./ThemeContext";

interface SourceComparisonProps {
  sources: ArticleSource[];
}

function SourceComparison({ sources }: SourceComparisonProps) {
  const { mode } = useTheme();

  return (
    <section className={mode === "dark" ? "mt-6 rounded-md bg-surface p-5" : "mt-6 rounded-md bg-zinc-100 p-5"}>
      <h2 className="text-lg font-semibold">Source Comparison</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[580px] border-collapse text-sm">
          <thead>
            <tr className={mode === "dark" ? "border-b border-zinc-800 text-left text-zinc-400" : "border-b border-zinc-300 text-left text-zinc-600"}>
              <th className="py-2">Source</th>
              <th className="py-2">Political Lean</th>
              <th className="py-2">Reliability</th>
              <th className="py-2">Coverage Stance</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((item) => (
              <tr key={item.source} className={mode === "dark" ? "border-b border-zinc-800 last:border-b-0" : "border-b border-zinc-300 last:border-b-0"}>
                <td className={mode === "dark" ? "py-3 text-zinc-100" : "py-3 text-zinc-900"}>{item.source}</td>
                <td className={mode === "dark" ? "py-3 text-zinc-300" : "py-3 text-zinc-700"}>{item.politicalLean}</td>
                <td className={mode === "dark" ? "py-3 text-zinc-300" : "py-3 text-zinc-700"}>{item.reliability}%</td>
                <td className={mode === "dark" ? "py-3 text-zinc-300" : "py-3 text-zinc-700"}>{item.stance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default SourceComparison;

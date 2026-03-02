import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ArticleAnalysis } from "../types/news";
import { useTheme } from "./ThemeContext";

interface AnalyticsPanelProps {
  analysis: ArticleAnalysis;
}

function AnalyticsPanel({ analysis }: AnalyticsPanelProps) {
  const { mode } = useTheme();
  const lean = analysis.politicalLean;
  const leanPercent = Math.round(((lean + 100) / 200) * 100);

  const factDensityData = [
    { name: "Factual", value: analysis.factDensity.factual, color: "#DCFCE7" },
    { name: "Context", value: analysis.factDensity.contextual, color: "#FEF9C3" },
    { name: "Opinion", value: analysis.factDensity.opinion, color: "#8B0000" }
  ];

  return (
    <aside className="space-y-4">
      <div className={mode === "dark" ? "rounded-md bg-surface p-5" : "rounded-md bg-zinc-100 p-5"}>
        <h3 className={mode === "dark" ? "text-sm font-semibold text-zinc-100" : "text-sm font-semibold text-zinc-900"}>Political Lean</h3>
        <progress className="tl-progress tl-progress-accent mt-3" max={100} value={leanPercent} />
        <p className={mode === "dark" ? "mt-2 text-xs text-zinc-400" : "mt-2 text-xs text-zinc-600"}>Left -100 to Right +100: {lean}</p>
      </div>

      <div className={mode === "dark" ? "rounded-md bg-surface p-5" : "rounded-md bg-zinc-100 p-5"}>
        <h3 className={mode === "dark" ? "text-sm font-semibold text-zinc-100" : "text-sm font-semibold text-zinc-900"}>Emotional Tone</h3>
        <progress className="tl-progress tl-progress-neutral mt-3" max={100} value={analysis.emotionalTone} />
        <p className={mode === "dark" ? "mt-2 text-xs text-zinc-400" : "mt-2 text-xs text-zinc-600"}>Lower values indicate neutral framing.</p>
      </div>

      <div className={mode === "dark" ? "rounded-md bg-surface p-5" : "rounded-md bg-zinc-100 p-5"}>
        <h3 className={mode === "dark" ? "mb-2 text-sm font-semibold text-zinc-100" : "mb-2 text-sm font-semibold text-zinc-900"}>Fact Density</h3>
        <div className="h-56">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={factDensityData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72}>
                {factDensityData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={mode === "dark" ? "rounded-md bg-surface p-5" : "rounded-md bg-zinc-100 p-5"}>
        <h3 className={mode === "dark" ? "mb-2 text-sm font-semibold text-zinc-100" : "mb-2 text-sm font-semibold text-zinc-900"}>Source Reliability</h3>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={analysis.sourceReliability} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="source" type="category" tick={{ fill: "#d4d4d8", fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="score" radius={[2, 2, 2, 2]} fill="#8B0000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </aside>
  );
}

export default AnalyticsPanel;

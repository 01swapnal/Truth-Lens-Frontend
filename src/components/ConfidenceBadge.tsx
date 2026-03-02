interface ConfidenceBadgeProps {
  level: "High" | "Medium" | "Low";
  score: number;
}

function ConfidenceBadge({ level, score }: ConfidenceBadgeProps) {
  const tone =
    level === "High"
      ? "border-green-800 text-green-300"
      : level === "Medium"
        ? "border-yellow-700 text-yellow-300"
        : "border-red-800 text-red-300";

  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tone}`}>{level} Confidence ({score}%)</span>;
}

export default ConfidenceBadge;

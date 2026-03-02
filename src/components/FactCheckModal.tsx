import { FormEvent, useState } from "react";
import type { FactCheckResult } from "../types/news";
import { useTheme } from "./ThemeContext";

interface FactCheckModalProps {
  open: boolean;
  onClose: () => void;
  onCheck: (claim: string) => Promise<FactCheckResult>;
}

function FactCheckModal({ open, onClose, onCheck }: FactCheckModalProps) {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { mode } = useTheme();

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const response = await onCheck(claim);
    setResult(response);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className={mode === "dark" ? "w-full max-w-xl rounded-md bg-surface p-5" : "w-full max-w-xl rounded-md bg-zinc-100 p-5"}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Fact Check Assistant</h3>
          <button onClick={onClose} className="rounded px-2 py-1 text-xs text-zinc-500 hover:text-accent">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={claim}
            onChange={(event) => setClaim(event.target.value)}
            placeholder="Paste a claim to evaluate..."
            className={
              mode === "dark"
                ? "h-28 w-full rounded-md bg-black p-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                : "h-28 w-full rounded-md bg-white p-3 text-sm text-black placeholder:text-zinc-500 focus:outline-none"
            }
          />
          <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-medium hover:bg-red-900">
            {loading ? "Checking..." : "Check Now"}
          </button>
        </form>

        {result ? (
          <div className={mode === "dark" ? "mt-5 rounded-md bg-black p-4" : "mt-5 rounded-md bg-white p-4"}>
            <p className={mode === "dark" ? "text-sm font-medium text-zinc-100" : "text-sm font-medium text-zinc-800"}>
              Verdict: <span className="text-accent">{result.verdict}</span>
            </p>
            <ul className={mode === "dark" ? "mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300" : "mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700"}>
              {result.evidence.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default FactCheckModal;

import { SearchCheck } from "lucide-react";
import { useState } from "react";
import { newsApi } from "../api/newsApi";
import type { LensTruthResult } from "../types/news";
import { useLens } from "./LensContext";
import { useTheme } from "./ThemeContext";

function LensOverlayButton() {
  const { isLensActive } = useLens();
  const { mode } = useTheme();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LensTruthResult | null>(null);

  if (!isLensActive) return null;

  async function handleScan() {
    setLoading(true);
    const response = await newsApi.checkLensTruth(target);
    setResult(response);
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-[70] inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white shadow-xl hover:bg-red-900"
      >
        <SearchCheck size={16} />
        Lens Scan
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
          <div className={mode === "dark" ? "w-full max-w-xl rounded-xl bg-surface p-5" : "w-full max-w-xl rounded-xl bg-white p-5"}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Truth Lens Overlay</h3>
              <button onClick={() => setOpen(false)} className="text-xs text-zinc-500 hover:text-accent">
                Close
              </button>
            </div>

            <p className={mode === "dark" ? "mb-3 text-sm text-zinc-400" : "mb-3 text-sm text-zinc-600"}>
              Paste website URL or headline text to simulate Google-Lens style verification.
            </p>

            <textarea
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              placeholder="Paste URL or claim text..."
              className={
                mode === "dark"
                  ? "h-28 w-full rounded-md bg-black p-3 text-sm text-white placeholder:text-zinc-500"
                  : "h-28 w-full rounded-md bg-zinc-100 p-3 text-sm text-black placeholder:text-zinc-500"
              }
            />

            <button onClick={handleScan} className="mt-3 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-red-900">
              {loading ? "Analyzing..." : "Analyze Truth Score"}
            </button>

            {result ? (
              <div className={mode === "dark" ? "mt-4 rounded-md bg-black p-4" : "mt-4 rounded-md bg-zinc-100 p-4"}>
                <p className="text-sm font-medium">
                  Verdict: <span className="text-accent">{result.verdict}</span>
                </p>
                <p className="mt-1 text-sm">Truth Score: {result.score}/100</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {result.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default LensOverlayButton;

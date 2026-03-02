import { useEffect, useState } from "react";
import { newsApi } from "../api/newsApi";
import { useTheme } from "../components/ThemeContext";
import type { ViralClaim } from "../types/news";

function FakeOrNot() {
  const [claims, setClaims] = useState<ViralClaim[]>([]);
  const { mode } = useTheme();

  useEffect(() => {
    let active = true;

    async function loadClaims() {
      const response = await newsApi.getViralClaims();
      if (active) setClaims(response);
    }

    void loadClaims();

    return () => {
      active = false;
    };
  }, []);

  function statusClass(status: ViralClaim["status"]) {
    if (status === "Fake") return "text-red-500";
    if (status === "Likely True") return "text-green-500";
    return "text-yellow-500";
  }

  return (
    <section className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">Fake or Not</h1>
      <p className={mode === "dark" ? "mt-2 text-sm text-zinc-400" : "mt-2 text-sm text-zinc-600"}>
        Viral claims monitored by Truth Lens with preliminary verification status.
      </p>

      <div className="mt-6 space-y-3">
        {claims.map((claim) => (
          <div key={claim.id} className={mode === "dark" ? "rounded-md bg-surface p-4" : "rounded-md bg-zinc-100 p-4"}>
            <div className="flex items-center justify-between gap-4">
              <p className={mode === "dark" ? "font-medium text-white" : "font-medium text-black"}>{claim.headline}</p>
              <span className={`text-sm font-semibold ${statusClass(claim.status)}`}>{claim.status}</span>
            </div>
            <p className={mode === "dark" ? "mt-2 text-sm text-zinc-400" : "mt-2 text-sm text-zinc-600"}>{claim.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FakeOrNot;

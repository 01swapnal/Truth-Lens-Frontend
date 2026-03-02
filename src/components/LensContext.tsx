import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

interface LensContextValue {
  isLensActive: boolean;
  setLensActive: (value: boolean) => void;
  toggleLensActive: () => void;
}

const LensContext = createContext<LensContextValue | null>(null);

export function LensProvider({ children }: PropsWithChildren) {
  const [isLensActive, setLensActive] = useState<boolean>(() => localStorage.getItem("truth-lens-active") === "true");

  function toggleLensActive() {
    setLensActive((current) => !current);
  }

  const value = useMemo(
    () => ({
      isLensActive,
      setLensActive,
      toggleLensActive
    }),
    [isLensActive]
  );

  useEffect(() => {
    localStorage.setItem("truth-lens-active", String(isLensActive));
  }, [isLensActive]);

  return <LensContext.Provider value={value}>{children}</LensContext.Provider>;
}

export function useLens() {
  const context = useContext(LensContext);
  if (!context) {
    throw new Error("useLens must be used inside LensProvider");
  }
  return context;
}

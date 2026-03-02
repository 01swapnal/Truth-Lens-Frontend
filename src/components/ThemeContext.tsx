import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

type ThemeMode = "dark" | "light";

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("truth-lens-theme");
    return saved === "light" ? "light" : "dark";
  });

  function toggleMode() {
    setMode((current) => (current === "dark" ? "light" : "dark"));
  }

  const value = useMemo(() => ({ mode, toggleMode }), [mode]);

  useEffect(() => {
    localStorage.setItem("truth-lens-theme", mode);
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}

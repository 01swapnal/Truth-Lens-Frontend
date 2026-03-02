import type { PropsWithChildren } from "react";
import LensOverlayButton from "./LensOverlayButton";
import Navbar from "./Navbar";
import { useTheme } from "./ThemeContext";

function Layout({ children }: PropsWithChildren) {
  const { mode } = useTheme();

  return (
    <div className={mode === "dark" ? "theme-dark min-h-screen bg-black text-white" : "theme-light min-h-screen bg-white text-black"}>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <LensOverlayButton />
    </div>
  );
}

export default Layout;

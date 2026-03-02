import { Link, NavLink } from "react-router-dom";
import SlideTabs from "./SlideTabs";
import StaggeredMenu from "./StaggeredMenu";
import { useLens } from "./LensContext";
import { useTheme } from "./ThemeContext";

const menuItems = [
  { label: "Trending News", ariaLabel: "View trending news", link: "/trending" },
  { label: "Fake or Not", ariaLabel: "Check viral fake news", link: "/fake-or-not" },
  { label: "News Analyzer", ariaLabel: "Open news analyzer", link: "/analyzer" },
  { label: "Methodology", ariaLabel: "Read methodology", link: "/methodology" },
  { label: "About", ariaLabel: "Learn about truth lens", link: "/about" }
];

const socialItems = [
  { label: "Twitter", link: "https://twitter.com" },
  { label: "GitHub", link: "https://github.com" },
  { label: "LinkedIn", link: "https://linkedin.com" }
];

const slideTabs = [
  { label: "Home", link: "/" },
  { label: "Trending", link: "/trending" },
  { label: "Analyzer", link: "/analyzer" },
  { label: "Methodology", link: "/methodology" },
  { label: "About", link: "/about" }
];

function Navbar() {
  const { mode, toggleMode } = useTheme();
  const { isLensActive, toggleLensActive } = useLens();
  const baseLink =
    mode === "dark"
      ? "text-sm text-zinc-300 hover:text-white transition-colors"
      : "text-sm text-zinc-700 hover:text-black transition-colors";

  return (
    <header className={mode === "dark" ? "sticky top-0 z-50 bg-black/95" : "sticky top-0 z-50 bg-white/95"}>
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold tracking-[0.18em] text-accent">
          TRUTH LENS
        </Link>

        <SlideTabs tabs={slideTabs} />

        <div className="flex items-center gap-4 sm:gap-6">
          <NavLink to="/" className={`${baseLink} lg:hidden`}>
            Home
          </NavLink>

          <button
            onClick={toggleLensActive}
            className={
              isLensActive
                ? "rounded-md bg-accent px-3 py-2 text-sm font-medium text-white"
                : mode === "dark"
                  ? "rounded-md bg-zinc-800 px-3 py-2 text-sm text-zinc-200"
                  : "rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-700"
            }
          >
            {isLensActive ? "Activated" : "Activate"}
          </button>

          <StaggeredMenu
            className="navbar-staggered-menu"
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials
            displayItemNumbering
            menuButtonColor={mode === "dark" ? "#e4e4e7" : "#3f3f46"}
            openMenuButtonColor={mode === "dark" ? "#ffffff" : "#111111"}
            changeMenuColorOnOpen
            colors={mode === "dark" ? ["#6b1220", "#1a1a1a"] : ["#f4d6df", "#8B0000"]}
            accentColor="#760f28"
          />

          <button onClick={toggleMode} className="group inline-flex items-center gap-2">
            <span className={mode === "dark" ? "text-xs text-zinc-300" : "text-xs text-zinc-600"}>{mode === "dark" ? "Dark" : "Light"}</span>
            <span
              className={
                mode === "dark"
                  ? "relative h-6 w-11 rounded-full bg-zinc-700 transition"
                  : "relative h-6 w-11 rounded-full bg-red-200 transition"
              }
            >
              <span
                className={
                  mode === "dark"
                    ? "absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition"
                    : "absolute left-6 top-1 h-4 w-4 rounded-full bg-accent transition"
                }
              />
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

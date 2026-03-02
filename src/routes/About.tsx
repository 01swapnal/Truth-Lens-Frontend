import { useTheme } from "../components/ThemeContext";

function About() {
  const { mode } = useTheme();

  return (
    <section className={mode === "dark" ? "mx-auto max-w-3xl rounded-md bg-surface p-6" : "mx-auto max-w-3xl rounded-md bg-zinc-100 p-6"}>
      <h1 className="text-2xl font-semibold">About Truth Lens</h1>
      <p className={mode === "dark" ? "mt-3 text-sm leading-7 text-zinc-300" : "mt-3 text-sm leading-7 text-zinc-700"}>
        Truth Lens is a neutral news intelligence frontend designed to aggregate multi-source coverage, assess confidence,
        and highlight factual consistency. This version is API-ready with typed contracts and mock fallback mode for rapid
        backend integration.
      </p>
    </section>
  );
}

export default About;

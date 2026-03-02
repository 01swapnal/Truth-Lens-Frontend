import { useTheme } from "../components/ThemeContext";

function Methodology() {
  const { mode } = useTheme();

  return (
    <section className={mode === "dark" ? "mx-auto max-w-3xl rounded-md bg-surface p-6" : "mx-auto max-w-3xl rounded-md bg-zinc-100 p-6"}>
      <h1 className={mode === "dark" ? "text-2xl font-semibold text-white" : "text-2xl font-semibold text-black"}>Methodology</h1>
      <p className={mode === "dark" ? "mt-4 text-sm leading-7 text-zinc-300" : "mt-4 text-sm leading-7 text-zinc-700"}>
        Truth Lens scores coverage using a layered model: source reliability, claim overlap, factual density, and framing intensity.
        This scaffold runs on mock data and is structured for direct API integration.
      </p>

      <ul className={mode === "dark" ? "mt-6 list-disc space-y-2 pl-5 text-sm text-zinc-300" : "mt-6 list-disc space-y-2 pl-5 text-sm text-zinc-700"}>
        <li>Source weighting based on reliability history and correction frequency.</li>
        <li>Claim segmentation into verified, disputed, and neutral context blocks.</li>
        <li>Political lean score normalized on a -100 to +100 spectrum.</li>
        <li>Confidence score computed from source alignment and evidence quality.</li>
      </ul>
    </section>
  );
}

export default Methodology;

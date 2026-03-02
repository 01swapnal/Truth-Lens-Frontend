import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useTheme } from "../components/ThemeContext";

function Analyzer() {
  const navigate = useNavigate();
  const { mode } = useTheme();

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold">News Analyzer</h1>
      <p className={mode === "dark" ? "mt-2 text-sm text-zinc-400" : "mt-2 text-sm text-zinc-600"}>
        Enter any topic to run source comparison and confidence analysis.
      </p>
      <SearchBar className="mt-6" onSearch={(topic) => navigate(`/result/${topic}`)} />
    </section>
  );
}

export default Analyzer;


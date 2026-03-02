import { FormEvent, useState } from "react";
import { Mic } from "lucide-react";
import { useTheme } from "./ThemeContext";

interface SearchBarProps {
  onSearch: (topic: string) => void;
  className?: string;
}

function SearchBar({ onSearch, className = "" }: SearchBarProps) {
  const [topic, setTopic] = useState("");
  const { mode } = useTheme();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!topic.trim()) return;
    onSearch(topic.trim().toLowerCase().replace(/\s+/g, "-"));
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <label htmlFor="topic-search" className="sr-only">
        Search topic
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="topic-search"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Search a topic (e.g. global energy prices)"
          className={
            mode === "dark"
              ? "h-12 w-full rounded-md border border-border bg-surface px-4 text-sm text-white placeholder:text-zinc-400 focus:border-accent focus:outline-none"
              : "h-12 w-full rounded-md border border-border bg-white px-4 text-sm text-black placeholder:text-zinc-500 focus:border-accent focus:outline-none"
          }
        />
        <button
          type="button"
          aria-label="Speech to text (coming soon)"
          title="Speech to text coming soon"
          className={
            mode === "dark"
              ? "h-12 rounded-md border border-zinc-700 bg-zinc-900 px-4 text-zinc-300"
              : "h-12 rounded-md border border-zinc-300 bg-zinc-100 px-4 text-zinc-700"
          }
        >
          <span className="flex items-center gap-2 text-sm">
            <Mic size={16} />
            Mic
          </span>
        </button>
        <button
          type="submit"
          className="h-12 rounded-md bg-accent px-6 text-sm font-medium text-white hover:bg-red-900"
        >
          Analyze
        </button>
      </div>
    </form>
  );
}

export default SearchBar;

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";

interface TabItem {
  label: string;
  link: string;
}

interface SlideTabsProps {
  tabs: TabItem[];
}

interface CursorState {
  left: number;
  width: number;
  opacity: number;
}

interface TabProps {
  item: TabItem;
  setPosition: (value: CursorState) => void;
}

function Tab({ item, setPosition }: TabProps) {
  const navigate = useNavigate();
  const ref = useRef<HTMLLIElement | null>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1
        });
      }}
      onClick={() => navigate(item.link)}
      className="relative z-10 block cursor-pointer select-none px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-2.5 md:text-sm"
    >
      {item.label}
    </li>
  );
}

function Cursor({ position }: { position: CursorState }) {
  return <motion.li animate={position as any} className="absolute z-0 h-7 rounded-full bg-black md:h-10" />;
}

function SlideTabs({ tabs }: SlideTabsProps) {
  const [position, setPosition] = useState<CursorState>({
    left: 0,
    width: 0,
    opacity: 0
  });
  const { mode } = useTheme();

  return (
    <ul
      onMouseLeave={() => setPosition((current) => ({ ...current, opacity: 0 }))}
      className={
        mode === "dark"
          ? "relative mx-auto hidden w-fit rounded-full border-2 border-zinc-700 bg-zinc-100 p-1 lg:flex"
          : "relative mx-auto hidden w-fit rounded-full border-2 border-zinc-300 bg-white p-1 lg:flex"
      }
    >
      {tabs.map((item) => (
        <Tab key={item.link} item={item} setPosition={setPosition} />
      ))}
      <Cursor position={position} />
    </ul>
  );
}

export default SlideTabs;

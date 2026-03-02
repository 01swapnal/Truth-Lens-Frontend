import type { LucideIcon } from "lucide-react";
import { Cloud, Code, Cpu, Globe, Lock, Zap } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState, type MouseEvent } from "react";
import { cn } from "../lib/utils";
import { useTheme } from "./ThemeContext";

const TILT_MAX = 9;
const TILT_SPRING = { stiffness: 300, damping: 28 } as const;
const GLOW_SPRING = { stiffness: 180, damping: 22 } as const;

export interface SpotlightItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const DEFAULT_ITEMS: SpotlightItem[] = [
  {
    icon: Zap,
    title: "Instant",
    description: "Sub-100ms latency on every request, globally distributed across every region.",
    color: "#f59e0b"
  },
  {
    icon: Lock,
    title: "Secure",
    description: "Zero-trust by default. SOC 2 certified with end-to-end encryption throughout.",
    color: "#60a5fa"
  },
  {
    icon: Globe,
    title: "Global",
    description: "Edge-deployed to 300+ locations. Your users always hit a nearby server.",
    color: "#34d399"
  },
  {
    icon: Code,
    title: "Developer first",
    description: "Type-safe SDKs in five languages, a complete REST API, and honest docs.",
    color: "#a78bfa"
  },
  {
    icon: Cpu,
    title: "Scalable",
    description: "From side project to Series B without touching your infrastructure config.",
    color: "#38bdf8"
  },
  {
    icon: Cloud,
    title: "Serverless",
    description: "No servers to provision, patch, or babysit. Just deploy and move on.",
    color: "#f472b6"
  }
];

interface CardProps {
  item: SpotlightItem;
  dimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function Card({ item, dimmed, onHoverStart, onHoverEnd }: CardProps) {
  const { mode } = useTheme();
  const Icon = item.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]);

  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    normX.set((event.clientX - rect.left) / rect.width);
    normY.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseEnter() {
    glowOpacity.set(1);
    onHoverStart();
  }

  function handleMouseLeave() {
    normX.set(0.5);
    normY.set(0.5);
    glowOpacity.set(0);
    onHoverEnd();
  }

  return (
    <motion.div
      animate={{
        scale: dimmed ? 0.96 : 1,
        opacity: dimmed ? 0.5 : 1
      }}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-2xl border p-6 transition-[border-color] duration-300",
        mode === "dark"
          ? "border-white/10 bg-white/[0.03] hover:border-white/20"
          : "border-zinc-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-zinc-300"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}14, transparent 65%)`
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}2e, transparent 65%)`
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[55%] -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]"
      />

      <div
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          background: `${item.color}18`,
          boxShadow: `inset 0 0 0 1px ${item.color}30`
        }}
      >
        <Icon size={17} strokeWidth={1.9} style={{ color: item.color }} />
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        <h3 className={mode === "dark" ? "text-[14px] font-semibold tracking-tight text-white" : "text-[14px] font-semibold tracking-tight text-zinc-900"}>
          {item.title}
        </h3>
        <p className={mode === "dark" ? "text-[12.5px] leading-relaxed text-white/50" : "text-[12.5px] leading-relaxed text-zinc-500"}>
          {item.description}
        </p>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(to right, ${item.color}80, transparent)`
        }}
      />
    </motion.div>
  );
}

interface SpotlightCardsProps {
  items?: SpotlightItem[];
  eyebrow?: string;
  heading?: string;
  className?: string;
}

export default function SpotlightCards({
  items = DEFAULT_ITEMS,
  eyebrow = "Capabilities",
  heading = "Instant, secure, global coverage",
  className
}: SpotlightCardsProps) {
  const { mode } = useTheme();
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  return (
    <section
      className={cn(
        "relative mt-10 w-full overflow-hidden rounded-2xl px-8 pb-10 pt-9",
        mode === "dark" ? "bg-[#06060f]" : "bg-white",
        className
      )}
    >
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0", mode === "dark" ? "hidden" : "block")}
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)",
          backgroundSize: "22px 22px"
        }}
      />

      <div className="relative mb-8 flex flex-col gap-1.5">
        <p className={mode === "dark" ? "text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-400/80" : "text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-600"}>
          {eyebrow}
        </p>
        <h2 className={mode === "dark" ? "text-[22px] font-semibold tracking-tight text-white" : "text-[22px] font-semibold tracking-tight text-zinc-900"}>{heading}</h2>
      </div>

      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card
            dimmed={hoveredTitle !== null && hoveredTitle !== item.title}
            item={item}
            key={item.title}
            onHoverEnd={() => setHoveredTitle(null)}
            onHoverStart={() => setHoveredTitle(item.title)}
          />
        ))}
      </div>
    </section>
  );
}

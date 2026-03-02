import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";

interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient: string;
  url?: string;
}

interface ChromaGridProps {
  items: ChromaItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
  onItemClick?: (item: ChromaItem) => void;
}

export function ChromaGrid({
  items,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
  onItemClick
}: ChromaGridProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fadeRef = useRef<HTMLDivElement | null>(null);
  const setX = useRef<((value: number) => void) | null>(null);
  const setY = useRef<((value: number) => void) | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px") as (value: number) => void;
    setY.current = gsap.quickSetter(el, "--y", "px") as (value: number) => void;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current?.(pos.current.x);
    setY.current?.(pos.current.y);
  }, []);

  function moveTo(x: number, y: number) {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  }

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    moveTo(event.clientX - rect.left, event.clientY - rect.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  }

  function handleLeave() {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true
    });
  }

  function handleCardClick(item: ChromaItem) {
    if (onItemClick) {
      onItemClick(item);
      return;
    }
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  }

  function handleCardMove(event: React.MouseEvent<HTMLElement>) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        ["--r" as string]: `${radius}px`,
        ["--cols" as string]: String(columns),
        ["--rows" as string]: String(rows)
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {items.map((card, index) => (
        <article
          key={`${card.title}-${index}`}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(card)}
          style={{
            ["--card-border" as string]: card.borderColor || "transparent",
            ["--card-gradient" as string]: card.gradient,
            cursor: card.url || onItemClick ? "pointer" : "default"
          }}
        >
          <div className="chroma-img-wrapper">
            <img src={card.image} alt={card.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{card.title}</h3>
            {card.handle ? <span className="handle">{card.handle}</span> : null}
            <p className="role">{card.subtitle}</p>
            {card.location ? <span className="location">{card.location}</span> : null}
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
}

export default ChromaGrid;

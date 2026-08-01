import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

export type HoverCardItem = {
  title: string;
  description: string;
  link?: string;
  meta?: string;
};

export function CardHoverEffect({
  items,
  className,
  onCardClick,
}: {
  items: HoverCardItem[];
  className?: string;
  onCardClick?: (item: HoverCardItem) => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item, idx) => (
        <a
          href={item.link}
          key={item.title}
          onClick={item.link ? undefined : (e) => { e.preventDefault(); onCardClick?.(item); }}
          target={item.link?.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 block rounded-sm bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] ring-1 ring-[color-mix(in_oklab,var(--primary)_28%,transparent)]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <HoverCard>
            <CardTitle>{item.title}</CardTitle>
            {item.meta && <CardMeta>{item.meta}</CardMeta>}
            <CardDescription>{item.description}</CardDescription>
          </HoverCard>
        </a>
      ))}
    </div>
  );
}

export const HoverCard = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative z-20 h-full w-full overflow-hidden border-b border-[color-mix(in_oklab,var(--rule)_25%,transparent)] bg-card/40 p-5 transition-colors duration-300 group-hover:border-[color-mix(in_oklab,var(--rule)_55%,transparent)]",
        className,
      )}
    >
      <div className="relative z-50">
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <h4 className={cn("font-serif text-lg leading-snug tracking-tight text-foreground", className)}>
      {children}
    </h4>
  );
};

export const CardMeta = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <p className={cn("num mt-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground", className)}>
      {children}
    </p>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <p className={cn("mt-4 text-sm leading-relaxed text-foreground/70", className)}>{children}</p>
  );
};

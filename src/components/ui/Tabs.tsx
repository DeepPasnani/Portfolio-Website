import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content?: ReactNode;
};

export function Tabs({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) {
  const [active, setActive] = useState<Tab>(propTabs[0] as Tab);
  const [tabs, setTabs] = useState<Tab[]>(propTabs);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0] as Tab);
    setTabs(newTabs);
    setActive(newTabs[0] as Tab);
  };

  const [hovering, setHovering] = useState(false);

  return (
    <>
      <div
        className={cn(
          "no-visible-scrollbar relative flex w-full max-w-full flex-row items-center justify-start overflow-auto [perspective:1000px] sm:overflow-visible",
          containerClassName,
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.title}
            type="button"
            onClick={() => moveSelectedTabToTop(idx)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm tracking-wide transition-colors duration-200",
              active.value === tab.value ? "text-foreground" : "text-foreground/55 hover:text-foreground/80",
              tabClassName,
            )}
            style={{ transformStyle: "preserve-3d" }}
          >
            {active.value === tab.value && (
              <motion.span
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] ring-1 ring-[color-mix(in_oklab,var(--primary)_30%,transparent)]",
                  activeTabClassName,
                )}
              />
            )}
            <span className="relative block">{tab.title}</span>
          </button>
        ))}
      </div>
      <FadeInDiv
        tabs={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
        className={cn("mt-6", contentClassName)}
      />
    </>
  );
}

export const FadeInDiv = ({
  className,
  tabs,
  active,
  hovering,
}: {
  className?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const activeIndex = tabs.findIndex((tab) => tab.value === active.value);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Decorative stacked cards peeking behind the active panel */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {tabs.map((tab, idx) => {
          if (idx === activeIndex || idx === 0 || idx > 3) return null;
          const depth = idx - activeIndex;
          if (depth <= 0) return null;
          return (
            <motion.div
              key={`stack-${tab.value}`}
              className="absolute inset-0 overflow-hidden rounded-sm border border-[color-mix(in_oklab,var(--rule)_20%,transparent)] bg-muted/40"
              animate={{ y: hovering ? -depth * 10 : 0, scale: 1 - depth * 0.06, opacity: Math.max(0, 0.5 - depth * 0.15) }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.value}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative z-10"
        >
          {active.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

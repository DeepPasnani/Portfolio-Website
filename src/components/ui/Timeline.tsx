import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (ref.current) {
        setHeight(ref.current.getBoundingClientRect().height);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 80%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="w-full font-sans">
      <div ref={ref} className="relative mx-auto max-w-3xl pb-10">
        {data.map((item, index) => (
          <div
            key={index}
            className="relative flex justify-start pt-10 md:gap-10 md:pt-16"
          >
            <div className="sticky top-40 z-40 flex w-auto max-w-sm items-start self-start md:w-full md:flex-row md:items-center">
              <div className="absolute left-2 flex h-3 w-3 items-center justify-center rounded-full bg-background ring-1 ring-[color-mix(in_oklab,var(--primary)_45%,transparent)] md:left-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              <h3 className="hidden pl-10 text-2xl font-normal text-foreground md:block md:pr-10 md:text-3xl">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pl-10 pr-4 md:pl-4">
              <h3 className="mb-4 flex items-center gap-2 text-left text-lg text-foreground md:hidden">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{ height: `${height}px` }}
          className="absolute left-[9px] top-0 w-px overflow-hidden bg-[color-mix(in_oklab,var(--rule)_30%,transparent)] md:left-[9px]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-px"
          >
            <div className="h-full w-px bg-gradient-to-b from-primary via-primary/60 to-ball" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

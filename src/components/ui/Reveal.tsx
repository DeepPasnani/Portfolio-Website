import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

/**
 * Scroll-triggered reveal wrapper (motion-only, no GSAP).
 * Fades + un-blurs children into view when they enter the viewport.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      {...(reduce
        ? {}
        : {
            whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          })}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Bat-swing page transition.
 * On route change the incoming page is clipped along a curved edge that sweeps
 * across the viewport, and a minimal willow bat rides that same edge — so the
 * arc of the shot IS the reveal boundary. Instant crossfade under reduced motion.
 */

const DURATION = 560;

function easeShot(t: number) {
  // weighted follow-through, no overshoot
  return 1 - Math.pow(1 - t, 2.6);
}

/** Curved reveal edge: everything left of it shows the incoming page. */
function clipFor(p: number) {
  const pts: string[] = ["0% 0%"];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const bulge = Math.sin(Math.PI * t) * 26; // % of width — the arc of the shot
    const x = p * 150 - 25 + bulge - 26;
    pts.push(`${x.toFixed(2)}% ${(t * 100).toFixed(2)}%`);
  }
  pts.push("0% 100%");
  return `polygon(${pts.join(", ")})`;
}

function edgeXAt(p: number, t: number) {
  const bulge = Math.sin(Math.PI * t) * 26;
  return p * 150 - 25 + bulge - 26;
}

function Bat({ progress }: { progress: number }) {
  const x = edgeXAt(progress, 0.5);
  const rotate = -62 + progress * 118;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80]"
      style={{ opacity: progress > 0.001 && progress < 0.999 ? 1 : 0 }}
    >
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          top: "50%",
          transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        }}
      >
        {/* faint motion-blur streak trailing the blade */}
        <svg width="150" height="440" viewBox="0 0 150 440" style={{ display: "block" }}>
          <g opacity="0.22" transform="translate(-16,0)">
            <rect x="46" y="120" width="58" height="250" rx="10" fill="#C9A66B" />
          </g>
          <g opacity="0.12" transform="translate(-32,0)">
            <rect x="46" y="120" width="58" height="250" rx="10" fill="#C9A66B" />
          </g>
          {/* grip */}
          <rect x="66" y="26" width="18" height="100" rx="9" fill="#171614" />
          {/* shoulder + blade */}
          <rect x="62" y="112" width="26" height="26" fill="#B9955C" />
          <rect x="46" y="126" width="58" height="252" rx="9" fill="#D8B67F" />
          {/* seam accent — the only ball-red on the bat */}
          <rect x="72" y="150" width="2" height="200" fill="#8C2B22" opacity="0.55" />
        </svg>
      </div>
    </div>
  );
}

export function BatSwingTransition({
  routeKey,
  children,
}: {
  routeKey: string;
  children: ReactNode;
}) {
  const [reduced, setReduced] = useState(true);
  const [progress, setProgress] = useState(1);
  const [prev, setPrev] = useState<{ key: string; node: ReactNode } | null>(null);
  const lastKey = useRef(routeKey);
  const lastChildren = useRef(children);
  const raf = useRef(0);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const incoming = useRef(children);
  incoming.current = children;

  useEffect(() => {
    if (routeKey === lastKey.current) return;
    const outgoing = { key: lastKey.current, node: lastChildren.current };
    lastKey.current = routeKey;
    lastChildren.current = incoming.current;

    if (reduced) {
      setPrev(null);
      setProgress(1);
      return;
    }

    setPrev(outgoing);
    setProgress(0);
    const start = performance.now();
    cancelAnimationFrame(raf.current);
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / DURATION);
      setProgress(easeShot(p));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setPrev(null);
    };
    raf.current = requestAnimationFrame(tick);
  }, [routeKey, reduced]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const animating = prev !== null && progress < 1;

  return (
    <>
      {animating && (
        <div aria-hidden="true" className="fixed inset-0 z-[10] overflow-hidden bg-background">
          <div className="h-full w-full overflow-y-hidden">{prev.node}</div>
        </div>
      )}
      <div
        className={animating ? "fixed inset-0 z-[20] overflow-hidden bg-background" : undefined}
        style={animating ? { clipPath: clipFor(progress) } : undefined}
      >
        {children}
      </div>
      {animating && <Bat progress={progress} />}
    </>
  );
}

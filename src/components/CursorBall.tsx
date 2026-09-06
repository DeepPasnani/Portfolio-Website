import { useEffect, useRef } from "react";

/**
 * Cursor ball & tail — the site's single cursor treatment.
 * A matte ball-red marker with a short tapering seam-thread tail drawn on a
 * lightweight full-viewport canvas. Desktop/fine-pointer only; disabled for
 * reduced motion and touch devices (system cursor returns).
 */
export function CursorBall() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.documentElement.classList.add("cursor-ball-active");
    canvas.style.display = "block";

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    type Pt = { x: number; y: number; t: number };
    const points: Pt[] = [];
    let mx = -100;
    let my = -100;
    let visible = false;
    let hovering = false;
    const LIFE = 220; // ms tail life
    const HOVER_SELECTOR = 'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])';

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      visible = true;
      hovering = e.target instanceof Element && e.target.closest(HOVER_SELECTOR) !== null;
      points.push({ x: mx, y: my, t: performance.now() });
    };
    const onLeave = () => {
      visible = false;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);

    let raf = 0;
    const draw = () => {
      const now = performance.now();
      while (points.length && now - points[0]!.t > LIFE) points.shift();
      if (points.length > 40) points.splice(0, points.length - 40);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (visible) {
        // Continuous tapering tail through the recent path.
        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1]!;
          const p1 = points[i]!;
          const age = (now - p1.t) / LIFE;
          const life = Math.max(0, 1 - age);
          const head = i / points.length;
          const w = 4.2 * life * head;
          if (w < 0.15) continue;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineWidth = w;
          ctx.lineCap = "round";
          ctx.strokeStyle = `rgba(140, 43, 34, ${0.5 * life * head})`;
          ctx.stroke();
        }

        // 2–3 fainter echo balls along the stroke.
        const echoAt = [0.5, 0.7, 0.85];
        echoAt.forEach((f, idx) => {
          const p = points[Math.floor((points.length - 1) * f)];
          if (!p) return;
          const life = Math.max(0, 1 - (now - p.t) / LIFE);
          if (life <= 0) return;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.6 - idx * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(140, 43, 34, ${(0.26 - idx * 0.07) * life})`;
          ctx.fill();
        });

        // Hover ring — the one affordance telling you something's clickable
        // now that the system cursor (and its pointer icon) is hidden.
        if (hovering) {
          ctx.beginPath();
          ctx.arc(mx, my, 11, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(140, 43, 34, 0.55)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // The ball itself, with a faint seam line.
        ctx.beginPath();
        ctx.arc(mx, my, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(140, 43, 34, 1)";
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(mx, my, 5, 1.7, Math.PI / 4, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(250, 246, 238, 0.45)";
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      document.documentElement.classList.remove("cursor-ball-active");
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: "none" }}
      className="pointer-events-none fixed inset-0 z-[90]"
    />
  );
}

import { useEffect, useRef, useState } from "react";

const IVORY = "250, 246, 238";
const BALL = "140, 43, 34";
const VIEW_W = 1200;
const VIEW_H = 700;
const STARS: [number, number][] = [
  [90, 64], [260, 98], [340, 142], [470, 70], [640, 158],
  [700, 55], [800, 112], [905, 152], [1120, 62],
];

/**
 * Hero ground — a floodlit, aerial Lord's in dusk, reworked as an interactive
 * net: point to aim, click/tap to drive a ball from the crease. Shots that
 * clear the rope flash the boundary and tick the scorebook. Home only.
 */
export function HeroGround({
  introVisible,
  onToggleIntro,
}: {
  introVisible: boolean;
  onToggleIntro: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const hudAngleRef = useRef<HTMLSpanElement | null>(null);
  const hudDistRef = useRef<HTMLSpanElement | null>(null);
  const hudRunsRef = useRef<HTMLSpanElement | null>(null);
  const [reduced, setReduced] = useState(true);
  const [active, setActive] = useState(false);
  const [boundaries, setBoundaries] = useState(0);
  const [runsTotal, setRunsTotal] = useState(0);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const host = wrap.parentElement ?? wrap;
    const FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const scaleOf = () => Math.max(w / VIEW_W, h / VIEW_H);
    const offsetOf = () => {
      const s = scaleOf();
      return { ox: (w - VIEW_W * s) / 2, oy: (h - VIEW_H * s) / 2 };
    };
    const crease = () => ({ x: w / 2, y: h * 0.58 });
    const boundary = () => {
      const s = scaleOf();
      const { ox, oy } = offsetOf();
      return { cx: 600 * s + ox, cy: 452 * s + oy, rx: 477 * s, ry: 158 * s };
    };
    const toView = (x: number, y: number) => {
      const s = scaleOf();
      const { ox, oy } = offsetOf();
      return { x: (x - ox) / s, y: (y - oy) / s };
    };

    type Shot = {
      x0: number; y0: number; x1: number; y1: number;
      start: number; dur: number;
      boundaryT: number; dist: number;
      trail: { x: number; y: number }[];
      flashed: boolean; six: boolean; spin: number;
    };
    type Fleck = { a: number; sp: number; life: number };
    type Impact = { x: number; y: number; t: number; dur: number; flecks: Fleck[] };
    type Flash = { t: number; cx: number; cy: number; rx: number; ry: number; ang: number };
    type Ghost = { x0: number; y0: number; x1: number; y1: number; cx: number; cy: number; t: number };
    type RunPop = { x: number; y: number; runs: number; six: boolean; t: number };

    const shots: Shot[] = [];
    const impacts: Impact[] = [];
    const flashes: Flash[] = [];
    const ghosts: Ghost[] = [];
    const runPops: RunPop[] = [];

    type Mote = {
      nx: number; ny: number; vx: number; vy: number;
      ph: number; sp: number; a: number; c: string;
    };
    const motes: Mote[] = Array.from({ length: 26 }, (_, i) => ({
      nx: Math.random(),
      ny: Math.random() * 0.85,
      vx: (Math.random() - 0.5) * 0.02,
      vy: -(0.008 + Math.random() * 0.02),
      ph: Math.random() * Math.PI * 2,
      sp: 0.6 + Math.random() * 1.4,
      a: 0.05 + Math.random() * 0.07,
      c: i % 3 === 0 ? BALL : IVORY,
    }));

    let engaged = false;
    let tx = crease().x;
    let ty = crease().y;
    let sx = tx;
    let sy = ty;
    let ppx = 0;
    let ppy = 0;
    let last = performance.now();
    let lastSoft = 0;

    const analyzeRuns = (toX: number, toY: number) => {
      const a = crease();
      const dx = toX - a.x;
      const dy = toY - a.y;
      const dist = Math.hypot(dx, dy);
      const b = boundary();
      const A = (dx * dx) / (b.rx * b.rx) + (dy * dy) / (b.ry * b.ry);
      const B = 2 * (((a.x - b.cx) * dx) / (b.rx * b.rx) + ((a.y - b.cy) * dy) / (b.ry * b.ry));
      const C =
        ((a.x - b.cx) * (a.x - b.cx)) / (b.rx * b.rx) +
        ((a.y - b.cy) * (a.y - b.cy)) / (b.ry * b.ry) -
        1;
      const disc = B * B - 4 * A * C;
      let boundaryT = Infinity;
      if (disc >= 0) {
        const roots = [(-B - Math.sqrt(disc)) / (2 * A), (-B + Math.sqrt(disc)) / (2 * A)].filter(
          (r) => r > 0,
        );
        if (roots.length) boundaryT = Math.min(...roots);
      }
      const yd = dist / 6.23;
      const six = boundaryT < 1;
      const frac = six ? 1 : 1 / boundaryT;
      const runs = six ? 6 : frac >= 0.86 ? 4 : frac >= 0.6 ? 3 : frac >= 0.34 ? 2 : 1;
      return { runs, six, dist, yd, frac };
    };

    const fireShot = (toX: number, toY: number) => {
      const a = crease();
      const dx = toX - a.x;
      const dy = toY - a.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 40) return;
      const b = boundary();
      const A = (dx * dx) / (b.rx * b.rx) + (dy * dy) / (b.ry * b.ry);
      const B = 2 * (((a.x - b.cx) * dx) / (b.rx * b.rx) + ((a.y - b.cy) * dy) / (b.ry * b.ry));
      const C =
        ((a.x - b.cx) * (a.x - b.cx)) / (b.rx * b.rx) +
        ((a.y - b.cy) * (a.y - b.cy)) / (b.ry * b.ry) -
        1;
      const disc = B * B - 4 * A * C;
      let boundaryT = Infinity;
      if (disc >= 0) {
        const roots = [(-B - Math.sqrt(disc)) / (2 * A), (-B + Math.sqrt(disc)) / (2 * A)].filter(
          (r) => r > 0,
        );
        if (roots.length) boundaryT = Math.min(...roots);
      }
      const dur = Math.min(1150, Math.max(480, 460 + dist * 0.55));
      shots.push({
        x0: a.x, y0: a.y, x1: a.x + dx, y1: a.y + dy,
        start: performance.now(), dur,
        boundaryT, dist,
        trail: [], flashed: false, six: boundaryT < 1, spin: Math.random() * Math.PI * 2,
      });
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (e.pointerType === "mouse") {
        tx = x;
        ty = y;
        if (!engaged) {
          engaged = true;
          setActive(true);
        }
      } else {
        const now = performance.now();
        if (now - lastSoft > 240) {
          lastSoft = now;
          fireShot(x, y);
        }
      }
    };
    const onDown = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (e.pointerType === "mouse") {
        tx = x;
        ty = y;
        if (!engaged) {
          engaged = true;
          setActive(true);
        }
      }
      fireShot(x, y);
    };
    const onLeave = () => {
      engaged = false;
      setActive(false);
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onDown, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    const warmup = setTimeout(() => {
      if (document.hidden) return;
      const a = crease();
      fireShot(a.x + w * 0.22, a.y + h * 0.06);
    }, 900);

    let raf = 0;
    const draw = () => {
      const now = performance.now();
      const dt = Math.min(40, now - last);
      last = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const m of motes) {
        m.nx += (m.vx * dt) / 1000;
        m.ny += (m.vy * dt) / 1000;
        if (m.nx < 0) m.nx += 1;
        if (m.nx > 1) m.nx -= 1;
        if (m.ny < 0) m.ny += 1;
        if (m.ny > 1) m.ny -= 1;
        const tw = 0.55 + 0.45 * Math.sin((now / 1000) * m.sp + m.ph);
        ctx.fillStyle = `rgba(${m.c}, ${(m.a * tw).toFixed(3)})`;
        ctx.fillRect(m.nx * w, m.ny * h, 1, 1);
      }

      sx += (tx - sx) * 0.18;
      sy += (ty - sy) * 0.18;

      if (engaged) {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 110);
        g.addColorStop(0, `rgba(${IVORY}, 0.055)`);
        g.addColorStop(1, `rgba(${IVORY}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(sx - 110, sy - 110, 220, 220);
      }

      if (engaged && FINE) {
        ctx.save();
        ctx.translate(sx, sy);
        ctx.strokeStyle = `rgba(${IVORY}, 0.32)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${IVORY}, 0.14)`;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${IVORY}, 0.45)`;
        for (let i = 0; i < 4; i++) {
          const th = (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(th) * 18, Math.sin(th) * 18);
          ctx.lineTo(Math.cos(th) * 23, Math.sin(th) * 23);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${IVORY}, 0.5)`;
        ctx.fill();
        ctx.restore();
      }

      if (engaged && FINE) {
        const pr = analyzeRuns(sx, sy);
        if (pr.dist >= 40) {
          const a = crease();
          ctx.save();
          ctx.setLineDash([2, 6]);
          ctx.lineDashOffset = -((now / 26) % 8);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = `rgba(${IVORY}, 0.3)`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();

          const label = pr.six ? "6" : String(pr.runs);
          ctx.save();
          ctx.font = '600 11px "IBM Plex Mono", monospace';
          const tw = ctx.measureText(label).width;
          const pad = 7;
          const bw = tw + pad * 2;
          const bh = 18;
          const px = sx + 18;
          const py = sy - 14;
          ctx.fillStyle = pr.six ? "rgba(250, 246, 238, 0.94)" : "rgba(23, 22, 20, 0.6)";
          ctx.beginPath();
          ctx.roundRect(px, py - bh / 2, bw, bh, 3);
          ctx.fill();
          ctx.fillStyle = pr.six ? "rgba(23, 22, 20, 0.94)" : "rgba(250, 246, 238, 0.92)";
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(label, px + pad, py);
          ctx.font = '500 7px "IBM Plex Mono", monospace';
          ctx.fillStyle = pr.six ? "rgba(23, 22, 20, 0.55)" : "rgba(250, 246, 238, 0.55)";
          ctx.fillText(pr.six ? "SIX" : "runs", px + pad, py + 9);
          ctx.restore();
        }
      }

      for (let i = shots.length - 1; i >= 0; i--) {
        const s = shots[i]!;
        const p = Math.min(1, (now - s.start) / s.dur);
        const e = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
        const bx = s.x0 + (s.x1 - s.x0) * e;
        const by = s.y0 + (s.y1 - s.y0) * e;
        s.trail.push({ x: bx, y: by });
        if (s.trail.length > 16) s.trail.shift();

        if (!s.flashed && s.six && e >= s.boundaryT) {
          s.flashed = true;
          const b = boundary();
          // boundaryT is the fraction of the shot vector at the rope crossing
          const cx2 = s.x0 + (s.x1 - s.x0) * s.boundaryT;
          const cy2 = s.y0 + (s.y1 - s.y0) * s.boundaryT;
          flashes.push({
            t: now, cx: b.cx, cy: b.cy, rx: b.rx, ry: b.ry,
            ang: Math.atan2((cy2 - b.cy) / b.ry, (cx2 - b.cx) / b.rx),
          });
        }

        for (let j = 1; j < s.trail.length; j++) {
          const q0 = s.trail[j - 1]!;
          const q1 = s.trail[j]!;
          const k = j / s.trail.length;
          ctx.beginPath();
          ctx.moveTo(q0.x, q0.y);
          ctx.lineTo(q1.x, q1.y);
          ctx.lineCap = "round";
          ctx.lineWidth = 6 * k;
          ctx.strokeStyle = `rgba(${BALL}, ${(0.1 * k).toFixed(3)})`;
          ctx.stroke();
        }
        for (let j = 1; j < s.trail.length; j++) {
          const q0 = s.trail[j - 1]!;
          const q1 = s.trail[j]!;
          const k = j / s.trail.length;
          ctx.beginPath();
          ctx.moveTo(q0.x, q0.y);
          ctx.lineTo(q1.x, q1.y);
          ctx.lineWidth = 2.6 * k;
          ctx.strokeStyle = `rgba(${BALL}, ${(0.55 * k).toFixed(3)})`;
          ctx.stroke();
        }

        s.spin += 0.35;
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${BALL}, 1)`;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(bx, by, 3, 1.1, s.spin, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${IVORY}, 0.5)`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        if (p >= 1) {
          const flecks: Fleck[] = Array.from({ length: 7 }, () => ({
            a: Math.random() * Math.PI * 2,
            sp: 0.5 + Math.random() * 0.9,
            life: 360 + Math.random() * 180,
          }));
          impacts.push({ x: bx, y: by, t: now, dur: 520, flecks });
          const res = analyzeRuns(s.x1, s.y1);
          runPops.push({ x: s.x1, y: s.y1, runs: res.runs, six: res.six, t: now });
          setRunsTotal((n) => n + res.runs);
          if (s.six) {
            setBoundaries((n) => n + 1);
            if (ghosts.length > 4) ghosts.shift();
            const mx = (s.x0 + s.x1) / 2;
            const my = (s.y0 + s.y1) / 2;
            const pl = Math.hypot(s.x1 - s.x0, s.y1 - s.y0) || 1;
            const bump = 0.12 * s.dist;
            ghosts.push({
              x0: s.x0, y0: s.y0, x1: s.x1, y1: s.y1,
              cx: mx + (-(s.y1 - s.y0) / pl) * bump,
              cy: my + ((s.x1 - s.x0) / pl) * bump,
              t: now,
            });
          }
          shots.splice(i, 1);
        }
      }

      const ghostLife = 7000;
      for (let i = ghosts.length - 1; i >= 0; i--) {
        const g = ghosts[i]!;
        const age = (now - g.t) / ghostLife;
        if (age >= 1) {
          ghosts.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(g.x0, g.y0);
        ctx.quadraticCurveTo(g.cx, g.cy, g.x1, g.y1);
        ctx.setLineDash([1, 5]);
        ctx.strokeStyle = `rgba(${IVORY}, ${(0.16 * (1 - age)).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      for (let i = impacts.length - 1; i >= 0; i--) {
        const im = impacts[i]!;
        const age = (now - im.t) / im.dur;
        if (age >= 1) {
          impacts.splice(i, 1);
          continue;
        }
        const e2 = 1 - Math.pow(1 - age, 3);
        ctx.beginPath();
        ctx.arc(im.x, im.y, 3 + 22 * e2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${IVORY}, ${((1 - age) * 0.55).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        for (let j = im.flecks.length - 1; j >= 0; j--) {
          const f = im.flecks[j]!;
          const fa = (now - im.t) / f.life;
          if (fa >= 1) {
            im.flecks.splice(j, 1);
            continue;
          }
          const r = f.sp * 70 * (1 - fa);
          ctx.beginPath();
          ctx.arc(im.x + Math.cos(f.a) * r, im.y + Math.sin(f.a) * r * 0.6, 1.2 * (1 - fa), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${IVORY}, ${((1 - fa) * 0.4).toFixed(3)})`;
          ctx.fill();
        }
      }

      for (let i = flashes.length - 1; i >= 0; i--) {
        const fl = flashes[i]!;
        const age = (now - fl.t) / 620;
        if (age >= 1) {
          flashes.splice(i, 1);
          continue;
        }
        const al = (1 - age) * 0.8;
        const spread = 0.14 + 0.5 * age;
        ctx.beginPath();
        ctx.ellipse(fl.cx, fl.cy, fl.rx, fl.ry, 0, fl.ang - spread, fl.ang + spread);
        ctx.strokeStyle = `rgba(${IVORY}, ${al.toFixed(3)})`;
        ctx.lineWidth = 2.4 * (1 - age) + 0.4;
        ctx.stroke();
      }

      for (let i = runPops.length - 1; i >= 0; i--) {
        const rp = runPops[i]!;
        const age = (now - rp.t) / 1000;
        if (age >= 1) {
          runPops.splice(i, 1);
          continue;
        }
        const rise = 1 - Math.pow(1 - age, 3);
        const scale = rp.six ? 1 + 0.35 * rise : 1 + 0.2 * rise;
        const alpha = 1 - age;
        ctx.save();
        ctx.translate(rp.x, rp.y - 26 * rise);
        ctx.scale(scale, scale);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (rp.six) {
          ctx.strokeStyle = `rgba(${IVORY}, ${(alpha * 0.75).toFixed(3)})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(0, 0, 13, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.font = rp.six ? '600 16px "IBM Plex Mono", monospace' : '600 13px "IBM Plex Mono", monospace';
        ctx.fillStyle = `rgba(${IVORY}, ${alpha.toFixed(3)})`;
        ctx.fillText(String(rp.runs), 0, 0);
        ctx.font = '500 8px "IBM Plex Mono", monospace';
        ctx.fillStyle = `rgba(${IVORY}, ${(alpha * 0.6).toFixed(3)})`;
        ctx.fillText(rp.six ? "SIX" : "runs", 0, rp.six ? 17 : 14);
        ctx.restore();
      }

      if (engaged && FINE) {
        const v = toView(sx, sy);
        const cr = toView(crease().x, crease().y);
        const ang = Math.round((Math.atan2(cr.y - v.y, v.x - cr.x) * 180) / Math.PI);
        const vd = Math.hypot(v.x - cr.x, v.y - cr.y);
        const yd = vd / 6.23;
        const pr = analyzeRuns(sx, sy);
        if (hudAngleRef.current) hudAngleRef.current.textContent = `${ang}°`;
        if (hudDistRef.current) hudDistRef.current.textContent = `${yd.toFixed(1)} yd`;
        if (hudRunsRef.current) hudRunsRef.current.textContent = pr.dist < 40 ? "—" : String(pr.runs);
      }

      if (FINE) {
        const targetPx = engaged ? ((sx - w / 2) / w) * 20 : 0;
        const targetPy = engaged ? ((sy - h / 2) / h) * 14 : 0;
        ppx += (targetPx - ppx) * 0.06;
        ppy += (targetPy - ppy) * 0.06;
        const pl = parallaxRef.current;
        if (pl) pl.style.transform = `translate3d(${ppx.toFixed(2)}px, ${ppy.toFixed(2)}px, 0)`;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(warmup);
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerleave", onLeave);
      const pl = parallaxRef.current;
      if (pl) pl.style.transform = "";
    };
  }, [reduced]);

  const outfield =
    "M600 268 C 862 268 1128 352 1120 452 C 1112 556 862 636 600 636 C 338 636 88 556 80 452 C 72 352 338 268 600 268 Z";

  return (
    <>
      <div ref={wrapRef} className="linen absolute inset-0 overflow-hidden" aria-hidden="true">
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid slice"
          className={`h-full w-full${reduced ? "" : " hero-anim"}`}
        >
          <defs>
            <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A3E58" />
              <stop offset="45%" stopColor="#6C7C8C" />
              <stop offset="100%" stopColor="#C9B394" />
            </linearGradient>
            <linearGradient id="turf" x1="0.18" y1="0" x2="0.86" y2="1">
              <stop offset="0%" stopColor="#2C4835" />
              <stop offset="55%" stopColor="#26402E" />
              <stop offset="100%" stopColor="#1B2B20" />
            </linearGradient>
            <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FAF6EE" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#FAF6EE" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="pool" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FAF6EE" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FAF6EE" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="vig" cx="50%" cy="47%" r="75%">
              <stop offset="55%" stopColor="#0B0F16" stopOpacity="0" />
              <stop offset="100%" stopColor="#0B0F16" stopOpacity="0.42" />
            </radialGradient>
            <pattern
              id="mow"
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-5 600 452)"
            >
              <rect width="64" height="64" fill="#2C4A36" />
              <rect width="32" height="64" fill="#1F3826" opacity="0.5" />
            </pattern>
            <pattern id="crowd" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="0.9" fill="#FAF6EE" opacity="0.5" />
              <circle cx="9" cy="5" r="0.8" fill="#C9B394" opacity="0.45" />
              <circle cx="5" cy="10" r="0.7" fill="#FAF6EE" opacity="0.3" />
              <circle cx="10.5" cy="10" r="0.7" fill="#FAF6EE" opacity="0.35" />
            </pattern>
            <clipPath id="fieldClip">
              <path d={outfield} />
            </clipPath>
          </defs>

          <rect width={VIEW_W} height={VIEW_H} fill="url(#dusk)" />

          {STARS.map(([cx, cy], i) => (
            <circle
              key={i}
              className="star"
              cx={cx}
              cy={cy}
              r={i % 3 === 0 ? 1.4 : 1}
              fill="#FAF6EE"
              style={{ animationDelay: `${(i * 0.55) % 3}s` }}
            />
          ))}

          {[150, 1050].map((x) => (
            <g key={x}>
              <polygon points={`${x},110 ${x - 66},352 ${x + 66},352`} fill="url(#beam)" opacity="0.55" />
            </g>
          ))}

          {[150, 1050].map((x) => (
            <g key={x} stroke="#171614" strokeOpacity="0.35" strokeWidth="2" fill="none">
              <line x1={x} y1="118" x2={x} y2="320" />
              <rect x={x - 30} y="94" width="60" height="24" />
              <line x1={x - 30} y1="106" x2={x + 30} y2="106" />
            </g>
          ))}

          <path
            d="M600 236 C 890 236 1176 330 1168 452 C 1160 570 890 660 600 660 C 310 660 40 570 32 452 C 24 330 310 236 600 236 Z"
            fill="#171614"
            fillOpacity="0.16"
          />
          <path
            d="M600 236 C 890 236 1176 330 1168 452 C 1160 570 890 660 600 660 C 310 660 40 570 32 452 C 24 330 310 236 600 236 Z"
            fill="url(#crowd)"
            opacity="0.7"
          />

          <g fill="#FAF6EE" fillOpacity="0.45">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path
                key={i}
                d={`M${974 + i * 22} ${344 + i * 28} q13 -17 26 0 z`}
                transform={`rotate(${-26 + i * 9} ${987 + i * 22} ${344 + i * 28})`}
              />
            ))}
          </g>

          <g>
            <rect x="536" y="244" width="128" height="26" rx="13" fill="#FAF6EE" fillOpacity="0.7" />
            <rect x="556" y="250" width="88" height="9" rx="4" fill="#2A3E58" fillOpacity="0.55" />
          </g>

          <g>
            <path d="M492 626 h216 l-22 40 h-172 z" fill="#8C2B22" fillOpacity="0.55" />
            <path d="M514 626 h172 l-12 22 h-148 z" fill="#171614" fillOpacity="0.3" />
            <line x1="600" y1="626" x2="600" y2="666" stroke="#FAF6EE" strokeOpacity="0.2" />
          </g>

          <path d={outfield} fill="url(#turf)" />

          <g clipPath="url(#fieldClip)">
            <rect width={VIEW_W} height={VIEW_H} fill="url(#mow)" opacity="0.45" />
          </g>

          <path
            d="M600 296 C 840 296 1084 370 1077 452 C 1070 544 840 612 600 612 C 360 612 130 544 123 452 C 116 370 360 296 600 296 Z"
            fill="none"
            stroke="#FAF6EE"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <ellipse
            cx="600"
            cy="452"
            rx="266"
            ry="112"
            fill="none"
            stroke="#FAF6EE"
            strokeOpacity="0.16"
            strokeWidth="1"
          />

          <g transform="rotate(-5 600 452)">
            <rect x="546" y="392" width="108" height="120" rx="2" fill="#B08363" fillOpacity="0.4" />
            <rect x="586" y="392" width="28" height="120" rx="1" fill="#D8C39F" fillOpacity="0.85" />
            <rect x="560" y="392" width="16" height="120" rx="1" fill="#D8C39F" fillOpacity="0.5" />
            <rect x="626" y="392" width="16" height="120" rx="1" fill="#D8C39F" fillOpacity="0.5" />
            <line x1="589" y1="402" x2="611" y2="402" stroke="#171614" strokeOpacity="0.4" />
            <line x1="589" y1="502" x2="611" y2="502" stroke="#171614" strokeOpacity="0.4" />
            <rect x="582" y="404" width="36" height="8" fill="#FAF6EE" fillOpacity="0.35" rx="2" />
            <rect x="582" y="490" width="36" height="8" fill="#FAF6EE" fillOpacity="0.35" rx="2" />
          </g>

          <g fill="#FAF6EE" fillOpacity="0.38">
            <rect x="926" y="278" width="52" height="16" rx="8" />
            <rect x="934" y="294" width="4" height="26" />
            <rect x="966" y="294" width="4" height="26" />
          </g>
          <g fill="#FAF6EE" fillOpacity="0.38">
            <rect x="222" y="606" width="52" height="16" rx="8" />
            <rect x="230" y="622" width="4" height="26" />
            <rect x="262" y="622" width="4" height="26" />
          </g>

          {[150, 1050].map((x) => (
            <ellipse key={x} cx={x} cy={430} rx={170} ry={56} fill="url(#pool)" />
          ))}

          <rect width={VIEW_W} height={VIEW_H} fill="url(#vig)" />
        </svg>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {reduced && (
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
          {[-140, -60, 20, 110, 190].map((d) => (
            <line
              key={d}
              x1="600"
              y1="470"
              x2={600 + 420 * Math.cos((d * Math.PI) / 180)}
              y2={470 - 300 * Math.sin((d * Math.PI) / 180)}
              stroke="#1B3A5C"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
          ))}
        </svg>
      )}

      {active && !reduced && (
        <div className="pointer-events-none absolute bottom-6 left-6 flex flex-col gap-1.5">
          <span className="num text-[10px] tracking-[0.18em] text-ivory/55">
            <span ref={hudAngleRef}>—°</span>
            <span className="mx-1.5 text-ivory/25">·</span>
            <span ref={hudDistRef}>— yd</span>
            <span className="mx-1.5 text-ivory/25">·</span>
            <span>
              R <span ref={hudRunsRef}>—</span>
            </span>
          </span>
          {runsTotal > 0 && (
            <span
              key={runsTotal}
              className="num boundary-pop text-[10px] tracking-[0.18em] text-ivory/40"
            >
              Score {String(runsTotal).padStart(2, "0")}
            </span>
          )}
          {boundaries > 0 && (
            <span
              key={`b${boundaries}`}
              className="num boundary-pop text-[10px] tracking-[0.18em] text-ivory/40"
            >
              Boundary {String(boundaries).padStart(2, "0")}
            </span>
          )}
        </div>
      )}

      <style>{`
        @keyframes heroDrift { from { transform: scale(1.02); } to { transform: scale(1.07); } }
        @keyframes starTwinkle { 0%, 100% { opacity: 0.18; } 50% { opacity: 0.9; } }
        @keyframes boundaryPop { 0% { transform: translateY(-2px); opacity: 0; } 100% { transform: none; opacity: 1; } }
        .hero-anim { animation: heroDrift 46s ease-in-out infinite alternate; transform-origin: 50% 55%; }
        .hero-anim .star { animation: starTwinkle 3.6s ease-in-out infinite; }
        .boundary-pop { animation: boundaryPop 500ms var(--ease-shot); }
      `}      </style>
      </div>

      {/* Outside the aria-hidden scene: this control is keyboard/screen-reader accessible. */}
      {!reduced && (
        <button
          type="button"
          onClick={onToggleIntro}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
          className="num absolute top-6 right-6 flex min-h-11 items-center rounded-sm border border-ivory/30 bg-[rgba(11,15,22,0.35)] px-4 text-[10px] tracking-[0.18em] text-ivory/70 backdrop-blur-sm transition-colors hover:border-ivory/60 hover:text-ivory md:top-6 md:right-10 md:min-h-0 md:px-3 md:py-1.5"
        >
          {introVisible ? "Hide text" : "Show text"}
        </button>
      )}
    </>
  );
}

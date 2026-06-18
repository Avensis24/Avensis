"use client";
import { useEffect, useRef } from "react";

/**
 * AVENSIS Global Live Background
 * Cinematic, GPU-accelerated, mobile-friendly.
 *
 * Layers (back → front):
 *  1. Depth atmosphere — drifting fog gradients
 *  2. Glass reflections — large blurred orbs moving slowly
 *  3. Light rays — soft volumetric beams
 *  4. Metallic sweeps — occasional platinum streak
 *  5. Floating particles — luxury dust on canvas (GPU friendly, capped)
 *  6. Vignette + grain for cinematic depth
 *
 * No external deps. Uses requestAnimationFrame, respects prefers-reduced-motion,
 * and pauses when the tab is hidden.
 */
export function LiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);

    type Particle = {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      a: number;
      tone: number; // 0 white, 1 platinum/gold
    };

    let particles: Particle[] = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(isMobile ? 38 : 90, Math.floor((w * h) / 22000));
      particles = new Array(target).fill(0).map(() => spawn(true));
    };

    const spawn = (initial = false): Particle => {
      const r = Math.random() * (isMobile ? 1.4 : 1.9) + 0.3;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 8,
        r,
        vx: (Math.random() - 0.5) * 0.05,
        vy: -(0.03 + Math.random() * 0.07) * (r * 0.6 + 0.4),
        a: 0.05 + Math.random() * 0.45,
        tone: Math.random() < 0.18 ? 1 : 0,
      };
    };

    const onResize = () => resize();
    const onScroll = () => {
      scrollYRef.current = window.scrollY || 0;
    };

    resize();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    let last = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      ctx.clearRect(0, 0, w, h);

      const parY = scrollYRef.current * 0.05;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!reduceMotion) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
        if (p.y + parY < -20 || p.x < -20 || p.x > w + 20) {
          particles[i] = spawn();
          continue;
        }
        const y = p.y - parY * (p.r * 0.4);
        const grad = ctx.createRadialGradient(p.x, y, 0, p.x, y, p.r * 4);
        if (p.tone === 1) {
          grad.addColorStop(0, `rgba(212,175,110,${p.a})`);
          grad.addColorStop(1, "rgba(212,175,110,0)");
        } else {
          grad.addColorStop(0, `rgba(245,240,230,${p.a})`);
          grad.addColorStop(1, "rgba(245,240,230,0)");
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) rafRef.current = requestAnimationFrame(draw);
    };

    if (reduceMotion) {
      // single static frame
      draw(performance.now());
    } else {
      rafRef.current = requestAnimationFrame(draw);
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!rafRef.current && !reduceMotion) {
        last = performance.now();
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ contain: "strict" }}
    >
      {/* Layer 1 — Depth atmosphere (base + drifting fog) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(40,32,18,0.55),transparent_60%),radial-gradient(ellipse_at_80%_110%,rgba(20,22,30,0.65),transparent_55%),linear-gradient(180deg,#070707,#0a0a0b_40%,#060606)]" />
      <div className="absolute -inset-[20%] opacity-[0.35] mix-blend-screen animate-[fogA_38s_ease-in-out_infinite] bg-[radial-gradient(40%_30%_at_30%_40%,rgba(212,175,110,0.10),transparent_70%),radial-gradient(35%_28%_at_70%_60%,rgba(180,190,210,0.07),transparent_70%)] blur-2xl" />
      <div className="absolute -inset-[25%] opacity-[0.25] mix-blend-screen animate-[fogB_52s_ease-in-out_infinite] bg-[radial-gradient(30%_24%_at_65%_30%,rgba(255,240,210,0.08),transparent_70%),radial-gradient(28%_22%_at_25%_75%,rgba(160,170,200,0.06),transparent_70%)] blur-3xl" />

      {/* Layer 2 — Glass reflections (large blurred orbs) */}
      <div className="absolute top-[10%] left-[-10%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(212,175,110,0.10),transparent_60%)] blur-3xl animate-[orbDrift1_44s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-20%] right-[-15%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(200,210,230,0.06),transparent_60%)] blur-3xl animate-[orbDrift2_60s_ease-in-out_infinite]" />

      {/* Layer 3 — Volumetric light rays */}
      <div className="absolute -top-1/3 left-1/4 h-[180%] w-[40vw] origin-top rotate-[14deg] bg-[linear-gradient(180deg,rgba(255,235,200,0.07),transparent_70%)] blur-2xl animate-[rayA_22s_ease-in-out_infinite]" />
      <div className="absolute -top-1/4 right-1/3 h-[160%] w-[28vw] origin-top -rotate-[10deg] bg-[linear-gradient(180deg,rgba(220,225,240,0.05),transparent_70%)] blur-2xl animate-[rayB_30s_ease-in-out_infinite]" />

      {/* Layer 4 — Metallic platinum sweep (rare, slow) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-1/2 h-full w-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(230,225,210,0.06),transparent)] animate-[sweep_18s_ease-in-out_infinite]" />
      </div>

      {/* Layer 5 — Particles canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Layer 6 — Vignette + film grain */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}

export default LiveBackground;

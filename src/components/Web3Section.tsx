"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionLabel, MagneticButton } from "@/components/ui-shared";

/* ─────────────────────────────────────────────
   Blockchain Node Canvas — luxury floating ecosystem
───────────────────────────────────────────── */
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
  pulseSpeed: number;
}

interface Edge {
  a: number;
  b: number;
}

function BlockchainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      init();
    };

    const init = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const count = Math.min(28, Math.floor((W * H) / 18000));
      nodesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 2 + Math.random() * 3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.018,
      }));

      // Build edges — connect nearby nodes
      const edges: Edge[] = [];
      const threshold = Math.min(W, H) * 0.38;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = nodesRef.current[i].x - nodesRef.current[j].x;
          const dy = nodesRef.current[i].y - nodesRef.current[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < threshold) edges.push({ a: i, b: j });
        }
      }
      edgesRef.current = edges;
    };

    // Gold palette
    const GOLD = "rgba(200,165,90,";
    const PLATINUM = "rgba(210,210,215,";

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      ctx.clearRect(0, 0, W, H);

      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      // Update positions
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      // Draw edges
      edges.forEach(({ a, b }) => {
        const na = nodes[a];
        const nb = nodes[b];
        const dx = na.x - nb.x;
        const dy = na.y - nb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.min(W, H) * 0.38;
        if (dist > maxDist) return;
        const alpha = (1 - dist / maxDist) * 0.28;

        const grad = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
        grad.addColorStop(0, GOLD + alpha + ")");
        grad.addColorStop(0.5, PLATINUM + (alpha * 0.5) + ")");
        grad.addColorStop(1, GOLD + alpha + ")");

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((n) => {
        const glow = (Math.sin(n.pulse) + 1) * 0.5;

        // Outer glow ring
        const radGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        radGrad.addColorStop(0, GOLD + (0.25 + glow * 0.2) + ")");
        radGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.fill();

        // Core node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.8 + glow * 0.4), 0, Math.PI * 2);
        const coreGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 1.5);
        coreGrad.addColorStop(0, PLATINUM + "0.9)");
        coreGrad.addColorStop(0.5, GOLD + "0.8)");
        coreGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // Highlight ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 1.8, 0, Math.PI * 2);
        ctx.strokeStyle = GOLD + (0.15 + glow * 0.15) + ")";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.75 }}
    />
  );
}

/* ─────────────────────────────────────────────
   Floating geometric hex elements
───────────────────────────────────────────── */
function HexElement({ size, x, y, delay, duration }: { size: number; x: string; y: string; delay: number; duration: number }) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${size / 2 + (size / 2 - 1) * Math.cos(angle)},${size / 2 + (size / 2 - 1) * Math.sin(angle)}`;
  }).join(" ");

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{ y: [0, -14, 0], rotate: [0, 8, 0], opacity: [0.12, 0.28, 0.12] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon
          points={pts}
          fill="none"
          stroke="rgba(200,165,90,0.5)"
          strokeWidth="0.8"
        />
        <polygon
          points={pts}
          fill="rgba(200,165,90,0.04)"
        />
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Service Card
───────────────────────────────────────────── */
interface Service {
  index: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
}

function ServiceCard({ service, delay }: { service: Service; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 180, damping: 20 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 180, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col cursor-default"
    >
      {/* Glass card body */}
      <div
        className="relative flex flex-col h-full overflow-hidden transition-all duration-700"
        style={{
          background: hovered
            ? "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))"
            : "linear-gradient(135deg, rgba(255,255,255,0.032), rgba(255,255,255,0.008))",
          backdropFilter: "blur(24px) saturate(150%)",
          border: hovered
            ? "1px solid rgba(200,165,90,0.30)"
            : "1px solid rgba(255,255,255,0.08)",
          borderRadius: "2px",
          boxShadow: hovered
            ? "0 0 0 1px rgba(200,165,90,0.08), 0 24px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 8px 32px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        {/* Sweep shine on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: "-100%", skewX: "-12deg" }}
          animate={hovered ? { x: "200%" } : { x: "-100%" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
            width: "60%",
          }}
        />

        {/* Gold top accent line */}
        <div
          className="absolute inset-x-0 top-0 h-px transition-all duration-700"
          style={{
            background: hovered
              ? "linear-gradient(90deg, transparent, rgba(200,165,90,0.8), transparent)"
              : "linear-gradient(90deg, transparent, rgba(200,165,90,0.2), transparent)",
          }}
        />

        <div className="p-8 flex flex-col h-full">
          {/* Index + Icon row */}
          <div className="flex items-start justify-between mb-7">
            <span className="font-display text-5xl text-foreground/10 leading-none select-none" style={{ letterSpacing: "-0.04em" }}>
              {service.index}
            </span>
            <div
              className="w-12 h-12 flex items-center justify-center transition-all duration-500"
              style={{
                background: hovered
                  ? "linear-gradient(135deg, rgba(200,165,90,0.18), rgba(200,165,90,0.06))"
                  : "rgba(255,255,255,0.04)",
                border: hovered
                  ? "1px solid rgba(200,165,90,0.35)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: hovered ? "var(--gold)" : "rgba(210,210,215,0.6)",
              }}
            >
              {service.icon}
            </div>
          </div>

          {/* Title */}
          <h3
            className="font-display text-2xl leading-tight mb-4 transition-colors duration-500"
            style={{ color: hovered ? "oklch(0.97 0.005 80)" : "oklch(0.88 0.005 80)" }}
          >
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed text-muted-foreground mb-8 flex-grow">
            {service.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] uppercase tracking-[0.3em] px-3 py-1.5 transition-all duration-500"
                style={{
                  background: hovered ? "rgba(200,165,90,0.08)" : "rgba(255,255,255,0.03)",
                  border: hovered ? "1px solid rgba(200,165,90,0.2)" : "1px solid rgba(255,255,255,0.06)",
                  color: hovered ? "rgba(200,165,90,0.9)" : "rgba(150,150,155,0.8)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Arrow indicator */}
          <div className="flex items-center gap-2 mt-6 text-[10px] uppercase tracking-[0.3em] transition-all duration-500"
            style={{ color: hovered ? "var(--gold)" : "transparent" }}>
            <span>Learn More</span>
            <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Service Icons (SVG — no external lib needed)
───────────────────────────────────────────── */
const CoinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6v2M12 16v2M9 12h6M9.5 9.5C9.5 8.67 10.67 8 12 8s2.5.67 2.5 1.5S13.33 11 12 11s-2.5.67-2.5 1.5S10.67 15 12 15s2.5-.67 2.5-1.5" />
  </svg>
);

const TokenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ContractIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="12" y2="17" />
    <path d="M9 9h1" />
  </svg>
);

const Web3Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2a10 10 0 1 0 10 10" />
    <path d="M12 2c0 0 4 4 4 10" />
    <path d="M12 2c0 0-4 4-4 10" />
    <path d="M2 12h20" />
    <circle cx="19" cy="5" r="3" />
    <path d="M19 3v2l1 1" />
  </svg>
);

const NftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const DefiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

/* ─────────────────────────────────────────────
   Services Data
───────────────────────────────────────────── */
const WEB3_SERVICES: Service[] = [
  {
    index: "01",
    icon: <CoinIcon />,
    title: "Cryptocurrency Launch",
    description:
      "Launch your own digital currency with secure tokenomics, blockchain integration, and complete deployment support.",
    tags: ["Tokenomics", "Blockchain", "Deployment"],
  },
  {
    index: "02",
    icon: <TokenIcon />,
    title: "Token Development",
    description:
      "Create custom utility tokens, governance tokens, and ecosystem tokens tailored to your business model.",
    tags: ["Utility", "Governance", "ERC-20"],
  },
  {
    index: "03",
    icon: <ContractIcon />,
    title: "Smart Contract Development",
    description:
      "Develop secure, audited, and scalable smart contracts for automation and decentralized operations.",
    tags: ["Audited", "Solidity", "Automation"],
  },
  {
    index: "04",
    icon: <Web3Icon />,
    title: "Web3 Platforms",
    description:
      "Build modern decentralized applications, Web3 ecosystems, and blockchain-powered digital experiences.",
    tags: ["dApps", "Ecosystems", "Web3"],
  },
  {
    index: "05",
    icon: <NftIcon />,
    title: "NFT Marketplaces",
    description:
      "Create NFT marketplaces, collections, minting platforms, and digital ownership ecosystems.",
    tags: ["Marketplace", "Minting", "Collections"],
  },
  {
    index: "06",
    icon: <DefiIcon />,
    title: "DeFi Applications",
    description:
      "Develop decentralized finance solutions including staking, liquidity pools, lending systems, and yield protocols.",
    tags: ["Staking", "Liquidity", "Lending"],
  },
];

/* ─────────────────────────────────────────────
   Stats Row
───────────────────────────────────────────── */
const STATS = [
  { value: "6+", label: "Blockchain Verticals" },
  { value: "100%", label: "Audited Contracts" },
  { value: "Multi-Chain", label: "Deployment Ready" },
  { value: "Enterprise", label: "Grade Security" },
];

function StatsRow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-px lg:grid-cols-4 my-20 lg:my-32"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center justify-center py-10 px-6 text-center"
          style={{ background: "rgba(10,8,6,0.8)" }}
        >
          <span
            className="font-display text-4xl lg:text-5xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.82 0.13 85), oklch(0.68 0.14 80))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {s.value}
          </span>
          <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {s.label}
          </span>
          {/* Bottom gold hairline on hover */}
          <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Web3 CTA
───────────────────────────────────────────── */
function Web3CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative mt-24 lg:mt-40 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(200,165,90,0.07), transparent)",
        }}
      />
      {/* Top hairline */}
      <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(200,165,90,0.3), transparent)" }} />

      <div className="py-24 lg:py-40 text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-10"
        >
          <span className="h-px w-8" style={{ background: "rgba(200,165,90,0.6)" }} />
          Build the Future
          <span className="h-px w-8" style={{ background: "rgba(200,165,90,0.6)" }} />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-5xl font-display text-4xl leading-[1.02] text-foreground sm:text-6xl md:text-7xl lg:text-[7rem]"
        >
          Ready to build the
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, oklch(0.82 0.13 85), oklch(0.68 0.14 80))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic",
            }}
          >
            future of Web3?
          </span>
        </motion.h2>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.35 }}
          className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground"
        >
          Launch your cryptocurrency, build blockchain solutions, and create the next generation of digital experiences with AVENSIS.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton href="https://wa.me/919693529897" target="_blank" variant="primary">
            Launch Your Web3 Project
          </MagneticButton>
          <MagneticButton href="https://wa.me/919693529897" target="_blank" variant="ghost">
            Book a Consultation
          </MagneticButton>
        </motion.div>
      </div>

      {/* Bottom hairline */}
      <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(200,165,90,0.15), transparent)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Web3 Section
───────────────────────────────────────────── */
export default function Web3Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const canvasY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      id="web3"
      ref={sectionRef}
      className="relative border-t border-border overflow-hidden"
    >
      {/* ── HERO HEADER BLOCK ── */}
      <div ref={heroRef} className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Blockchain Canvas */}
        <motion.div
          style={{ y: canvasY, opacity: canvasOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <BlockchainCanvas />
        </motion.div>

        {/* Floating hex elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <HexElement size={120} x="8%" y="15%" delay={0} duration={7} />
          <HexElement size={60} x="18%" y="65%" delay={2} duration={9} />
          <HexElement size={90} x="72%" y="10%" delay={1.5} duration={8} />
          <HexElement size={45} x="85%" y="55%" delay={0.5} duration={11} />
          <HexElement size={75} x="55%" y="75%" delay={3} duration={10} />
          <HexElement size={36} x="42%" y="25%" delay={1} duration={6} />
        </div>

        {/* Ambient gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(200,165,90,0.05), transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(210,210,215,0.03), transparent)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 py-32 lg:py-48">
          <Reveal>
            <SectionLabel>Web3 &amp; Blockchain · Enterprise Solutions</SectionLabel>
          </Reveal>

          <Reveal delay={0.12}>
            <h2 className="mt-10 max-w-4xl font-display text-5xl leading-[1.02] text-foreground sm:text-7xl lg:text-[8.5rem]">
              Web3 &amp;{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, oklch(0.82 0.13 85), oklch(0.68 0.14 80))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontStyle: "italic",
                }}
              >
                Blockchain
              </span>
              <br />
              Solutions.
            </h2>
          </Reveal>

          <Reveal delay={0.24}>
            <p
              className="mt-8 max-w-2xl font-display text-xl italic sm:text-2xl"
              style={{ color: "oklch(0.85 0.005 80)" }}
            >
              Building the Future of Decentralized Innovation.
            </p>
          </Reveal>

          <Reveal delay={0.36}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              From custom cryptocurrencies and blockchain ecosystems to smart contracts and enterprise
              Web3 platforms, AVENSIS helps businesses launch secure, scalable, and future-ready
              digital solutions.
            </p>
          </Reveal>

          {/* Scroll indicator */}
          <Reveal delay={0.48}>
            <div className="mt-14 flex items-center gap-6">
              <a
                href="#web3-services"
                className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] transition-colors duration-300"
                style={{ color: "rgba(150,150,155,0.8)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(150,150,155,0.8)")}
              >
                <span
                  className="h-px transition-all duration-500 group-hover:w-16"
                  style={{ width: "32px", background: "rgba(200,165,90,0.6)" }}
                />
                Explore Services
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <StatsRow />
      </div>

      {/* ── SERVICES GRID ── */}
      <div id="web3-services" className="mx-auto max-w-[1400px] px-6 lg:px-12 pb-4">
        <Reveal>
          <div className="mb-16">
            <SectionLabel>Our Services</SectionLabel>
            <h3 className="mt-8 max-w-3xl font-display text-3xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
              Six pillars of{" "}
              <span
                style={{
                  fontStyle: "italic",
                  background: "linear-gradient(135deg, oklch(0.82 0.13 85), oklch(0.68 0.14 80))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                decentralized
              </span>{" "}
              excellence.
            </h3>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WEB3_SERVICES.map((service, i) => (
            <ServiceCard key={service.index} service={service} delay={i * 0.08} />
          ))}
        </div>
      </div>

      {/* ── ARCHITECTURE BAND ── */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 mt-20 lg:mt-32">
        <Reveal>
          <div
            className="relative overflow-hidden py-12 px-8 lg:py-16 lg:px-16"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderTop: "1px solid rgba(200,165,90,0.2)",
            }}
          >
            {/* Light sweep */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 50% 80% at 0% 50%, rgba(200,165,90,0.04), transparent)",
              }}
            />

            <div className="relative grid gap-10 lg:grid-cols-2 items-center">
              <div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-6">
                  <span className="h-px w-8" style={{ background: "rgba(200,165,90,0.6)" }} />
                  Enterprise Architecture
                </div>
                <h3 className="font-display text-3xl lg:text-5xl text-foreground leading-tight">
                  Built for scale.
                  <br />
                  <span
                    style={{
                      fontStyle: "italic",
                      background: "linear-gradient(135deg, oklch(0.82 0.13 85), oklch(0.68 0.14 80))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Designed for trust.
                  </span>
                </h3>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground max-w-md">
                  Every solution we architect is built on enterprise-grade foundations — from
                  cryptographic security to multi-chain compatibility and regulatory readiness.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Security Audits", desc: "Every contract reviewed" },
                  { label: "Multi-Chain", desc: "EVM & beyond" },
                  { label: "Scalability", desc: "Layer 2 solutions" },
                  { label: "Compliance", desc: "Regulatory ready" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.7 }}
                    className="group p-5 transition-all duration-500"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,90,0.2)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(200,165,90,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                    }}
                  >
                    <div className="w-1 h-4 mb-3" style={{ background: "rgba(200,165,90,0.6)" }} />
                    <div className="text-[11px] uppercase tracking-[0.25em] text-foreground">{item.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{item.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── WEB3 CTA ── */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Web3CTA />
      </div>
    </section>
  );
}

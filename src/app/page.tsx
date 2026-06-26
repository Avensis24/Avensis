"use client";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  GraduationCap,
  CreditCard,
  Hotel,
  Code2,
  Sparkles,
  CloudLightning,
  Compass,
  Layers,
  Cpu,
  Infinity as InfinityIcon,
  X,
} from "lucide-react";

import { Reveal, MagneticButton, SectionLabel, ContactModal } from "@/components/ui-shared";
import Web3Section from "@/components/Web3Section";

import heroBg from "@/assets/hero-bg.jpg";
import visionBg from "@/assets/vision-bg.jpg";
import productSchool from "@/assets/product-school.jpg";
import productNfc from "@/assets/product-nfc.jpg";
import productHotel from "@/assets/product-hotel.jpg";
import productCustom from "@/assets/product-custom.jpg";

/* ---------------- Hero ---------------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Cinematic background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <video
          src="/avensis-hero.mp4"
          poster={heroBg.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background" />

        {/* Light rays */}
        <div className="pointer-events-none absolute inset-0 mix-blend-screen">
          <div className="absolute -top-32 left-1/3 h-[140%] w-32 -rotate-12 bg-gradient-to-b from-gold/20 via-gold/5 to-transparent blur-3xl animate-ray-drift" />
          <div className="absolute -top-32 right-1/4 h-[140%] w-40 rotate-12 bg-gradient-to-b from-platinum/15 to-transparent blur-3xl animate-ray-drift" style={{ animationDelay: "3s" }} />
        </div>

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-gold/60 animate-float-slow"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                animationDelay: `${(i % 8) * 0.7}s`,
                animationDuration: `${6 + (i % 5)}s`,
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <SectionLabel>Luxury Technology · Est. 2024</SectionLabel>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, letterSpacing: "0.4em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.18em" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="mt-8 font-display text-5xl text-foreground sm:text-7xl md:text-[10rem] lg:text-[13rem]"
        >
          AVENSIS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mx-auto mt-6 max-w-2xl font-display text-2xl italic text-platinum sm:text-3xl"
        >
          Turning Vision Into Innovation
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          Building intelligent digital solutions for businesses, people, and the future.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton href="#products" variant="primary">Explore Avensis</MagneticButton>
          <MagneticButton href="#products" variant="ghost">Our Products</MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Scroll</span>
        <div className="relative h-10 w-px bg-border-strong overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-3 bg-gold animate-scroll-hint" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Who We Are ---------------- */
function WhoWeAre() {
  return (
    <section className="relative py-24 lg:py-56">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal>
          <SectionLabel>Who we are</SectionLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-10 font-display text-4xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl lg:text-[8rem]">
            We don't just build <span className="italic text-gold">software.</span>
            <br />
            We build <span className="italic text-gold">experiences.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-16 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              AVENSIS creates innovative technology solutions that transform how businesses connect,
              operate, and grow — engineered with the precision of a luxury brand and the ambition of
              a category-defining startup.
            </div>
            <div className="flex flex-col gap-3 border-l border-border pl-8 text-sm uppercase tracking-[0.25em] text-muted-foreground">
              <span className="text-foreground">Designed in India</span>
              <span>For the world</span>
              <span className="text-gold">Crafted to last</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Products ---------------- */
type Product = {
  index: string;
  title: string;
  headline: React.ReactNode;
  description: string;
  image?: StaticImageData;
  video?: string;
  features: string[];
  icon: React.ReactNode;
  reverse?: boolean;
};

const PRODUCTS: Product[] = [
  {
    index: "01",
    title: "Avensis Smart NFC Identity",
    headline: <>More than a card.<br />A connection that matters.</>,
    description: "Smart NFC solutions for professionals, personal networking, pets, elderly care, and digital identity — a single tap, a lasting impression.",
    video: "/avensis-card-rotate.mp4",
    features: ["Professional & personal", "Pet & elderly care", "Tap-to-share profiles", "Lifetime identity"],
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    index: "02",
    title: "School Management Software",
    headline: <>Transforming education<br />through technology.</>,
    description: "Modern school administration platform connecting administrators, faculty, students, and parents in one intelligent ecosystem.",
    image: productSchool,
    features: ["Unified admissions", "Live academic analytics", "Parent + student portals", "Faculty workflows"],
    icon: <GraduationCap className="h-5 w-5" />,
    reverse: true,
  },
  {
    index: "03",
    title: "Hotel Management Software",
    headline: <>Redefining hospitality<br />management.</>,
    description: "A complete hotel operations platform built for modern hospitality businesses — reservations, housekeeping, and revenue, perfectly in tune.",
    image: productHotel,
    features: ["End-to-end reservations", "Channel manager", "Housekeeping flows", "Revenue intelligence"],
    icon: <Hotel className="h-5 w-5" />,
  },
  {
    index: "04",
    title: "Custom Software Development",
    headline: <>Built around<br />your vision.</>,
    description: "Custom software solutions designed to solve real business challenges — engineered from first principles, delivered with craft.",
    image: productCustom,
    features: ["Discovery & strategy", "Product design", "Engineering at scale", "Long-term partnership"],
    icon: <Code2 className="h-5 w-5" />,
    reverse: true,
  },
];



function ProductBlock({ p }: { p: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);
  const MotionImage = motion(Image);

  return (
    <div ref={ref} className="relative py-20 lg:py-40">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 lg:grid-cols-12 lg:gap-20 lg:px-12">
        <div className={"lg:col-span-5 " + (p.reverse ? "lg:order-2" : "")}>
          <Reveal>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              <span className="font-display text-base text-gold">{p.index}</span>
              <span className="h-px w-12 bg-border-strong" />
              <span>{p.title}</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="mt-8 font-display text-4xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
              {p.headline}
            </h3>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">{p.description}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <ul className="mt-10 grid grid-cols-2 gap-4 text-sm text-foreground/80">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-2 h-px w-4 bg-gold" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-12">
              <MagneticButton
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
              >
                Discover more
              </MagneticButton>
            </div>
          </Reveal>
          <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} productTitle={p.title} />
        </div>

        <div className={"lg:col-span-7 " + (p.reverse ? "lg:order-1" : "")}>
          <motion.div style={{ y }} className="relative">
            <div className="absolute -inset-10 -z-10 opacity-60" style={{ background: "var(--gradient-radial-gold)" }} />
            <div className="glass-strong relative overflow-hidden rounded-2xl bg-surface">
              {p.video ? (
                <motion.video
                  style={{ scale }}
                  src={p.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full object-contain max-h-[520px]"
                />
              ) : p.image ? (
                <MotionImage
                  style={{ scale }}
                  src={p.image}
                  alt={p.title}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="h-auto w-full object-cover"
                  placeholder="blur"
                />
              ) : null}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/15 rounded-2xl" />
            </div>
            <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span className="text-gold">{p.icon}</span>
              <span>Featured Product</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Products() {
  return (
    <section id="products" className="relative border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 pt-20 lg:pt-32 lg:px-12">
        <Reveal>
          <SectionLabel>The Products</SectionLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-8 max-w-4xl font-display text-4xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
            Four platforms.
            <br />
            <span className="italic text-gold">One philosophy.</span>
          </h2>
        </Reveal>
      </div>
      {PRODUCTS.map((p) => (
        <ProductBlock key={p.index} p={p} />
      ))}
    </section>
  );
}

/* ---------------- Why Avensis ---------------- */
const PILLARS = [
  { icon: <Sparkles className="h-5 w-5" />, title: "Innovation First", text: "We design products people remember — not features they tolerate." },
  { icon: <CloudLightning className="h-5 w-5" />, title: "Cloud Ready", text: "Built natively for the cloud, optimized for scale and performance." },
  { icon: <Compass className="h-5 w-5" />, title: "Future Focused", text: "Architected for the technologies and standards of the next decade." },
  { icon: <Layers className="h-5 w-5" />, title: "Custom Built", text: "Every interaction crafted with intent. Nothing left to defaults." },
  { icon: <InfinityIcon className="h-5 w-5" />, title: "Scalable Solutions", text: "From early-stage startups to enterprise — built to grow with you." },
  { icon: <Cpu className="h-5 w-5" />, title: "Modern Technology", text: "A modern stack, applied with restraint and engineering discipline." },
];

function WhyAvensis() {
  return (
    <section className="relative border-t border-border py-20 lg:py-48">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal><SectionLabel>Why Avensis</SectionLabel></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-8 font-display text-4xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
                A standard <br /><span className="italic text-gold">few attempt.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
                Six principles guide every line of code, every pixel, every conversation. Together they form the AVENSIS standard.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.05}>
                  <div className="group relative h-full bg-background/40 backdrop-blur-sm p-8 transition-colors hover:bg-surface">
                    <div className="flex items-center gap-3 text-gold">{p.icon}<span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">0{i + 1}</span></div>
                    <h3 className="mt-6 font-display text-2xl text-foreground">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                    <div className="absolute inset-x-8 bottom-0 h-px scale-x-0 bg-gradient-gold transition-transform duration-500 group-hover:scale-x-100" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Vision ---------------- */
function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-120, 120]);

  return (
    <section id="vision" ref={ref} className="relative h-[110vh] overflow-hidden bg-background">
      <motion.div style={{ y }} className="absolute inset-0 -top-20 -bottom-20">
        <Image src={visionBg} alt="Vision Background" fill sizes="100vw" placeholder="blur" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
        <div className="absolute inset-0 bg-background/40" />
      </motion.div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6 lg:px-12">
        <Reveal>
          <SectionLabel>The Vision</SectionLabel>
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="mt-10 max-w-5xl font-display text-4xl leading-[1.02] text-foreground sm:text-7xl md:text-8xl lg:text-[8.5rem]">
            The future belongs to those who <span className="italic text-gold">build it.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-platinum">
            AVENSIS exists to create technology that connects businesses, people, and opportunities — quietly, beautifully, and at scale.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function CTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="contact" className="relative overflow-hidden border-t border-border py-24 lg:py-56">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-background" />
        <div className="absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40" style={{ background: "var(--gradient-radial-gold)" }} />
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-gold/50 animate-float-slow"
              style={{
                left: `${(i * 41) % 100}%`,
                top: `${(i * 67) % 100}%`,
                animationDelay: `${(i % 6) * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-12">
        <Reveal><SectionLabel>Let's build</SectionLabel></Reveal>
        <Reveal delay={0.1}>
          <h2 className="mx-auto mt-10 max-w-5xl font-display text-5xl leading-[1.02] text-foreground sm:text-7xl md:text-8xl lg:text-[9rem]">
            Ready to build <span className="italic text-gold">the future?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
            Let's create something extraordinary together.
          </p>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }} variant="primary">Contact Us</MagneticButton>
            <MagneticButton href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }} variant="ghost">Book a Consultation</MagneticButton>
          </div>
        </Reveal>
        <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} productTitle="Consultation" />
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */
export default function AvensisHome() {
  return (
    <main className="relative z-10 text-foreground">
      <Hero />
      <WhoWeAre />
      <Products />
      <Web3Section />
      <WhyAvensis />
      <Vision />
      <CTA />
    </main>
  );
}

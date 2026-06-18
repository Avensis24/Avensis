"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Linkedin, Twitter, Instagram, Mail, Phone, MapPin, Menu, X } from "lucide-react";

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
} as const;

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MagneticButton({
  children,
  variant = "primary",
  href = "#",
  target,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  target?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.25);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy }}
      className={
        "group relative inline-flex items-center gap-2 px-7 py-4 text-[11px] uppercase tracking-[0.3em] transition-colors " +
        (variant === "primary"
          ? "bg-foreground text-background hover:bg-gold hover:text-background"
          : "border border-border-strong text-foreground hover:border-gold hover:text-gold")
      }
    >
      <span>{children}</span>
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.a>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
      <span className="h-px w-8 bg-gold/60" />
      {children}
    </div>
  );
}

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/#products" },
  { name: "Vision", href: "/#vision" },
  { name: "Team", href: "/team" },
  { name: "Contact", href: "/#contact" }
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 " +
          (scrolled ? "py-3 backdrop-blur-xl bg-background/40 border-b border-border" : "py-6")
        }
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <a href="/#top" className="flex items-center gap-3 relative z-[60]" onClick={() => setMobileMenuOpen(false)}>
            <img
              src="/image.png"
              alt="AVENSIS"
              className="h-10 w-auto object-contain"
            />
          </a>
          <ul className="hidden items-center gap-10 text-[11px] uppercase tracking-[0.28em] text-muted-foreground md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.name}>
                <a href={l.href} className="transition-colors hover:text-foreground">
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/919693529897"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 border border-border-strong px-4 py-2 text-[10px] uppercase tracking-[0.3em] transition-colors hover:border-gold hover:text-gold"
            >
              Get in touch
            </a>
            <button
              className="relative z-[60] p-2 text-foreground md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={false}
        animate={mobileMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, pointerEvents: "auto" },
          closed: { opacity: 0, pointerEvents: "none" }
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex flex-col justify-center bg-background/95 backdrop-blur-2xl px-6"
      >
        <ul className="flex flex-col gap-8 text-center">
          {NAV_LINKS.map((l, i) => (
            <motion.li
              key={l.name}
              variants={{
                open: { opacity: 1, y: 0, transition: { delay: i * 0.1 + 0.2 } },
                closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
              }}
            >
              <a
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-4xl text-foreground hover:text-gold"
              >
                {l.name}
              </a>
            </motion.li>
          ))}
          <motion.li
            variants={{
              open: { opacity: 1, y: 0, transition: { delay: NAV_LINKS.length * 0.1 + 0.2 } },
              closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
            }}
            className="mt-8"
          >
            <a
              href="https://wa.me/919693529897"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-2 border border-border-strong px-6 py-3 text-xs uppercase tracking-[0.3em] transition-colors hover:border-gold hover:text-gold"
            >
              Get in touch
            </a>
          </motion.li>
        </ul>
      </motion.div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/60 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img
              src="/image.png"
              alt="AVENSIS"
              className="h-12 w-auto object-contain"
            />
            <p className="mt-6 max-w-sm font-display text-xl italic text-platinum">
              Turning Vision Into Innovation.
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Premium technology for businesses, people, and the future.
            </p>
            <div className="mt-8 flex gap-3">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="inline-flex h-10 w-10 items-center justify-center border border-border-strong text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold">Products</h4>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li><a href="/#products" className="hover:text-foreground">School</a></li>
              <li><a href="/#products" className="hover:text-foreground">NFC Identity</a></li>
              <li><a href="/#products" className="hover:text-foreground">Hotel</a></li>
              <li><a href="/#products" className="hover:text-foreground">Custom</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold">Company</h4>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li><a href="/#vision" className="hover:text-foreground">Vision</a></li>
              <li><a href="/team" className="hover:text-foreground">Team</a></li>
              <li><a href="/#contact" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold">Contact</h4>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-gold" /> <a href="mailto:avensis.co.in@gmail.com" className="hover:text-gold">avensis.co.in@gmail.com</a></li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-gold" /> <a href="https://wa.me/919693529897" target="_blank" rel="noopener noreferrer" className="hover:text-gold">+91 96935 29897</a></li>
              <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-gold" /> India · Worldwide</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>© {new Date().getFullYear()} Avensis. All rights reserved.</span>
          <span>Crafted with intent.</span>
        </div>
      </div>
    </footer>
  );
}

export function FloatingContacts() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Phone Button */}
      <motion.a
        href="tel:+919693529897"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 20 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-background shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
        aria-label="Call Us"
      >
        <Phone className="h-6 w-6" />
      </motion.a>

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/919693529897"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-8 w-8"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      </motion.a>
    </div>
  );
}
